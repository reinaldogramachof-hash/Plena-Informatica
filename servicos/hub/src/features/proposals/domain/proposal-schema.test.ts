import { describe, expect, it } from 'vitest'

import { linesToItems, proposalFormSchema } from './proposal-schema'

describe('proposalFormSchema', () => {
  it('normaliza valor brasileiro e listas da proposta', () => {
    const result = proposalFormSchema.parse({
      clientName: 'Cliente Ficticio',
      clientEmail: 'cliente.ficticio@example.com',
      title: 'Sistema sob medida',
      scopeIncluded: ['Portal do cliente'],
      scopeExcluded: [],
      techStack: ['React'],
      investmentAmount: '12.500,50',
      estimatedTimeline: '30 dias',
      validUntil: '2026-08-31',
    })

    expect(result.investmentAmount).toBe(12500.5)
  })

  it('exige ao menos um item incluso', () => {
    const result = proposalFormSchema.safeParse({
      clientName: 'Cliente Ficticio',
      clientEmail: 'cliente.ficticio@example.com',
      title: 'Sistema sob medida',
      scopeIncluded: [],
      scopeExcluded: [],
      techStack: [],
      investmentAmount: '1000',
    })

    expect(result.success).toBe(false)
  })
})

describe('linesToItems', () => {
  it('remove linhas vazias e espacos residuais', () => {
    expect(linesToItems('Item A\n\n Item B \r\n')).toEqual(['Item A', 'Item B'])
  })
})
