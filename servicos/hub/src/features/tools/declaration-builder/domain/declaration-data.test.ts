import { describe, expect, it } from 'vitest'

import { parseDeclarationData } from './declaration-data'

describe('parseDeclarationData', () => {
  it('normalizes values for the selected template', () => {
    const result = parseDeclarationData('residence', {
      declarantName: '  Ana Silva ',
      cpf: ' 123.456.789-00 ',
      address: ' Rua Exemplo, 100 ',
      city: ' Sao Jose dos Campos ',
      date: '2026-06-10',
    })

    expect(result.values.declarantName).toBe('Ana Silva')
    expect(result.values.address).toBe('Rua Exemplo, 100')
  })

  it('reports the first missing required field', () => {
    expect(() =>
      parseDeclarationData('receipt', {
        receiverName: '',
        receiverDocument: '',
        payerName: '',
        payerDocument: '',
        amount: '',
        amountInWords: '',
        paymentDate: '',
        reason: '',
        settlementType: '',
        city: '',
        date: '',
      }),
    ).toThrow('Informe o nome de quem recebeu')
  })

  it('accepts optional fields as empty strings', () => {
    const result = parseDeclarationData('custom', {
      declarantName: 'Ana Silva',
      cpf: '123.456.789-00',
      identityDocument: '',
      title: 'Declaração',
      content: 'Declaro para os devidos fins que o fato informado é verdadeiro.',
      city: '',
      date: '2026-06-10',
    })

    expect(result.values.identityDocument).toBe('')
    expect(result.values.city).toBe('')
  })

  it('requires the reference period for a work and income declaration', () => {
    expect(() =>
      parseDeclarationData('work-income', {
        declarantName: 'Ana Silva',
        cpf: '123.456.789-00',
        occupation: 'Designer',
        activityNature: 'autonomous',
        activitySince: 'Janeiro de 2022',
        income: 'R$ 4.000,00',
        incomeReferencePeriod: '',
        date: '2026-06-10',
      }),
    ).toThrow('Informe o período de referência da renda')
  })
})
