import type { ChecklistGroup } from './build-checklist'
import type { ChecklistSession } from './checklist-session'
import type { ChecklistAudience } from './checklist-catalog'

export async function createChecklistPdf(
  groups: ChecklistGroup[],
  session: ChecklistSession,
  audience: ChecklistAudience,
): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')

  const pdf = await PDFDocument.create()
  let page = pdf.addPage([595.28, 841.89]) // A4
  
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const oblique = await pdf.embedFont(StandardFonts.HelveticaOblique)

  const textC = rgb(0.1, 0.15, 0.25)
  const mutedC = rgb(0.4, 0.45, 0.5)
  const accentC = rgb(0.18, 0.34, 0.62)

  let y = 841.89 - 50
  const x = 50
  const width = 595.28 - 2 * x

  const checkPageBreak = (needed: number) => {
    if (y - needed < 50) {
      page = pdf.addPage([595.28, 841.89])
      y = 841.89 - 50
    }
  }

  // Título e cabeçalho
  const title = audience === 'mei' ? 'Checklist MEI' : 'Checklist IRPF'
  page.drawText(title, { x, y, size: 20, font: bold, color: textC })
  
  // Data de geração
  const dateStr = new Date().toLocaleDateString('pt-BR')
  const dateLabel = `Gerado em: ${dateStr}`
  const dateWidth = bold.widthOfTextAtSize(dateLabel, 10)
  page.drawText(dateLabel, { x: 595.28 - x - dateWidth, y: y + 5, size: 10, font: bold, color: mutedC })

  y -= 25
  page.drawText('Plena Informatica - Guia de Preparacao de Documentos', { x, y, size: 11, font: oblique, color: mutedC })
  y -= 20

  page.drawLine({ start: { x, y }, end: { x: 595.28 - x, y }, thickness: 1, color: accentC })
  y -= 30

  // Se houver grupos
  if (groups.length > 0) {
    for (const group of groups) {
      checkPageBreak(40)
      
      // Nome do grupo em negrito
      page.drawText(group.category, { x, y, size: 13, font: bold, color: textC })
      y -= 20

      for (const item of group.items) {
        checkPageBreak(50)

        const isChecked = session.checked.has(item.id)

        // Desenhar checkbox visual
        page.drawRectangle({
          x,
          y: y - 2,
          width: 12,
          height: 12,
          borderColor: textC,
          borderWidth: 1,
        })

        if (isChecked) {
          page.drawLine({
            start: { x: x + 2, y: y + 4 },
            end: { x: x + 5, y: y + 1 },
            thickness: 1.5,
            color: accentC,
          })
          page.drawLine({
            start: { x: x + 5, y: y + 1 },
            end: { x: x + 10, y: y + 7 },
            thickness: 1.5,
            color: accentC,
          })
        }

        // Desenhar Título do Item
        page.drawText(item.title, { x: x + 25, y, size: 11, font: bold, color: textC })
        y -= 15

        // Desenhar Descrição (quebrar se for muito longa)
        const descWords = item.description.split(' ')
        let currentLine = ''
        const lines: string[] = []
        for (const word of descWords) {
          if ((currentLine + ' ' + word).length * 5.5 < width - 30) {
            currentLine += (currentLine ? ' ' : '') + word
          } else {
            lines.push(currentLine)
            currentLine = word
          }
        }
        if (currentLine) lines.push(currentLine)

        for (const line of lines) {
          checkPageBreak(15)
          page.drawText(line, { x: x + 25, y, size: 9, font: regular, color: textC })
          y -= 12
        }

        // Desenhar Atenção (se houver)
        if (item.attention) {
          checkPageBreak(15)
          page.drawText(`Nota: ${item.attention}`, { x: x + 25, y, size: 8.5, font: oblique, color: mutedC })
          y -= 12
        }

        y -= 10 // Espaçamento entre itens
      }
      y -= 10 // Espaçamento extra entre grupos
    }
  } else {
    page.drawText('Nenhum item selecionado ou disponivel para este cenário.', { x, y, size: 11, font: oblique, color: mutedC })
    y -= 30
  }

  // Rodapé
  checkPageBreak(40)
  y = Math.max(y - 10, 50)
  page.drawLine({ start: { x, y }, end: { x: 595.28 - x, y }, thickness: 0.5, color: mutedC })
  y -= 15
  page.drawText('Este checklist é apenas orientativo e não substitui orientação contábil, fiscal ou jurídica. Gerado por Plena Informática.', {
    x,
    y,
    size: 8,
    font: regular,
    color: mutedC,
  })

  return pdf.save()
}
