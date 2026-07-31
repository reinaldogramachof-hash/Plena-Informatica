import { describe, expect, it } from 'vitest'

import { getDasInfo } from './das-values'
import type { ActivityType } from './das-values'

describe('tabela oficial do DAS-MEI 2026 para caminhoneiros', () => {
  it.each([
    ['freight-commerce', ['INSS', 'ICMS'], 195.52],
    ['freight-services', ['INSS', 'ISS'], 199.52],
    ['freight-both', ['INSS', 'ICMS', 'ISS'], 200.52],
  ] as const)(
    '%s aplica os componentes oficiais sem presumir o tributo da atividade',
    (activity, expectedComponents, expectedTotal) => {
      const info = getDasInfo(activity as ActivityType)

      expect(info.components.map((component) => component.component)).toEqual(
        expectedComponents,
      )
      expect(info.total).toBeCloseTo(expectedTotal)
      expect(info.checkedAt).toBe('2026-07-31')
      expect(info.sourceUrl).toContain('receita.fazenda.gov.br')
    },
  )
})
