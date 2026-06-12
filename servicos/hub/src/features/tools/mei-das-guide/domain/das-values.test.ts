import { describe, expect, it } from 'vitest'

import {
  getDasInfo,
  INSS_MEI,
  ISS_MEI,
  ICMS_MEI,
} from './das-values'
import type { ActivityType } from './das-values'

const ALL: ActivityType[] = ['commerce', 'services', 'both', 'transport', 'freight']

describe('getDasInfo', () => {
  it.each(ALL)('%s: sempre inclui INSS', (activity) => {
    const { components } = getDasInfo(activity)
    const inss = components.find((c) => c.component === 'INSS')
    expect(inss).toBeDefined()
    const expectedInss = activity === 'freight' ? 194.52 : INSS_MEI
    expect(inss!.value).toBeCloseTo(expectedInss)
  })

  it('commerce: inclui ICMS, nao inclui ISS', () => {
    const { components } = getDasInfo('commerce')
    expect(components.find((c) => c.component === 'ICMS')).toBeDefined()
    expect(components.find((c) => c.component === 'ISS')).toBeUndefined()
  })

  it('services: inclui ISS, nao inclui ICMS', () => {
    const { components } = getDasInfo('services')
    expect(components.find((c) => c.component === 'ISS')).toBeDefined()
    expect(components.find((c) => c.component === 'ICMS')).toBeUndefined()
  })

  it('both: inclui ICMS e ISS', () => {
    const { components } = getDasInfo('both')
    expect(components.find((c) => c.component === 'ICMS')).toBeDefined()
    expect(components.find((c) => c.component === 'ISS')).toBeDefined()
  })

  it('transport: inclui ISS, nao inclui ICMS', () => {
    const { components } = getDasInfo('transport')
    expect(components.find((c) => c.component === 'ISS')).toBeDefined()
    expect(components.find((c) => c.component === 'ICMS')).toBeUndefined()
  })

  it.each(ALL)('%s: nenhum componente e CPP', (activity) => {
    const { components } = getDasInfo(activity)
    expect(components.find((c) => c.component.toUpperCase().includes('CPP'))).toBeUndefined()
  })

  it('commerce: total = INSS + ICMS', () => {
    const { total } = getDasInfo('commerce')
    expect(total).toBeCloseTo(INSS_MEI + ICMS_MEI)
  })

  it('services: total = INSS + ISS', () => {
    const { total } = getDasInfo('services')
    expect(total).toBeCloseTo(INSS_MEI + ISS_MEI)
  })

  it('both: total = INSS + ICMS + ISS', () => {
    const { total } = getDasInfo('both')
    expect(total).toBeCloseTo(INSS_MEI + ICMS_MEI + ISS_MEI)
  })

  it.each(ALL)('%s: total e positivo e finito', (activity) => {
    const { total } = getDasInfo(activity)
    expect(total).toBeGreaterThan(0)
    expect(isFinite(total)).toBe(true)
  })

  it.each(ALL)('%s: year = 2026', (activity) => {
    expect(getDasInfo(activity).year).toBe(2026)
  })

  it.each(ALL)('%s: sourceUrl aponta para Receita Federal', (activity) => {
    expect(getDasInfo(activity).sourceUrl).toContain('receita.fazenda.gov.br')
  })

  it.each(ALL)('%s: checkedAt tem formato YYYY-MM-DD', (activity) => {
    expect(getDasInfo(activity).checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('freight: inclui ISS, nao inclui ICMS, e INSS e 194.52', () => {
    const { components, total } = getDasInfo('freight')
    const inss = components.find((c) => c.component === 'INSS')
    const iss = components.find((c) => c.component === 'ISS')
    const icms = components.find((c) => c.component === 'ICMS')

    expect(inss).toBeDefined()
    expect(inss!.value).toBeCloseTo(194.52)
    expect(iss).toBeDefined()
    expect(iss!.value).toBeCloseTo(5.00)
    expect(icms).toBeUndefined()
    expect(total).toBeCloseTo(199.52)
  })
})
