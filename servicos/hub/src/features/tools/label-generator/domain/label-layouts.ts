// Catálogo único de dimensões de etiquetas — compartilhado entre prévia e PDF.
// Todas as medidas em pontos tipográficos (pt).  A4 = 595.28 × 841.89 pt.

export type LabelLayout = '2x6' | '3x9' | '4x13'

export interface LabelLayoutDef {
  cols: number
  rows: number
  pageWidth: number
  pageHeight: number
  marginTop: number
  marginLeft: number
  gutterH: number   // espaço horizontal entre colunas
  gutterV: number   // espaço vertical entre linhas
  labelW: number    // largura da etiqueta (calculada)
  labelH: number    // altura da etiqueta (calculada)
  capacity: number  // cols × rows
  fontSize: number  // tamanho base do texto
}

function makeDef(
  cols: number,
  rows: number,
  marginTop: number,
  marginLeft: number,
  gutterH: number,
  gutterV: number,
  fontSize: number,
): LabelLayoutDef {
  const pageWidth  = 595.28
  const pageHeight = 841.89
  const usableW = pageWidth  - 2 * marginLeft
  const usableH = pageHeight - 2 * marginTop
  const labelW = (usableW - (cols - 1) * gutterH) / cols
  const labelH = (usableH - (rows - 1) * gutterV) / rows
  return {
    cols, rows, pageWidth, pageHeight,
    marginTop, marginLeft, gutterH, gutterV,
    labelW, labelH,
    capacity: cols * rows,
    fontSize,
  }
}

export const LABEL_LAYOUTS: Record<LabelLayout, LabelLayoutDef> = {
  '2x6':  makeDef(2, 6,  28, 28, 6, 3, 9),
  '3x9':  makeDef(3, 9,  20, 20, 4, 2, 7),
  '4x13': makeDef(4, 13, 14, 14, 3, 2, 5.5),
}
