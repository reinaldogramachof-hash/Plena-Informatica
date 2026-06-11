import type { PDFFont, PDFPage } from 'pdf-lib'

import type { DeclarationDocument } from './build-declaration'

export type DeclarationPdfRenderer = (
  document: DeclarationDocument,
) => Promise<Uint8Array>

const pageSize: [number, number] = [595.28, 841.89]
const margin = 64
const footerHeight = 76
const contentBottom = margin + footerHeight

function wrapText(
  text: string,
  font: Pick<PDFFont, 'widthOfTextAtSize'>,
  size: number,
  width: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (current && font.widthOfTextAtSize(candidate, size) > width) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
}

export const renderDeclarationPdf: DeclarationPdfRenderer = async (document) => {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
  const pdf = await PDFDocument.create()
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const width = pageSize[0] - margin * 2
  let page!: PDFPage
  let y = 0

  const drawFooter = (targetPage: PDFPage, number: number) => {
    const footerLines = wrapText(document.footerNote, regular, 7.4, width)
    targetPage.drawLine({
      start: { x: margin, y: 58 },
      end: { x: pageSize[0] - margin, y: 58 },
      thickness: 0.5,
      color: rgb(0.78, 0.81, 0.85),
    })
    let footerY = 45
    for (const line of footerLines.slice(0, 3)) {
      targetPage.drawText(line, {
        x: margin,
        y: footerY,
        size: 7.4,
        font: regular,
        color: rgb(0.36, 0.4, 0.47),
      })
      footerY -= 10
    }
    targetPage.drawText(`Página ${number}`, {
      x: pageSize[0] - margin - 34,
      y: 18,
      size: 7.4,
      font: regular,
      color: rgb(0.36, 0.4, 0.47),
    })
  }

  const addPage = (continuation = false) => {
    page = pdf.addPage(pageSize)
    y = page.getHeight() - 82

    if (continuation) {
      page.drawText(`${document.title.toUpperCase()} - CONTINUAÇÃO`, {
        x: margin,
        y,
        size: 9,
        font: bold,
        color: rgb(0.35, 0.4, 0.48),
      })
      y -= 34
    } else {
      const titleLines = wrapText(
        document.title.toUpperCase(),
        bold,
        16,
        width,
      )
      for (const line of titleLines) {
        page.drawText(line, {
          x: margin,
          y,
          size: 16,
          font: bold,
          color: rgb(0.02, 0.1, 0.21),
        })
        y -= 22
      }
      y -= 34
    }

    return page
  }

  const ensureSpace = (height: number) => {
    if (y - height < contentBottom) addPage(true)
  }

  const drawParagraph = (paragraph: string) => {
    const lines = wrapText(paragraph, regular, 11, width)
    const requiredHeight = lines.length * 18 + 18

    if (requiredHeight <= y - contentBottom) {
      for (const line of lines) {
        page.drawText(line, { x: margin, y, size: 11, font: regular })
        y -= 18
      }
      y -= 18
      return
    }

    for (const line of lines) {
      ensureSpace(18)
      page.drawText(line, { x: margin, y, size: 11, font: regular })
      y -= 18
    }
    y -= 18
  }

  addPage()

  for (const paragraph of document.paragraphs) {
    drawParagraph(paragraph)
  }

  ensureSpace(150)
  y -= 12
  if (document.locationDate) {
    page.drawText(document.locationDate, {
      x: margin,
      y,
      size: 11,
      font: regular,
    })
  }
  y -= 74
  page.drawLine({
    start: { x: margin, y },
    end: { x: margin + 250, y },
    thickness: 0.7,
    color: rgb(0.35, 0.4, 0.48),
  })
  y -= 17
  page.drawText(document.signatureName, {
    x: margin,
    y,
    size: 11,
    font: bold,
  })
  y -= 15
  page.drawText(document.signatureLabel, {
    x: margin,
    y,
    size: 9,
    font: regular,
    color: rgb(0.35, 0.4, 0.48),
  })
  if (document.signatureDocument) {
    y -= 13
    page.drawText(document.signatureDocument, {
      x: margin,
      y,
      size: 8.5,
      font: regular,
      color: rgb(0.35, 0.4, 0.48),
    })
  }

  pdf.getPages().forEach((item, index) => drawFooter(item, index + 1))

  return pdf.save()
}

export function createDeclarationPdf(
  document: DeclarationDocument,
  renderer: DeclarationPdfRenderer = renderDeclarationPdf,
): Promise<Uint8Array> {
  return renderer(document)
}
