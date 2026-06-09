import { describe, expect, it } from 'vitest'

import { buildQrPayload } from './qr-payload'

describe('buildQrPayload', () => {
  it('accepts only HTTP and HTTPS links', () => {
    expect(
      buildQrPayload({ mode: 'link', url: 'https://plenainformatica.com.br' }),
    ).toBe('https://plenainformatica.com.br/')

    expect(() =>
      buildQrPayload({ mode: 'link', url: 'javascript:alert(1)' }),
    ).toThrow('Informe um link iniciado por http:// ou https://')
  })

  it('rejects blank text and trims valid text', () => {
    expect(buildQrPayload({ mode: 'text', text: '  Plena Digital  ' })).toBe(
      'Plena Digital',
    )
    expect(() => buildQrPayload({ mode: 'text', text: '   ' })).toThrow(
      'Digite o texto do QR Code',
    )
  })

  it('builds a WhatsApp URL with digits and an encoded message', () => {
    expect(
      buildQrPayload({
        mode: 'whatsapp',
        phone: '+55 (12) 98148-8505',
        message: 'Ola, Plena!',
      }),
    ).toBe('https://wa.me/5512981488505?text=Ola%2C%20Plena!')
  })

  it('builds an international telephone payload', () => {
    expect(
      buildQrPayload({ mode: 'phone', phone: '+55 (12) 98148-8505' }),
    ).toBe('tel:+5512981488505')
  })

  it('escapes reserved Wi-Fi characters', () => {
    expect(
      buildQrPayload({
        mode: 'wifi',
        security: 'WPA',
        ssid: 'Plena;Visitantes',
        password: 'senha:forte\\2026',
        hidden: false,
      }),
    ).toBe(
      'WIFI:T:WPA;S:Plena\\;Visitantes;P:senha\\:forte\\\\2026;H:false;;',
    )
  })

  it('accepts an existing Pix Copia e Cola payload without modifying it', () => {
    const payload = '00020126360014BR.GOV.BCB.PIX0114contato@plena52040000'

    expect(buildQrPayload({ mode: 'pix', payload })).toBe(payload)
  })

  it('rejects payloads larger than the safe QR limit', () => {
    expect(() =>
      buildQrPayload({ mode: 'text', text: 'a'.repeat(2049) }),
    ).toThrow('O conteúdo deve ter no máximo 2048 caracteres')
  })
})
