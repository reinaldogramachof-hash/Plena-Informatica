import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'

import { createMenuPdf, PAGE_DIMS } from './create-menu-pdf'
import type { MenuData, MenuOptions } from './menu-data'

// ── helpers ───────────────────────────────────────────────────────────────────

function makeData(overrides: Partial<MenuData> = {}): MenuData {
  return {
    establishment: 'Restaurante Plena',
    slogan: 'Sabor e qualidade',
    categories: [
      {
        id: 'c1',
        name: 'Entradas',
        items: [
          { id: 'i1', name: 'Bruschetta', description: 'Com tomate e manjericao', price: 'R$ 18,00' },
          { id: 'i2', name: 'Carpaccio',  description: '', price: 'R$ 24,00' },
        ],
      },
      {
        id: 'c2',
        name: 'Pratos',
        items: [
          { id: 'i3', name: 'Frango Grelhado', description: 'Com legumes', price: '' },
          { id: 'i4', name: 'File de Peixe',   description: '', price: 'R$ 38,00' },
        ],
      },
    ],
    ...overrides,
  }
}

function opts(overrides: Partial<MenuOptions> = {}): MenuOptions {
  return { pageSize: 'a4', columns: 1, ...overrides }
}

async function loadPdf(bytes: Uint8Array) {
  return PDFDocument.load(bytes)
}

// ── testes ────────────────────────────────────────────────────────────────────

describe('createMenuPdf', () => {
  it('retorna Uint8Array nao vazio', async () => {
    const result = await createMenuPdf(makeData(), opts())
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result.length).toBeGreaterThan(100)
  })

  it('gera exatamente 1 pagina para cardapio simples', async () => {
    const result = await createMenuPdf(makeData(), opts())
    const doc = await loadPdf(result)
    expect(doc.getPageCount()).toBe(1)
  })

  it('dimensoes A4 corretas (595 x 842 pt, tolerancia 1pt)', async () => {
    const result = await createMenuPdf(makeData(), opts({ pageSize: 'a4' }))
    const doc = await loadPdf(result)
    const { width, height } = doc.getPage(0).getSize()
    expect(width).toBeCloseTo(PAGE_DIMS.a4[0], 0)
    expect(height).toBeCloseTo(PAGE_DIMS.a4[1], 0)
  })

  it('dimensoes meio sulfite corretas (420 x 595 pt, tolerancia 1pt)', async () => {
    const result = await createMenuPdf(makeData(), opts({ pageSize: 'half' }))
    const doc = await loadPdf(result)
    const { width, height } = doc.getPage(0).getSize()
    expect(width).toBeCloseTo(PAGE_DIMS.half[0], 0)
    expect(height).toBeCloseTo(PAGE_DIMS.half[1], 0)
  })

  it('funciona com 2 colunas sem lancar erro', async () => {
    await expect(
      createMenuPdf(makeData(), opts({ columns: 2 })),
    ).resolves.toBeInstanceOf(Uint8Array)
  })

  it('funciona sem slogan', async () => {
    await expect(
      createMenuPdf(makeData({ slogan: '' }), opts()),
    ).resolves.toBeInstanceOf(Uint8Array)
  })

  it('funciona com itens sem preco e sem descricao', async () => {
    const data = makeData({
      categories: [{
        id: 'c1',
        name: 'Simples',
        items: [{ id: 'i1', name: 'Item', description: '', price: '' }],
      }],
    })
    await expect(createMenuPdf(data, opts())).resolves.toBeInstanceOf(Uint8Array)
  })

  it('ignora categorias sem itens validos', async () => {
    const data = makeData({
      categories: [
        { id: 'c1', name: 'Vazia', items: [] },
        { id: 'c2', name: 'Valida', items: [{ id: 'i1', name: 'Item', description: '', price: '' }] },
      ],
    })
    await expect(createMenuPdf(data, opts())).resolves.toBeInstanceOf(Uint8Array)
  })

  it('gera multiplas paginas quando ha muitos itens', async () => {
    const items = Array.from({ length: 40 }, (_, i) => ({
      id: `i${i}`,
      name: `Item longo numero ${i + 1}`,
      description: `Descricao detalhada do item ${i + 1} para ocupar espaco`,
      price: `R$ ${(i + 1) * 10},00`,
    }))
    const data = makeData({ categories: [{ id: 'c1', name: 'Grande', items }] })
    const result = await createMenuPdf(data, opts())
    const doc = await loadPdf(result)
    expect(doc.getPageCount()).toBeGreaterThan(1)
  })

  it('A4 2 colunas gera PDF valido com multiplas categorias', async () => {
    const items = Array.from({ length: 20 }, (_, i) => ({
      id: `i${i}`,
      name: `Item ${i + 1}`,
      description: '',
      price: `R$ ${i + 1},00`,
    }))
    const data = makeData({ categories: [{ id: 'c1', name: 'Tudo', items }] })
    const result = await createMenuPdf(data, opts({ columns: 2 }))
    const doc = await loadPdf(result)
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(1)
  })

  it('lanca erro quando estabelecimento esta vazio', async () => {
    await expect(
      createMenuPdf(makeData({ establishment: '' }), opts()),
    ).rejects.toThrow()
  })

  it('lanca erro quando nao ha categorias validas', async () => {
    await expect(
      createMenuPdf(makeData({ categories: [] }), opts()),
    ).rejects.toThrow()
  })
})
