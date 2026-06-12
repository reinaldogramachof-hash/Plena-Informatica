import { describe, expect, it, vi } from 'vitest'

import { createImagesPdf, type ImageData } from './create-images-pdf'
import { DEFAULT_PDF_OPTIONS } from './pdf-options'

function makeMockPdfDoc(pageCount = { value: 0 }) {
  const pages: unknown[] = []

  const mockImage = { width: 100, height: 100 }

  const doc = {
    embedJpg: vi.fn().mockResolvedValue(mockImage),
    embedPng: vi.fn().mockResolvedValue(mockImage),
    addPage: vi.fn().mockImplementation(() => {
      const page = { drawImage: vi.fn() }
      pages.push(page)
      pageCount.value++
      return page
    }),
    save: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    getPageCount: () => pageCount.value,
  }

  return doc
}

describe('createImagesPdf', () => {
  it('creates one page per image', async () => {
    const counter = { value: 0 }
    const mockDoc = makeMockPdfDoc(counter)

    const images: ImageData[] = [
      { arrayBuffer: new ArrayBuffer(8), mimeType: 'image/jpeg' },
      { arrayBuffer: new ArrayBuffer(8), mimeType: 'image/png' },
    ]

    await createImagesPdf(images, DEFAULT_PDF_OPTIONS, {
      createPdf: vi.fn().mockResolvedValue(mockDoc),
    })

    expect(mockDoc.addPage).toHaveBeenCalledTimes(2)
    expect(mockDoc.embedJpg).toHaveBeenCalledTimes(1)
    expect(mockDoc.embedPng).toHaveBeenCalledTimes(1)
    expect(mockDoc.save).toHaveBeenCalledTimes(1)
  })

  it('handles empty array and returns a PDF with 0 pages', async () => {
    const mockDoc = makeMockPdfDoc()

    const result = await createImagesPdf([], DEFAULT_PDF_OPTIONS, {
      createPdf: vi.fn().mockResolvedValue(mockDoc),
    })

    expect(mockDoc.addPage).not.toHaveBeenCalled()
    expect(result).toBeInstanceOf(Uint8Array)
  })
})
