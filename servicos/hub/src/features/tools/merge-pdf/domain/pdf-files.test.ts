import { describe, expect, it } from 'vitest'

import {
  ALLOWED_MIME,
  MAX_FILE_SIZE,
  MAX_FILES,
  MAX_TOTAL_SIZE,
  createPdfFile,
  validateFileCount,
  validatePdfFile,
  validateTotalSize,
} from './pdf-files'

function makeFile(name: string, type: string, size: number): File {
  const file = new File([], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

describe('validatePdfFile', () => {
  it('returns null for a valid PDF', () => {
    const file = makeFile('doc.pdf', 'application/pdf', 1024)
    expect(validatePdfFile(file)).toBeNull()
  })

  it('returns error for a non-PDF file', () => {
    const file = makeFile('image.jpg', 'image/jpeg', 1024)
    expect(validatePdfFile(file)).toBe('Apenas arquivos PDF são aceitos')
  })

  it('returns error for an empty file (size 0)', () => {
    const file = makeFile('empty.pdf', 'application/pdf', 0)
    expect(validatePdfFile(file)).toContain('está vazio')
  })

  it('returns error when file exceeds MAX_FILE_SIZE', () => {
    const file = makeFile('big.pdf', 'application/pdf', MAX_FILE_SIZE + 1)
    expect(validatePdfFile(file)).toContain('excede o tamanho máximo')
  })
})

describe('validateFileCount', () => {
  it('returns null when within the limit', () => {
    expect(validateFileCount(5, 3)).toBeNull()
  })

  it('returns error when count exceeds MAX_FILES', () => {
    expect(validateFileCount(MAX_FILES, 1)).toContain(`Máximo de ${MAX_FILES}`)
  })

  it('returns error when count exactly exceeds MAX_FILES', () => {
    expect(validateFileCount(MAX_FILES - 1, 2)).toContain(`Máximo de ${MAX_FILES}`)
  })
})

describe('validateTotalSize', () => {
  it('returns null when under the limit', () => {
    expect(validateTotalSize(0, 1024)).toBeNull()
  })

  it('returns error when adding would exceed MAX_TOTAL_SIZE', () => {
    expect(validateTotalSize(MAX_TOTAL_SIZE - 100, 200)).toBe(
      'O tamanho total dos arquivos excede o limite de 100 MB',
    )
  })
})

describe('createPdfFile', () => {
  it('creates a PdfFile with correct properties and null pageCount', () => {
    const file = makeFile('test.pdf', 'application/pdf', 500)
    const pdfFile = createPdfFile(file)
    expect(pdfFile.name).toBe('test.pdf')
    expect(pdfFile.size).toBe(file.size)
    expect(pdfFile.file).toBe(file)
    expect(pdfFile.id).toBeTruthy()
    expect(pdfFile.pageCount).toBeNull()
  })
})

describe('constants', () => {
  it('has expected values', () => {
    expect(MAX_FILES).toBe(15)
    expect(MAX_FILE_SIZE).toBe(30 * 1024 * 1024)
    expect(MAX_TOTAL_SIZE).toBe(100 * 1024 * 1024)
    expect(ALLOWED_MIME).toBe('application/pdf')
  })
})
