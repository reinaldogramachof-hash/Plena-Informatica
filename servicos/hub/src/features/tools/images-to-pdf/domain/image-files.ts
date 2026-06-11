export type ImageFile = {
  id: string
  file: File
  name: string
  size: number
  previewUrl: string
}

export const MAX_FILES = 20
export const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15 MB
export const MAX_TOTAL_SIZE = 50 * 1024 * 1024 // 50 MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png'] as const

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return 'Apenas imagens JPEG e PNG são aceitas'
  }
  if (file.size > MAX_FILE_SIZE) {
    return `O arquivo "${file.name}" excede o tamanho máximo de 15 MB`
  }
  return null
}

export function validateTotalSize(
  files: ImageFile[],
  newFileSize: number,
): string | null {
  const currentTotal = files.reduce((sum, f) => sum + f.size, 0)
  if (currentTotal + newFileSize > MAX_TOTAL_SIZE) {
    return 'O tamanho total das imagens excede o limite de 50 MB'
  }
  return null
}

export function createImageFile(file: File): ImageFile {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
    name: file.name,
    size: file.size,
    previewUrl: URL.createObjectURL(file),
  }
}
