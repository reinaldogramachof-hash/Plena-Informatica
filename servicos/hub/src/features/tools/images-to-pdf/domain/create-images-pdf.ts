import { PDFDocument } from 'pdf-lib'

import { getMarginValue, getPageDimensions, type PdfOptions } from './pdf-options'

export type ImageData = {
  arrayBuffer: ArrayBuffer
  mimeType: 'image/jpeg' | 'image/png'
}

export type CreatePdfDeps = {
  createPdf: () => Promise<PDFDocument>
}

const defaultDeps: CreatePdfDeps = {
  createPdf: () => PDFDocument.create(),
}

export async function createImagesPdf(
  images: ImageData[],
  options: PdfOptions,
  deps: Partial<CreatePdfDeps> = {},
): Promise<Uint8Array> {
  const { createPdf } = { ...defaultDeps, ...deps }
  const pdfDoc = await createPdf()
  const { width, height } = getPageDimensions(options.orientation)
  const margin = getMarginValue(options.margin)

  for (const imageData of images) {
    let pdfImage
    if (imageData.mimeType === 'image/jpeg') {
      pdfImage = await pdfDoc.embedJpg(imageData.arrayBuffer)
    } else {
      pdfImage = await pdfDoc.embedPng(imageData.arrayBuffer)
    }

    const page = pdfDoc.addPage([width, height])
    const contentWidth = width - margin * 2
    const contentHeight = height - margin * 2

    // Fit image within content area preserving aspect ratio
    const imgAspect = pdfImage.width / pdfImage.height
    const contentAspect = contentWidth / contentHeight

    let drawWidth: number
    let drawHeight: number

    if (imgAspect > contentAspect) {
      drawWidth = contentWidth
      drawHeight = contentWidth / imgAspect
    } else {
      drawHeight = contentHeight
      drawWidth = contentHeight * imgAspect
    }

    // Center on page
    const x = margin + (contentWidth - drawWidth) / 2
    const y = margin + (contentHeight - drawHeight) / 2

    page.drawImage(pdfImage, { x, y, width: drawWidth, height: drawHeight })
  }

  return pdfDoc.save()
}
