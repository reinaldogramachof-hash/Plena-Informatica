import { describe, expect, it } from 'vitest'

import {
  DEFAULT_PDF_OPTIONS,
  getMarginValue,
  getPageDimensions,
} from './pdf-options'

describe('getMarginValue', () => {
  it('returns 0 for none', () => {
    expect(getMarginValue('none')).toBe(0)
  })

  it('returns 20 for small', () => {
    expect(getMarginValue('small')).toBe(20)
  })

  it('returns 40 for medium', () => {
    expect(getMarginValue('medium')).toBe(40)
  })
})

describe('getPageDimensions', () => {
  it('returns portrait A4 dimensions', () => {
    const dims = getPageDimensions('portrait')
    expect(dims.width).toBeCloseTo(595.28)
    expect(dims.height).toBeCloseTo(841.89)
  })

  it('returns landscape A4 dimensions (swapped)', () => {
    const portrait = getPageDimensions('portrait')
    const landscape = getPageDimensions('landscape')
    expect(landscape.width).toBe(portrait.height)
    expect(landscape.height).toBe(portrait.width)
  })
})

describe('DEFAULT_PDF_OPTIONS', () => {
  it('has expected default values', () => {
    expect(DEFAULT_PDF_OPTIONS.pageSize).toBe('a4')
    expect(DEFAULT_PDF_OPTIONS.orientation).toBe('portrait')
    expect(DEFAULT_PDF_OPTIONS.margin).toBe('small')
  })
})
