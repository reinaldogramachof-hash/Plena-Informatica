import { describe, expect, it } from 'vitest'

import {
  calculatePrintCost,
  parseSafeNum,
  PLENA_PRICE_BLACK,
  PLENA_PRICE_COLOR,
  TIE_THRESHOLD,
} from './print-cost'
import type { PrintInput } from './print-cost'

const BASE: PrintInput = {
  pagesBlack:      0,
  pagesColor:      0,
  cartridgeCost:   0,
  cartridgeYield:  0,
  paperResmaCost:  0,
  paperResmaSheets: 0,
  maintenanceCost: 0,
}

// ── parseSafeNum ──────────────────────────────────────────────────────────────
describe('parseSafeNum', () => {
  it('converte string numerica normal', () => {
    expect(parseSafeNum('10')).toBe(10)
  })

  it('aceita virgula como separador decimal', () => {
    expect(parseSafeNum('3,50')).toBeCloseTo(3.5)
  })

  it('retorna 0 para string vazia', () => {
    expect(parseSafeNum('')).toBe(0)
  })

  it('retorna 0 para valor negativo', () => {
    expect(parseSafeNum('-5')).toBe(0)
  })

  it('retorna 0 para texto nao numerico', () => {
    expect(parseSafeNum('abc')).toBe(0)
  })

  it('aceita ponto como separador decimal', () => {
    expect(parseSafeNum('2.75')).toBeCloseTo(2.75)
  })
})

// ── calculatePrintCost ────────────────────────────────────────────────────────
describe('calculatePrintCost', () => {
  it('retorna zeros quando nao ha paginas nem custos', () => {
    const r = calculatePrintCost(BASE)
    expect(r.ownCostMonthly).toBe(0)
    expect(r.plenaCostMonthly).toBe(0)
    expect(r.difference).toBe(0)
    expect(r.ownCostPerPage).toBe(0)
    expect(r.plenaCostPerPage).toBe(0)
  })

  it('cartridgeYield=0 nao produz NaN nem Infinity', () => {
    const r = calculatePrintCost({ ...BASE, pagesBlack: 10, cartridgeCost: 50, cartridgeYield: 0 })
    expect(isNaN(r.ownCostMonthly)).toBe(false)
    expect(isFinite(r.ownCostMonthly)).toBe(true)
  })

  it('paperResmaSheets=0 nao produz NaN nem Infinity', () => {
    const r = calculatePrintCost({ ...BASE, pagesBlack: 10, paperResmaCost: 20, paperResmaSheets: 0 })
    expect(isNaN(r.ownCostMonthly)).toBe(false)
    expect(isFinite(r.ownCostMonthly)).toBe(true)
  })

  it('custo Plena usa PLENA_PRICE_BLACK para paginas pretas', () => {
    const r = calculatePrintCost({ ...BASE, pagesBlack: 10 })
    expect(r.plenaCostMonthly).toBeCloseTo(10 * PLENA_PRICE_BLACK)
  })

  it('custo Plena usa PLENA_PRICE_COLOR para paginas coloridas', () => {
    const r = calculatePrintCost({ ...BASE, pagesColor: 5 })
    expect(r.plenaCostMonthly).toBeCloseTo(5 * PLENA_PRICE_COLOR)
  })

  it('custo Plena somado para misto preto e colorido', () => {
    const r = calculatePrintCost({ ...BASE, pagesBlack: 10, pagesColor: 5 })
    const expected = 10 * PLENA_PRICE_BLACK + 5 * PLENA_PRICE_COLOR
    expect(r.plenaCostMonthly).toBeCloseTo(expected)
  })

  it('custo proprio por pagina inclui toner e papel', () => {
    const input: PrintInput = {
      ...BASE,
      pagesBlack:      100,
      cartridgeCost:   50,
      cartridgeYield:  500,
      paperResmaCost:  25,
      paperResmaSheets: 500,
    }
    const r = calculatePrintCost(input)
    // rawPerPage = 50/500 + 25/500 = 0.10 + 0.05 = 0.15
    // monthly = 100 * 0.15 = 15 — sem manutencao
    expect(r.ownCostPerPage).toBeCloseTo(0.15)
    expect(r.ownCostMonthly).toBeCloseTo(15)
  })

  it('manutencao e distribuida no custo por pagina', () => {
    const input: PrintInput = {
      ...BASE,
      pagesBlack:      100,
      maintenanceCost: 50,
    }
    const r = calculatePrintCost(input)
    // ownCostMonthly = 0 + 50 = 50
    // ownCostPerPage = 50 / 100 = 0.50
    expect(r.ownCostPerPage).toBeCloseTo(0.5)
    expect(r.ownCostMonthly).toBeCloseTo(50)
  })

  it('difference nunca e negativo', () => {
    const r1 = calculatePrintCost({ ...BASE, pagesBlack: 100 })
    const r2 = calculatePrintCost({ ...BASE, pagesBlack: 100, maintenanceCost: 999 })
    expect(r1.difference).toBeGreaterThanOrEqual(0)
    expect(r2.difference).toBeGreaterThanOrEqual(0)
  })

  it('verdict tie quando diferenca < TIE_THRESHOLD', () => {
    // 10 paginas pretas: plena = 30,00; own = 30,00 (sem custos adicionais)
    // Para empate: own = plena => definir manutencao que zera a diferenca
    const r = calculatePrintCost({ ...BASE, pagesBlack: 10, pagesColor: 0 })
    // plenaCost = 30, ownCost = 0 => diferenca 30 => nao e empate
    // Testar com manutencao tal que |own - plena| < 0.01
    const equalInput: PrintInput = {
      ...BASE,
      pagesBlack:      10,
      maintenanceCost: 10 * PLENA_PRICE_BLACK, // 30 => own = 30, plena = 30
    }
    const r2 = calculatePrintCost(equalInput)
    expect(r2.verdict).toBe('tie')
    expect(r2.difference).toBeLessThan(TIE_THRESHOLD)
    void r
  })

  it('verdict economy quando proprio > plena', () => {
    const input: PrintInput = {
      ...BASE,
      pagesBlack:      10,
      maintenanceCost: 999, // proprio muito caro
    }
    const r = calculatePrintCost(input)
    expect(r.verdict).toBe('economy')
  })

  it('verdict extra quando proprio < plena', () => {
    const input: PrintInput = {
      ...BASE,
      pagesBlack: 1000, // plena = 3000
      // proprio = 0 (sem custos definidos)
    }
    const r = calculatePrintCost(input)
    expect(r.verdict).toBe('extra')
  })
})
