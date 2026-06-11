import { describe, expect, it } from 'vitest'

import { mergePdfFiles, type MergeDeps } from './merge-pdf-files'

function makeFile(name: string, content = 'pdf'): File {
  return new File([content], name, { type: 'application/pdf' })
}

function makeMockDeps(pageCountPerDoc: number[] = []): MergeDeps & { addedPages: number[] } {
  const addedPages: number[] = []
  let docIndex = 0

  return {
    addedPages,
    async createPdf() {
      const pages: unknown[] = []
      return {
        addPage(page: unknown) {
          pages.push(page)
          addedPages.push(page as number)
        },
        getPageCount: () => pages.length,
        copyPages(_srcDoc: unknown, indices: number[]) {
          return Promise.resolve(indices)
        },
        save: async () => new Uint8Array([1, 2, 3]),
      } as never
    },
    async loadPdf() {
      const count = pageCountPerDoc[docIndex++] ?? 2
      const indices = Array.from({ length: count }, (_, i) => i)
      return {
        getPageIndices: () => indices,
        getPageCount: () => count,
      } as never
    },
  }
}

describe('mergePdfFiles', () => {
  it('returns a Uint8Array', async () => {
    const deps = makeMockDeps([1])
    const result = await mergePdfFiles([makeFile('a.pdf')], deps)
    expect(result).toBeInstanceOf(Uint8Array)
  })

  it('merges pages in correct order from multiple files', async () => {
    const deps = makeMockDeps([2, 3])
    await mergePdfFiles([makeFile('a.pdf'), makeFile('b.pdf')], deps)
    // 2 pages from first doc + 3 pages from second = 5 total
    expect(deps.addedPages).toHaveLength(5)
    // Pages from first doc (indices 0,1) come before second doc (indices 0,1,2)
    expect(deps.addedPages).toEqual([0, 1, 0, 1, 2])
  })

  it('returns a PDF with 0 pages for empty file array', async () => {
    const deps = makeMockDeps([])
    const result = await mergePdfFiles([], deps)
    expect(result).toBeInstanceOf(Uint8Array)
    expect(deps.addedPages).toHaveLength(0)
  })
})
