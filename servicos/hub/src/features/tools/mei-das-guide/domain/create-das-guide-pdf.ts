import type { DasInfo } from './das-values'

export async function createDasGuidePdf(
  dasInfo: DasInfo | null,
  paidMonths: Set<number>,
): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')

  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89]) // A4
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const oblique = await pdf.embedFont(StandardFonts.HelveticaOblique)

  const textC = rgb(0.1, 0.15, 0.25)
  const mutedC = rgb(0.4, 0.45, 0.5)
  const accentC = rgb(0.18, 0.34, 0.62)
  const successC = rgb(0.1, 0.6, 0.2)

  let y = 841.89 - 50
  const x = 50

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  // Título
  page.drawText('Guia DAS MEI - Organizacao e Valores', { x, y, size: 20, font: bold, color: textC })
  y -= 25
  page.drawText('Plena Informatica - Documento de Apoio', { x, y, size: 12, font: oblique, color: mutedC })
  y -= 40

  page.drawLine({ start: { x, y }, end: { x: 595.28 - x, y }, thickness: 1, color: accentC })
  y -= 30

  // Seção: Valores do DAS
  page.drawText('VALORES DO DAS', { x, y, size: 14, font: bold, color: textC })
  y -= 25

  if (dasInfo) {
    page.drawText(`Referencia: ${dasInfo.year} - ${dasInfo.sourceLabel}`, { x, y, size: 11, font: regular, color: mutedC })
    y -= 20

    for (const row of dasInfo.components) {
      page.drawText(row.component, { x, y, size: 11, font: regular, color: textC })
      page.drawText(formatCurrency(row.value), { x: x + 150, y, size: 11, font: regular, color: textC })
      page.drawText(row.note, { x: x + 250, y, size: 10, font: oblique, color: mutedC })
      y -= 15
    }

    y -= 10
    page.drawText('Total a pagar:', { x, y, size: 12, font: bold, color: textC })
    page.drawText(formatCurrency(dasInfo.total), { x: x + 150, y, size: 12, font: bold, color: accentC })
    y -= 30
  } else {
    page.drawText('Nenhuma atividade foi selecionada.', { x, y, size: 11, font: oblique, color: mutedC })
    y -= 30
  }

  page.drawLine({ start: { x, y }, end: { x: 595.28 - x, y }, thickness: 0.5, color: mutedC })
  y -= 30

  // Seção: Situação das guias
  page.drawText('CONTROLE DE PAGAMENTO (MESES)', { x, y, size: 14, font: bold, color: textC })
  y -= 25

  const MONTHS = [
    'Janeiro', 'Fevereiro', 'Marco', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]

  let col = 0
  const initialY = y
  for (let i = 0; i < MONTHS.length; i++) {
    const isPaid = paidMonths.has(i)
    const monthName = MONTHS[i]

    page.drawText(`[ ${isPaid ? 'X' : ' '} ] ${monthName}`, { 
      x: x + col * 150, 
      y, 
      size: 11, 
      font: isPaid ? bold : regular, 
      color: isPaid ? successC : textC 
    })

    y -= 20
    if ((i + 1) % 6 === 0) {
      col++
      y = initialY
    }
  }

  y = initialY - 140
  page.drawText(`Total pago: ${paidMonths.size} de 12 meses`, { x, y, size: 12, font: bold, color: textC })

  y -= 40
  page.drawText('Aviso: Este guia e apenas orientativo e nao substitui as fontes oficiais do governo.', { x, y, size: 9, font: oblique, color: mutedC })

  return pdf.save()
}
