import { describe, expect, it } from 'vitest'
import { buildPixPayload, crc16, normalizePixText } from './pix-payload'

describe('pix-payload', () => {
  it('calcula CRC16 CCITT corretamente', () => {
    // Caso de teste clássico para CRC16-CCITT de "123456789"
    // Deve retornar "29B1"
    expect(crc16('123456789')).toBe('29B1')
  })

  it('normaliza texto para Pix (maiusculo, sem acentos, sem caracteres invalidos)', () => {
    expect(normalizePixText('Plena Informática')).toBe('PLENA INFORMATICA')
    expect(normalizePixText('Ação & Reação')).toBe('ACAO  REACAO') // remove &
  })

  it('gera payload Pix estatico basico sem valor', () => {
    const payload = buildPixPayload({
      key: '12345678909',
      merchantName: 'Plena Informatica',
      merchantCity: 'Salvador',
    })

    // Deve conter Payload Format Indicator
    expect(payload).toContain('000201')
    // Deve conter GUI do Pix
    expect(payload).toContain('br.gov.bcb.pix')
    // Deve conter a chave Pix
    expect(payload).toContain('12345678909')
    // Deve conter o Merchant Name e City normalizados
    expect(payload).toContain('PLENA INFORMATICA')
    expect(payload).toContain('SALVADOR')
    // Deve conter o identificador do CRC16 no final
    expect(payload).toMatch(/6304[A-F0-9]{4}$/)
    // Não deve conter tag de valor (54)
    expect(payload).not.toContain('540')
  })

  it('gera payload Pix estatico com valor formatado', () => {
    const payload = buildPixPayload({
      key: 'contato@plenainfo.com.br',
      merchantName: 'Plena Ltda',
      merchantCity: 'Feira de Santana',
      amount: 150.75,
    })

    expect(payload).toContain('contato@plenainfo.com.br')
    expect(payload).toContain('PLENA LTDA')
    expect(payload).toContain('FEIRA DE SANTAN') // Corta para 15 caracteres
    // Deve conter a tag de valor (54) com valor correspondente
    expect(payload).toContain('5406150.75')
    expect(payload).toMatch(/6304[A-F0-9]{4}$/)
  })
})
