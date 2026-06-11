import type { PDFDocument } from 'pdf-lib'

export interface PdfMetadataReader {
  load(bytes: ArrayBuffer): Promise<PDFDocument>
}

const defaultReader: PdfMetadataReader = {
  async load(bytes: ArrayBuffer): Promise<PDFDocument> {
    const { PDFDocument } = await import('pdf-lib')
    return PDFDocument.load(bytes)
  },
}

export async function readPageCount(
  file: File,
  deps?: { reader?: PdfMetadataReader },
): Promise<number> {
  const reader = deps?.reader ?? defaultReader
  const bytes = await file.arrayBuffer()
  try {
    const doc = await reader.load(bytes)
    return doc.getPageCount()
  } catch (err) {
    const message = err instanceof Error ? err.message.toLowerCase() : ''
    if (message.includes('encrypt')) {
      throw new Error(
        `O arquivo "${file.name}" está criptografado e não pode ser lido`,
        { cause: err },
      )
    }
    throw new Error(
      `O arquivo "${file.name}" está corrompido ou não é um PDF válido`,
      { cause: err },
    )
  }
}
