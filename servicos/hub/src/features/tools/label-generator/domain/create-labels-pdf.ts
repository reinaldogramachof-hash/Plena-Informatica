import { LABEL_LAYOUTS } from './label-layouts'
import type { LabelLayout } from './label-layouts'

// Normaliza acentos para compatibilidade com Helvetica WinAnsiEncoding
function normalize(text: string): string {
  return text
    .replace(/[áàâãä]/g, 'a').replace(/[ÁÀÂÃÄ]/g, 'A')
    .replace(/[éèêë]/g,  'e').replace(/[ÉÈÊË]/g,  'E')
    .replace(/[íìîï]/g,  'i').replace(/[ÍÌÎÏ]/g,  'I')
    .replace(/[óòôõö]/g, 'o').replace(/[ÓÒÔÕÖ]/g, 'O')
    .replace(/[úùûü]/g,  'u').replace(/[ÚÙÛÜ]/g,  'U')
    .replace(/[ç]/g,     'c').replace(/[Ç]/g,     'C')
    .replace(/[ñ]/g,     'n').replace(/[Ñ]/g,     'N')
}

// Quebra texto em linhas que cabem dentro de maxWidth (em pt)
function wrapText(
  text: string,
  maxWidth: number,
  widthOf: (s: string) => number,
): string[] {
  const words = normalize(text).split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  const lines: string[] = []
  let current = ''
  for (const rawWord of words) {
    // Trunca palavra individual que não cabe
    let word = rawWord
    while (word.length > 1 && widthOf(word) > maxWidth) {
      word = word.slice(0, -1)
    }
    const test = current ? `${current} ${word}` : word
    if (widthOf(test) <= maxWidth) {
      current = test
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

export async function createLabelsPdf(
  labels: string[],
  layout: LabelLayout,
  withBorder: boolean,
): Promise<Uint8Array> {
  const validLabels = labels.filter((l) => l.trim().length > 0)
  if (validLabels.length === 0) {
    throw new Error('Nenhuma etiqueta valida para gerar o PDF.')
  }

  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
  const def = LABEL_LAYOUTS[layout]
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)

  const { fontSize, labelW, labelH, cols, capacity,
          pageWidth, pageHeight, marginTop, marginLeft, gutterH, gutterV } = def

  const PAD   = 3                      // pt de padding interno
  const lineH = fontSize * 1.3
  const maxLines = Math.max(1, Math.floor((labelH - 2 * PAD) / lineH))

  const totalPages = Math.ceil(validLabels.length / capacity)

  for (let p = 0; p < totalPages; p++) {
    const page = doc.addPage([pageWidth, pageHeight])

    const pageLabels = validLabels.slice(p * capacity, (p + 1) * capacity)

    for (let li = 0; li < pageLabels.length; li++) {
      const row = Math.floor(li / cols)
      const col = li % cols

      const cellLeft   = marginLeft + col * (labelW + gutterH)
      const cellTop    = pageHeight - marginTop - row * (labelH + gutterV)
      const cellBottom = cellTop - labelH

      // Borda
      if (withBorder) {
        page.drawRectangle({
          x: cellLeft, y: cellBottom,
          width: labelW, height: labelH,
          borderWidth: 0.5,
          borderColor: rgb(0.6, 0.6, 0.6),
        })
      }

      // Texto
      const label = pageLabels[li]!.trim()
      const textMaxW = labelW - 2 * PAD
      const widthOf = (s: string) => font.widthOfTextAtSize(s, fontSize)
      const lines = wrapText(label, textMaxW, widthOf).slice(0, maxLines)

      if (lines.length === 0) continue

      const blockH    = lines.length * lineH
      // Baseline da primeira linha (centralizado verticalmente)
      const firstBaseline = cellBottom + (labelH + blockH) / 2 - lineH + fontSize * 0.25

      for (let i = 0; i < lines.length; i++) {
        const lineText = lines[i]!
        const lineW    = font.widthOfTextAtSize(lineText, fontSize)
        const lineX    = cellLeft + PAD + (textMaxW - lineW) / 2
        page.drawText(lineText, {
          x: lineX,
          y: firstBaseline - i * lineH,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        })
      }
    }
  }

  return doc.save()
}
