import { describe, expect, it } from 'vitest'

import {
  declarationTemplates,
  getDeclarationTemplate,
} from './declaration-templates'

describe('declaration templates', () => {
  it('provides the six approved templates', () => {
    expect(declarationTemplates.map((template) => template.id)).toEqual([
      'residence',
      'work-income',
      'minor-authorization',
      'receipt',
      'quote',
      'custom',
    ])
  })

  it('describes safe use and organizes every field into a section', () => {
    for (const template of declarationTemplates) {
      expect(template.recommendation.length).toBeGreaterThan(20)
      expect(template.notRecommendedFor.length).toBeGreaterThan(20)
      expect(template.fields.length).toBeGreaterThan(0)
      expect(
        template.fields.every((field) =>
          ['identification', 'details', 'finalization'].includes(field.section),
        ),
      ).toBe(true)
    }
  })

  it('finds a template by id', () => {
    expect(getDeclarationTemplate('receipt').name).toBe('Recibo particular')
  })

  it('provides controls that delimit income, authorization and receipt use', () => {
    const income = getDeclarationTemplate('work-income')
    const authorization = getDeclarationTemplate('minor-authorization')
    const receipt = getDeclarationTemplate('receipt')

    expect(income.fields.map((field) => field.id)).toEqual(
      expect.arrayContaining(['activityNature', 'incomeReferencePeriod']),
    )
    expect(authorization.fields.map((field) => field.id)).toEqual(
      expect.arrayContaining([
        'guardianRelationship',
        'minorBirthDate',
        'activityLocation',
        'startDate',
        'startTime',
        'endDate',
        'endTime',
      ]),
    )
    expect(receipt.fields.map((field) => field.id)).toEqual(
      expect.arrayContaining([
        'receiverDocument',
        'payerDocument',
        'amountInWords',
        'paymentDate',
        'settlementType',
      ]),
    )
    expect(
      receipt.fields.find((field) => field.id === 'settlementType'),
    ).toMatchObject({
      type: 'select',
      options: expect.arrayContaining([
        { value: 'total', label: 'Quitação total' },
        { value: 'partial', label: 'Quitação parcial' },
      ]),
    })
  })

  it('provides quote template with required issuerName and clientName fields', () => {
    const quote = getDeclarationTemplate('quote')
    expect(quote.name).toContain('Orçamento')
    const fieldIds = quote.fields.map((field) => field.id)
    expect(fieldIds).toContain('issuerName')
    expect(fieldIds).toContain('clientName')
    const issuer = quote.fields.find((field) => field.id === 'issuerName')
    expect(issuer?.required).toBe(true)
    const client = quote.fields.find((field) => field.id === 'clientName')
    expect(client?.required).toBe(true)
  })
})
