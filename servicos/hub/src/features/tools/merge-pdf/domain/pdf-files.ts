export interface PdfFile {
  id: string
  file: File
  name: string
  size: number
  pageCount: number | null // null until loaded
}

export const MAX_FILES = 15
export const MAX_FILE_SIZE = 30 * 1024 * 1024 // 30 MB
export const MAX_TOTAL_SIZE = 100 * 1024 * 1024 // 100 MB
export const ALLOWED_MIME = 'application/pdf'

export function validatePdfFile(file: File): string | null {
  if (file.type !== ALLOWED_MIME) {
    return 'Apenas arquivos PDF são aceitos'
  }
  if (file.size === 0) {
    return `O arquivo "${file.name}" está vazio`
  }
  if (file.size > MAX_FILE_SIZE) {
    return `O arquivo "${file.name}" excede o tamanho máximo de 30 MB`
  }
  return null
}

export function validateFileCount(current: number, adding: number): string | null {
  if (current + adding > MAX_FILES) {
    return `Máximo de ${MAX_FILES} arquivos atingido`
  }
  return null
}

export function validateTotalSize(currentTotal: number, newFileSize: number): string | null {
  if (currentTotal + newFileSize > MAX_TOTAL_SIZE) {
    return 'O tamanho total dos arquivos excede o limite de 100 MB'
  }
  return null
}

export function createPdfFile(file: File): PdfFile {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
    name: file.name,
    size: file.size,
    pageCount: null,
  }
}
