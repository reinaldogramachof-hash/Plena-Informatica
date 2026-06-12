import { describe, expect, it } from 'vitest'

import { buildDeclaration } from './build-declaration'
import { parseDeclarationData } from './declaration-data'

const footerText =
  'não possui assinatura digital, reconhecimento de firma ou validação automática pela Plena Informática'

describe('buildDeclaration', () => {
  it('builds a detailed residence declaration without claiming automatic acceptance', () => {
    const document = buildDeclaration(
      parseDeclarationData('residence', {
        declarantName: 'Ana Silva',
        cpf: '123.456.789-00',
        identityDocument: 'RG 12.345.678-9',
        nationality: 'brasileira',
        maritalStatus: 'casada',
        occupation: 'designer',
        address: 'Rua Exemplo, 100, Centro, São José dos Campos - SP',
        residenceSince: 'janeiro de 2022',
        purpose: 'apresentação à instituição de ensino',
        city: 'São José dos Campos',
        date: '2026-06-10',
      }),
    )

    expect(document.title).toBe('Declaração de residência')
    expect(document.paragraphs.join(' ')).toContain(
      'Rua Exemplo, 100, Centro, São José dos Campos - SP',
    )
    expect(document.paragraphs.join(' ')).toContain(
      'apresentação à instituição de ensino',
    )
    expect(document.paragraphs.join(' ')).not.toContain('substitui')
    expect(document.locationDate).toBe(
      'São José dos Campos, 10 de junho de 2026',
    )
    expect(document.signatureDocument).toBe('CPF 123.456.789-00')
    expect(document.footerNote).toContain(footerText)
  })

  it('builds an Orcamento with table rows from parsed items', () => {
    const document = buildDeclaration(
      parseDeclarationData(
        'quote',
        {
          issuerName: 'Ana Silva',
          issuerDocument: '123.456.789-00',
          clientName: 'Empresa Exemplo',
          validityDate: '2026-07-01',
          paymentConditions: '50% na assinatura',
          city: 'São José dos Campos',
          date: '2026-06-10',
        },
        [
          { description: 'Impressão A4 PB', quantity: '100', unitPrice: '3' },
          { description: 'Impressão A4 Color', quantity: '20', unitPrice: '4' },
        ],
      ),
    )

    expect(document.title).toBe('Orcamento')
    expect(document.paragraphs.join(' ')).toContain('Ana Silva')
    expect(document.paragraphs.join(' ')).toContain('Empresa Exemplo')
    expect(document.paragraphs.join(' ')).toContain('50% na assinatura')
    expect(document.paragraphs.join(' ')).toContain('1 de julho de 2026')
    expect(document.paragraphs.join(' ')).toContain('nao constitui nota fiscal')
    expect(document.signatureLabel).toBe('Emitente')
    expect(document.table).toBeDefined()
    expect(document.table!.rows).toHaveLength(2)
    expect(document.table!.rows[0]).toEqual(['Impressão A4 PB', '100', 'R$\xa03,00', 'R$\xa0300,00'])
    expect(document.table!.totalValue).toBe('R$\xa0380,00')
  })

  it('builds an Orcamento without optional fields', () => {
    const document = buildDeclaration(
      parseDeclarationData(
        'quote',
        {
          issuerName: 'João Souza',
          clientName: 'Cliente Final',
          city: '',
          date: '',
        },
        [{ description: 'Serviço', quantity: '1', unitPrice: '150' }],
      ),
    )

    const text = document.paragraphs.join(' ')
    expect(text).not.toContain('Validade:')
    expect(text).not.toContain('Condicoes:')
    expect(document.signatureDocument).toBeUndefined()
    expect(document.table!.totalValue).toBe('R$\xa0150,00')
  })

  it('states that work and income information is self-declared and period-bound', () => {
    const document = buildDeclaration(
      parseDeclarationData('work-income', {
        declarantName: 'Ana Silva',
        cpf: '123.456.789-00',
        occupation: 'designer',
        activityNature: 'autonomous',
        activityLocation: 'atendimento remoto e presencial',
        activitySince: 'janeiro de 2022',
        income: 'R$ 4.000,00',
        incomeReferencePeriod: 'últimos 6 meses',
        purpose: 'análise cadastral',
        city: 'São José dos Campos',
        date: '2026-06-10',
      }),
    )

    const text = document.paragraphs.join(' ')
    expect(text).toContain('natureza autodeclaratória')
    expect(text).toContain('últimos 6 meses')
    expect(text).toContain('não representam auditoria')
    expect(text).toContain('análise cadastral')
  })

  it('limits minor authorization to the described activity and period', () => {
    const document = buildDeclaration(
      parseDeclarationData('minor-authorization', {
        guardianName: 'Ana Silva',
        guardianDocument: '123.456.789-00',
        guardianRelationship: 'mãe',
        minorName: 'João Silva',
        minorBirthDate: '2015-03-04',
        authorizedPerson: 'Escola Exemplo',
        authorizedActivity: 'participação em evento cultural',
        activityLocation: 'Teatro Municipal',
        startDate: '2026-06-15',
        startTime: '14:00',
        endDate: '2026-06-15',
        endTime: '18:00',
        guardianPhone: '(12) 99999-0000',
        city: 'São José dos Campos',
        date: '2026-06-10',
      }),
    )

    const text = document.paragraphs.join(' ')
    expect(document.title).toBe(
      'Autorização particular para atividade de menor',
    )
    expect(text).toContain('exclusivamente')
    expect(text).toContain('Teatro Municipal')
    expect(text).toContain('15 de junho de 2026, às 14:00')
    expect(text).not.toContain('viagem')
  })

  it.each([
    ['total', 'quitação total'],
    ['partial', 'quitação parcial'],
  ])('creates a receipt with %s settlement', (settlementType, expectedText) => {
    const document = buildDeclaration(
      parseDeclarationData('receipt', {
        receiverName: 'Ana Silva',
        receiverDocument: '123.456.789-00',
        payerName: 'Empresa Exemplo',
        payerDocument: '12.345.678/0001-99',
        amount: 'R$ 500,00',
        amountInWords: 'quinhentos reais',
        paymentMethod: 'Pix',
        paymentDate: '2026-06-09',
        reason: 'serviços administrativos',
        settlementType,
        reference: 'parcela 2 de 4',
        city: 'São José dos Campos',
        date: '2026-06-10',
      }),
    )

    const text = document.paragraphs.join(' ')
    expect(document.title).toBe('Recibo particular')
    expect(text).toContain('R$ 500,00 (quinhentos reais)')
    expect(text).toContain(expectedText)
    expect(text).toContain('parcela 2 de 4')
  })

  it('wraps custom content in standard identification and responsibility text', () => {
    const document = buildDeclaration(
      parseDeclarationData('custom', {
        declarantName: 'Ana Silva',
        cpf: '123.456.789-00',
        title: 'Declaração de comparecimento',
        purpose: '',
        content: 'Estive presente no local indicado durante o período informado.',
        city: '',
        date: '2026-06-10',
      }),
    )

    expect(document.title).toBe('Declaração de comparecimento')
    expect(document.paragraphs[0]).toContain('Ana Silva')
    expect(document.paragraphs[1]).toBe(
      'Estive presente no local indicado durante o período informado.',
    )
    expect(document.paragraphs.join(' ')).not.toContain('finalidade de .')
    expect(document.footerNote).toContain(footerText)
  })
})
