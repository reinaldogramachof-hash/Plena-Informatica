import { describe, expect, it } from 'vitest'

import { parsePublicEnv } from './env'

describe('parsePublicEnv', () => {
  it('keeps Supabase disabled when both variables are absent', () => {
    expect(parsePublicEnv({})).toEqual({
      supabase: { enabled: false },
    })
  })

  it('accepts a complete public Supabase configuration', () => {
    expect(
      parsePublicEnv({
        VITE_SUPABASE_URL: 'https://example.supabase.co',
        VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_example',
      }),
    ).toEqual({
      supabase: {
        enabled: true,
        url: 'https://example.supabase.co',
        publishableKey: 'sb_publishable_example',
      },
    })
  })

  it('rejects partial Supabase configuration', () => {
    expect(() =>
      parsePublicEnv({
        VITE_SUPABASE_URL: 'https://example.supabase.co',
      }),
    ).toThrow('Supabase public configuration is incomplete')
  })

  it('rejects secret keys in browser configuration', () => {
    expect(() =>
      parsePublicEnv({
        VITE_SUPABASE_URL: 'https://example.supabase.co',
        VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_example',
      }),
    ).toThrow('Secret Supabase keys cannot be exposed in VITE_ variables')
  })
})
