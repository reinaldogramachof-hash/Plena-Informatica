import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'

import {
  createBusinessCardPdf,
  CARD_WIDTH_PT,
  CARD_HEIGHT_PT,
} from './create-business-card-pdf'
import type { CardData } from './business-card-data'

const fullData: CardData = {
  fullName: 'Ana Paula Souza',
  role: 'Contadora',
  phone: '(12) 99999-0000',
  email: 'ana@exemplo.com',
  website: 'www.ana.com.br',
  city: 'Sao Jose dos Campos - SP',
  company: 'Plena Informatica',
}

const minimalData: CardData = {
  fullName: 'Carlos',
  role: '',
  phone: '',
  email: '',
  website: '',
  city: '',
  company: '',
}

describe('createBusinessCardPdf', () => {
  it('retorna Uint8Array nao vazio', async () => {
    const result = await createBusinessCardPdf(fullData, 'classic')
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result.length).toBeGreaterThan(0)
  })

  it('gera PDF valido com exatamente uma pagina', async () => {
    const result = await createBusinessCardPdf(fullData, 'classic')
    const pdf = await PDFDocument.load(result)
    expect(pdf.getPageCount()).toBe(1)
  })

  it('pagina tem dimensoes de 90 x 50 mm em pontos', async () => {
    const result = await createBusinessCardPdf(fullData, 'classic')
    const pdf = await PDFDocument.load(result)
    const { width, height } = pdf.getPage(0).getSize()
    expect(width).toBeCloseTo(CARD_WIDTH_PT, 0)
    expect(height).toBeCloseTo(CARD_HEIGHT_PT, 0)
  })

  it('funciona somente com nome (campos opcionais vazios)', async () => {
    const result = await createBusinessCardPdf(minimalData, 'classic')
    const pdf = await PDFDocument.load(result)
    expect(pdf.getPageCount()).toBe(1)
  })

  it('estilo modern produz PDF valido com uma pagina', async () => {
    const result = await createBusinessCardPdf(fullData, 'modern')
    const pdf = await PDFDocument.load(result)
    expect(pdf.getPageCount()).toBe(1)
  })

  it('estilo colorful produz PDF valido com uma pagina', async () => {
    const result = await createBusinessCardPdf(fullData, 'colorful')
    const pdf = await PDFDocument.load(result)
    expect(pdf.getPageCount()).toBe(1)
  })

  it('os tres estilos produzem PDFs distintos', async () => {
    const classic = await createBusinessCardPdf(fullData, 'classic')
    const modern = await createBusinessCardPdf(fullData, 'modern')
    const colorful = await createBusinessCardPdf(fullData, 'colorful')
    expect(classic).not.toEqual(modern)
    expect(modern).not.toEqual(colorful)
    expect(classic).not.toEqual(colorful)
  })

  it('dimensoes sao 90 x 50 mm nos tres estilos', async () => {
    for (const style of ['classic', 'modern', 'colorful'] as const) {
      const result = await createBusinessCardPdf(minimalData, style)
      const pdf = await PDFDocument.load(result)
      const { width, height } = pdf.getPage(0).getSize()
      expect(width).toBeCloseTo(CARD_WIDTH_PT, 0)
      expect(height).toBeCloseTo(CARD_HEIGHT_PT, 0)
    }
  })
})
