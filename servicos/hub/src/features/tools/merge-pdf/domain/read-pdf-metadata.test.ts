import { describe, expect, it } from 'vitest'

import { readPageCount, type PdfMetadataReader } from './read-pdf-metadata'

function makeFile(name: string, content = 'pdf-bytes'): File {
  return new File([content], name, { type: 'application/pdf' })
}

describe('readPageCount', () => {
  it('returns the correct page count for a valid PDF', async () => {
    const mockDoc = { getPageCount: () => 3 }
    const mockReader: PdfMetadataReader = {
      load: async () => mockDoc as never,
    }

    const file = makeFile('valid.pdf')
    const count = await readPageCount(file, { reader: mockReader })
    expect(count).toBe(3)
  })

  it('throws a PT-BR error for an encrypted PDF', async () => {
    const mockReader: PdfMetadataReader = {
      load: async () => {
        throw new Error('encrypted pdf cannot be loaded without password')
      },
    }

    const file = makeFile('locked.pdf')
    await expect(readPageCount(file, { reader: mockReader })).rejects.toThrow(
      /criptografado/,
    )
  })

  it('throws a PT-BR error for a corrupted or invalid PDF', async () => {
    const mockReader: PdfMetadataReader = {
      load: async () => {
        throw new Error('Invalid PDF structure')
      },
    }

    const file = makeFile('corrupted.pdf')
    await expect(readPageCount(file, { reader: mockReader })).rejects.toThrow(
      /corrompido|não é um PDF válido/,
    )
  })
})
