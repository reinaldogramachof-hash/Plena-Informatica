import { describe, expect, it } from 'vitest'

import {
  DEFAULT_TEMPLATE_ID,
  getTemplate,
  RESUME_TEMPLATES,
} from './resume-templates'

describe('resume templates', () => {
  it('DEFAULT_TEMPLATE_ID is classic-ats', () => {
    expect(DEFAULT_TEMPLATE_ID).toBe('classic-ats')
  })

  it('RESUME_TEMPLATES has 5 items', () => {
    expect(RESUME_TEMPLATES).toHaveLength(5)
  })

  it('each template has a non-empty description', () => {
    for (const template of RESUME_TEMPLATES) {
      expect(template.description.trim().length).toBeGreaterThan(0)
    }
  })

  it('creative template has atsWarning and atsCompatible false', () => {
    const creative = RESUME_TEMPLATES.find((t) => t.id === 'creative')
    expect(creative?.atsCompatible).toBe(false)
    expect(creative?.atsWarning).toBeTruthy()
  })

  it('getTemplate returns the correct template by id', () => {
    const template = getTemplate('executive')
    expect(template.id).toBe('executive')
    expect(template.name).toBe('Executivo')
  })

  it('getTemplate falls back to first template for unknown id', () => {
    // @ts-expect-error — intentionally passing unknown id
    const template = getTemplate('unknown-id')
    expect(template).toEqual(RESUME_TEMPLATES[0])
  })
})
