import { describe, expect, it } from 'vitest'

import { LABEL_LAYOUTS } from './label-layouts'
import type { LabelLayout } from './label-layouts'

const ALL_LAYOUTS: LabelLayout[] = ['2x6', '3x9', '4x13']

describe('LABEL_LAYOUTS', () => {
  it('define as tres chaves esperadas', () => {
    expect(Object.keys(LABEL_LAYOUTS).sort()).toEqual(['2x6', '3x9', '4x13'].sort())
  })

  it.each(ALL_LAYOUTS)('%s: capacity = cols * rows', (layout) => {
    const def = LABEL_LAYOUTS[layout]
    expect(def.capacity).toBe(def.cols * def.rows)
  })

  it('2x6 tem capacidade 12', () => {
    expect(LABEL_LAYOUTS['2x6'].capacity).toBe(12)
  })

  it('3x9 tem capacidade 27', () => {
    expect(LABEL_LAYOUTS['3x9'].capacity).toBe(27)
  })

  it('4x13 tem capacidade 52', () => {
    expect(LABEL_LAYOUTS['4x13'].capacity).toBe(52)
  })

  it.each(ALL_LAYOUTS)('%s: labelW e labelH sao positivos', (layout) => {
    const def = LABEL_LAYOUTS[layout]
    expect(def.labelW).toBeGreaterThan(0)
    expect(def.labelH).toBeGreaterThan(0)
  })

  it.each(ALL_LAYOUTS)('%s: colunas cabem na pagina', (layout) => {
    const def = LABEL_LAYOUTS[layout]
    const totalW = 2 * def.marginLeft + def.cols * def.labelW + (def.cols - 1) * def.gutterH
    expect(totalW).toBeCloseTo(def.pageWidth, 1)
  })

  it.each(ALL_LAYOUTS)('%s: linhas cabem na pagina', (layout) => {
    const def = LABEL_LAYOUTS[layout]
    const totalH = 2 * def.marginTop + def.rows * def.labelH + (def.rows - 1) * def.gutterV
    expect(totalH).toBeCloseTo(def.pageHeight, 1)
  })

  it.each(ALL_LAYOUTS)('%s: fontSize e positivo', (layout) => {
    expect(LABEL_LAYOUTS[layout].fontSize).toBeGreaterThan(0)
  })
})
