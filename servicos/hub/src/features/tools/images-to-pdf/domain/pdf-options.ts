export type PageSize = 'a4'
export type Orientation = 'portrait' | 'landscape'
export type Margin = 'none' | 'small' | 'medium'

export interface PdfOptions {
  pageSize: PageSize
  orientation: Orientation
  margin: Margin
}

export const DEFAULT_PDF_OPTIONS: PdfOptions = {
  pageSize: 'a4',
  orientation: 'portrait',
  margin: 'small',
}

export function getMarginValue(margin: Margin): number {
  switch (margin) {
    case 'none':
      return 0
    case 'small':
      return 20
    case 'medium':
      return 40
  }
}

// A4 dimensions in points (72 dpi)
const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89

export function getPageDimensions(orientation: Orientation): {
  width: number
  height: number
} {
  if (orientation === 'landscape') {
    return { width: A4_HEIGHT, height: A4_WIDTH }
  }
  return { width: A4_WIDTH, height: A4_HEIGHT }
}
