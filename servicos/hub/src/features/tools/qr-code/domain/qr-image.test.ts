import { describe, expect, it, vi } from 'vitest'

import { createQrPng } from './qr-image'

describe('createQrPng', () => {
  it('uses conservative PNG settings and returns the generated data URL', async () => {
    const encoder = vi
      .fn()
      .mockResolvedValue('data:image/png;base64,generated')

    await expect(createQrPng('https://plena.test', encoder)).resolves.toBe(
      'data:image/png;base64,generated',
    )
    expect(encoder).toHaveBeenCalledWith('https://plena.test', {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 640,
      color: {
        dark: '#061A35',
        light: '#FFFFFFFF',
      },
    })
  })

  it('rejects empty payloads before calling the encoder', async () => {
    const encoder = vi.fn()

    await expect(createQrPng('   ', encoder)).rejects.toThrow(
      'Não foi possível gerar um QR Code vazio',
    )
    expect(encoder).not.toHaveBeenCalled()
  })
})
