import { describe, expect, it } from 'vitest'

import {
  ALLOWED_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES,
  MAX_TOTAL_SIZE,
  createImageFile,
  validateImageFile,
  validateTotalSize,
  type ImageFile,
} from './image-files'

function makeFile(name: string, type: string, size: number): File {
  const blob = new Blob(['x'.repeat(Math.min(size, 1))], { type })
  return new File([blob], name, { type })
}

describe('validateImageFile', () => {
  it('returns null for a valid JPEG', () => {
    const file = makeFile('photo.jpg', 'image/jpeg', 1024)
    expect(validateImageFile(file)).toBeNull()
  })

  it('returns null for a valid PNG', () => {
    const file = makeFile('image.png', 'image/png', 1024)
    expect(validateImageFile(file)).toBeNull()
  })

  it('returns error for an unsupported type', () => {
    const file = makeFile('doc.gif', 'image/gif', 1024)
    expect(validateImageFile(file)).toBe('Apenas imagens JPEG e PNG são aceitas')
  })

  it('returns error when file exceeds MAX_FILE_SIZE', () => {
    const oversized = makeFile('big.jpg', 'image/jpeg', MAX_FILE_SIZE + 1)
    Object.defineProperty(oversized, 'size', { value: MAX_FILE_SIZE + 1 })
    const file = new File([], 'big.jpg', { type: 'image/jpeg' })
    Object.defineProperty(file, 'size', { value: MAX_FILE_SIZE + 1 })
    expect(validateImageFile(file)).toContain('excede o tamanho máximo')
  })
})

describe('validateTotalSize', () => {
  it('returns null when under the limit', () => {
    const files: ImageFile[] = []
    expect(validateTotalSize(files, 1024)).toBeNull()
  })

  it('returns error when adding would exceed MAX_TOTAL_SIZE', () => {
    const files: ImageFile[] = [
      {
        id: '1',
        file: makeFile('a.jpg', 'image/jpeg', 1),
        name: 'a.jpg',
        size: MAX_TOTAL_SIZE - 100,
        previewUrl: '',
      },
    ]
    expect(validateTotalSize(files, 200)).toBe(
      'O tamanho total das imagens excede o limite de 50 MB',
    )
  })
})

describe('createImageFile', () => {
  it('returns an ImageFile with the correct properties', () => {
    const file = makeFile('test.png', 'image/png', 500)
    const imageFile = createImageFile(file)
    expect(imageFile.name).toBe('test.png')
    expect(imageFile.size).toBe(file.size)
    expect(imageFile.file).toBe(file)
    expect(imageFile.id).toBeTruthy()
    expect(imageFile.previewUrl).toMatch(/^blob:/)
  })
})

describe('constants', () => {
  it('has expected values', () => {
    expect(MAX_FILES).toBe(20)
    expect(MAX_FILE_SIZE).toBe(15 * 1024 * 1024)
    expect(MAX_TOTAL_SIZE).toBe(50 * 1024 * 1024)
    expect(ALLOWED_TYPES).toContain('image/jpeg')
    expect(ALLOWED_TYPES).toContain('image/png')
  })
})
