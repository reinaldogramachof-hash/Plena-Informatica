import { describe, expect, it } from 'vitest'

import { toolRegistry } from './tool-registry'

describe('toolRegistry', () => {
  it('registers the six approved MVP tools with unique slugs', () => {
    const slugs = toolRegistry.map((tool) => tool.slug)

    expect(toolRegistry).toHaveLength(6)
    expect(new Set(slugs).size).toBe(6)
  })

  it('keeps file-processing tools local and account-free', () => {
    const localFileTools = toolRegistry.filter((tool) =>
      ['images-to-pdf', 'merge-pdf'].includes(tool.slug),
    )

    expect(localFileTools).toHaveLength(2)
    expect(
      localFileTools.every(
        (tool) =>
          tool.processing === 'local' &&
          tool.accountRequirement === 'none' &&
          tool.persistence === 'none',
      ),
    ).toBe(true)
  })

  it('allows optional persistence only for document projects', () => {
    const persistentTools = toolRegistry.filter(
      (tool) => tool.persistence === 'optional',
    )

    expect(persistentTools.map((tool) => tool.slug).sort()).toEqual([
      'declaration-builder',
      'mei-irpf-checklist',
      'resume-builder',
    ])
    expect(
      persistentTools.every(
        (tool) => tool.accountRequirement === 'optional',
      ),
    ).toBe(true)
  })
})
