import { describe, expect, it, vi } from 'vitest'

import {
  createBusinessCardPng,
  PNG_WIDTH,
  PNG_HEIGHT,
  type CanvasFactory,
  type CanvasLike,
} from './create-business-card-png'
import type { CardData } from './business-card-data'

// Bytes fictícios — verificam que o pipeline devolve o que o canvas produz
const FAKE_PNG = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 1, 2, 3])

function makeMockCtx(): CanvasRenderingContext2D {
  return {
    fillStyle: '' as string | CanvasGradient | CanvasPattern,
    strokeStyle: '' as string | CanvasGradient | CanvasPattern,
    lineWidth: 0,
    font: '',
    textBaseline: '' as CanvasTextBaseline,
    globalAlpha: 1,
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    setLineDash: vi.fn(),
    measureText: vi.fn().mockReturnValue({ width: 50 }),
    save: vi.fn(),
    restore: vi.fn(),
  } as unknown as CanvasRenderingContext2D
}

function makeBlobCanvas(png: Uint8Array, ctx: CanvasRenderingContext2D): CanvasLike {
  const canvas: CanvasLike = {
    width:  PNG_WIDTH,
    height: PNG_HEIGHT,
    getContext() { return ctx },
    toBlob(callback) { callback(new Blob([png as any], { type: 'image/png' })) },
  }
  return canvas
}

function makeFactory(png: Uint8Array = FAKE_PNG): CanvasFactory {
  return () => makeBlobCanvas(png, makeMockCtx())
}

function nullBlobCanvasFactory(w: number, h: number): CanvasLike {
  const ctx = makeMockCtx()
  const canvas: CanvasLike = {
    width: w,
    height: h,
    getContext() { return ctx },
    toBlob(callback) { callback(null) },
  }
  return canvas
}

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

describe('createBusinessCardPng', () => {
  it('retorna Uint8Array com os bytes produzidos pelo canvas', async () => {
    const result = await createBusinessCardPng(fullData, 'classic', makeFactory())
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result).toEqual(FAKE_PNG)
  })

  it(`cria canvas com ${PNG_WIDTH} x ${PNG_HEIGHT} px`, async () => {
    let capturedW = 0
    let capturedH = 0
    const factory: CanvasFactory = (w, h) => {
      capturedW = w
      capturedH = h
      return makeBlobCanvas(FAKE_PNG, makeMockCtx())
    }
    await createBusinessCardPng(fullData, 'classic', factory)
    expect(capturedW).toBe(PNG_WIDTH)
    expect(capturedH).toBe(PNG_HEIGHT)
  })

  it('funciona somente com nome (campos opcionais vazios)', async () => {
    const result = await createBusinessCardPng(minimalData, 'modern', makeFactory())
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result.length).toBeGreaterThan(0)
  })

  it('preenche o fundo (fillRect chamado)', async () => {
    const mockCtx = makeMockCtx()
    const factory: CanvasFactory = () => makeBlobCanvas(FAKE_PNG, mockCtx)
    await createBusinessCardPng(fullData, 'classic', factory)
    expect((mockCtx.fillRect as ReturnType<typeof vi.fn>)).toHaveBeenCalled()
  })

  it('os tres estilos executam sem lancar erro', async () => {
    for (const style of ['classic', 'modern', 'colorful'] as const) {
      await expect(
        createBusinessCardPng(fullData, style, makeFactory()),
      ).resolves.toBeInstanceOf(Uint8Array)
    }
  })

  it('lanca erro quando getContext retorna null', async () => {
    const factory: CanvasFactory = (w, h) => {
      const nullCanvas: CanvasLike = {
        width: w,
        height: h,
        getContext() { return null },
        toBlob(callback) { callback(null) },
      }
      return nullCanvas
    }
    await expect(
      createBusinessCardPng(fullData, 'classic', factory),
    ).rejects.toThrow()
  })

  it('lanca erro quando toBlob retorna null', async () => {
    await expect(
      createBusinessCardPng(fullData, 'classic', nullBlobCanvasFactory),
    ).rejects.toThrow()
  })
})
