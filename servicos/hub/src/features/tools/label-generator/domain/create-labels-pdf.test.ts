import { describe, expect, it } from 'vitest'

import { createLabelsPdf } from './create-labels-pdf'
import { LABEL_LAYOUTS } from './label-layouts'
import type { LabelLayout } from './label-layouts'

// helpers
function makeLabels(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `Etiqueta ${i + 1}`)
}

async function parsePdf(bytes: Uint8Array) {
  const { PDFDocument } = await import('pdf-lib')
  return PDFDocument.load(bytes)
}

const ALL_LAYOUTS: LabelLayout[] = ['2x6', '3x9', '4x13']

describe('createLabelsPdf', () => {
  it('retorna Uint8Array nao vazio para uma etiqueta', async () => {
    const result = await createLabelsPdf(['Joao Silva'], '2x6', false)
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result.length).toBeGreaterThan(100)
  }, 15000)

  it('gera exatamente 1 pagina para ate 12 etiquetas (2x6)', async () => {
    const bytes = await createLabelsPdf(makeLabels(12), '2x6', false)
    const doc = await parsePdf(bytes)
    expect(doc.getPageCount()).toBe(1)
  })

  it('gera 2 paginas quando ha 13 etiquetas (2x6)', async () => {
    const bytes = await createLabelsPdf(makeLabels(13), '2x6', false)
    const doc = await parsePdf(bytes)
    expect(doc.getPageCount()).toBe(2)
  })

  it('dimensoes de pagina sao A4 (~595 x 842)', async () => {
    const bytes = await createLabelsPdf(['Teste'], '2x6', false)
    const doc = await parsePdf(bytes)
    const { width, height } = doc.getPage(0).getSize()
    expect(width).toBeCloseTo(595.28, 0)
    expect(height).toBeCloseTo(841.89, 0)
  })

  it.each(ALL_LAYOUTS)('%s: funciona sem borda', async (layout) => {
    const bytes = await createLabelsPdf(makeLabels(3), layout, false)
    expect(bytes.length).toBeGreaterThan(100)
  })

  it.each(ALL_LAYOUTS)('%s: funciona com borda', async (layout) => {
    const bytes = await createLabelsPdf(makeLabels(3), layout, true)
    expect(bytes.length).toBeGreaterThan(100)
  })

  it('gera 1 pagina para capacidade maxima de 3x9 (27 etiquetas)', async () => {
    const bytes = await createLabelsPdf(makeLabels(27), '3x9', false)
    const doc = await parsePdf(bytes)
    expect(doc.getPageCount()).toBe(1)
  })

  it('gera 2 paginas para 28 etiquetas em 3x9', async () => {
    const bytes = await createLabelsPdf(makeLabels(28), '3x9', false)
    const doc = await parsePdf(bytes)
    expect(doc.getPageCount()).toBe(2)
  })

  it('lida com texto longo sem lancar erro', async () => {
    const labels = ['Nome Muito Longo Que Nao Cabe Em Uma Linha De Etiqueta Pequena']
    const bytes = await createLabelsPdf(labels, '4x13', false)
    expect(bytes.length).toBeGreaterThan(100)
  })

  it('ignora linhas vazias (filtra antes de gerar)', async () => {
    const bytes = await createLabelsPdf(['Valida', '', '  ', 'Outra'], '2x6', false)
    const doc = await parsePdf(bytes)
    expect(doc.getPageCount()).toBe(1)
  })

  it('lanca erro se nao ha etiquetas validas', async () => {
    await expect(
      createLabelsPdf(['', '   ', ''], '2x6', false),
    ).rejects.toThrow()
  })

  it('numero de paginas e ceil(n / capacity)', async () => {
    const cap = LABEL_LAYOUTS['4x13'].capacity  // 52
    const n = cap * 2 + 1
    const bytes = await createLabelsPdf(makeLabels(n), '4x13', false)
    const doc = await parsePdf(bytes)
    expect(doc.getPageCount()).toBe(3)
  })
})
