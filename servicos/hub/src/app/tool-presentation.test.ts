import { describe, expect, it } from 'vitest'

import { toolRegistry } from './tool-registry'
import {
  getToolPresentation,
  professionalServices,
  toolPresentations,
} from './tool-presentation'

describe('tool presentation catalog', () => {
  it('covers every registered tool with useful card metadata', () => {
    expect(Object.keys(toolPresentations)).toHaveLength(toolRegistry.length)

    for (const tool of toolRegistry) {
      const presentation = getToolPresentation(tool.slug)

      expect(presentation).toBeDefined()
      expect(presentation?.benefits.length).toBeGreaterThanOrEqual(2)
      expect(presentation?.benefits.length).toBeLessThanOrEqual(3)
      expect(presentation?.resultLabel).not.toHaveLength(0)
      expect(presentation?.estimatedTime).not.toHaveLength(0)
      expect(presentation?.primaryActionLabel).not.toHaveLength(0)
      expect(presentation?.privacyLabel).not.toHaveLength(0)
    }
  })

  it('keeps professional pricing in a separate catalog', () => {
    expect(professionalServices.resume.priceLabel).toBe('R$ 15,00')
    expect(professionalServices.irpf.priceLabel).toBe('R$ 110,00')
    expect(professionalServices.businessCards.priceLabel).toBe('R$ 50,00')
    expect(
      Object.values(toolPresentations).every(
        (presentation) => !('priceLabel' in presentation),
      ),
    ).toBe(true)
  })

  it('uses professional services only as optional secondary actions', () => {
    expect(getToolPresentation('qr-code')?.professionalServiceId).toBeUndefined()
    expect(getToolPresentation('resume-builder')?.professionalServiceId).toBe(
      'resume',
    )
    expect(
      getToolPresentation('mei-irpf-checklist')?.professionalServiceId,
    ).toBe('irpf')
  })
})
