import type { PDFDocument } from 'pdf-lib'

export interface MergeDeps {
  createPdf(): Promise<PDFDocument>
  loadPdf(bytes: ArrayBuffer): Promise<PDFDocument>
}

const defaultDeps: MergeDeps = {
  async createPdf(): Promise<PDFDocument> {
    const { PDFDocument } = await import('pdf-lib')
    return PDFDocument.create()
  },
  async loadPdf(bytes: ArrayBuffer): Promise<PDFDocument> {
    const { PDFDocument } = await import('pdf-lib')
    return PDFDocument.load(bytes)
  },
}

export async function mergePdfFiles(
  files: File[],
  deps?: Partial<MergeDeps>,
): Promise<Uint8Array> {
  const { createPdf, loadPdf } = { ...defaultDeps, ...deps }
  const mergedDoc = await createPdf()

  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const srcDoc = await loadPdf(bytes)
    const pages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices())
    for (const page of pages) {
      mergedDoc.addPage(page)
    }
  }

  return mergedDoc.save()
}
