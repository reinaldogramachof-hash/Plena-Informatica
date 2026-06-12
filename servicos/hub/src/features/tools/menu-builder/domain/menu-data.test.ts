import { describe, expect, it } from 'vitest'

import {
  filterValidCategories,
  validateMenuData,
} from './menu-data'
import type { MenuCategory, MenuData, MenuItemData } from './menu-data'

// ── helpers ───────────────────────────────────────────────────────────────────

function makeItem(name: string, desc = '', price = ''): MenuItemData {
  return { id: 'i1', name, description: desc, price }
}

function makeCat(name: string, items: MenuItemData[]): MenuCategory {
  return { id: 'c1', name, items }
}

function makeData(overrides: Partial<MenuData> = {}): MenuData {
  return {
    establishment: 'Restaurante Teste',
    slogan: '',
    categories: [makeCat('Pratos', [makeItem('Frango')])],
    ...overrides,
  }
}

// ── filterValidCategories ─────────────────────────────────────────────────────

describe('filterValidCategories', () => {
  it('remove categorias sem itens', () => {
    const result = filterValidCategories([makeCat('Vazia', [])])
    expect(result).toHaveLength(0)
  })

  it('remove itens sem nome', () => {
    const result = filterValidCategories([
      makeCat('Cat', [makeItem(''), makeItem('Valido')]),
    ])
    expect(result).toHaveLength(1)
    expect(result[0].items).toHaveLength(1)
    expect(result[0].items[0].name).toBe('Valido')
  })

  it('preserva categorias e itens validos', () => {
    const cats = [
      makeCat('A', [makeItem('Item 1'), makeItem('Item 2')]),
      makeCat('B', [makeItem('Item 3')]),
    ]
    const result = filterValidCategories(cats)
    expect(result).toHaveLength(2)
    expect(result[0].items).toHaveLength(2)
  })

  it('remove categoria cujos itens sao todos sem nome', () => {
    const cats = [
      makeCat('Sem nome', [makeItem(''), makeItem('   ')]),
      makeCat('Com nome', [makeItem('X')]),
    ]
    const result = filterValidCategories(cats)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Com nome')
  })

  it('nao altera a lista original', () => {
    const original = [makeCat('A', [makeItem('X')])]
    filterValidCategories(original)
    expect(original).toHaveLength(1)
  })
})

// ── validateMenuData ──────────────────────────────────────────────────────────

describe('validateMenuData', () => {
  it('retorna lista vazia para dados validos', () => {
    expect(validateMenuData(makeData())).toHaveLength(0)
  })

  it('erro quando estabelecimento esta vazio', () => {
    const errors = validateMenuData(makeData({ establishment: '' }))
    expect(errors.some((e) => e.field === 'establishment')).toBe(true)
  })

  it('erro quando estabelecimento contem apenas espacos', () => {
    const errors = validateMenuData(makeData({ establishment: '   ' }))
    expect(errors.some((e) => e.field === 'establishment')).toBe(true)
  })

  it('erro quando nao ha categorias com itens validos', () => {
    const errors = validateMenuData(makeData({ categories: [] }))
    expect(errors.some((e) => e.field === 'categories')).toBe(true)
  })

  it('erro quando todas as categorias estao vazias', () => {
    const errors = validateMenuData(makeData({
      categories: [makeCat('Vazia', [])],
    }))
    expect(errors.some((e) => e.field === 'categories')).toBe(true)
  })

  it('erro quando todos os itens estao sem nome', () => {
    const errors = validateMenuData(makeData({
      categories: [makeCat('Cat', [makeItem('')])],
    }))
    expect(errors.some((e) => e.field === 'categories')).toBe(true)
  })

  it('nao gera erro para dados com slogan e campos opcionais', () => {
    const data = makeData({
      slogan: 'Sabor e qualidade',
      categories: [makeCat('Bebidas', [makeItem('Suco', 'Natural', 'R$ 8,00')])],
    })
    expect(validateMenuData(data)).toHaveLength(0)
  })
})
