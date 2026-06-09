import { z } from 'zod'

const publicEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
})

type PublicEnvSource = Record<string, string | boolean | undefined>

export type PublicEnv =
  | { supabase: { enabled: false } }
  | {
      supabase: {
        enabled: true
        url: string
        publishableKey: string
      }
    }

export function parsePublicEnv(source: PublicEnvSource): PublicEnv {
  const normalized = {
    VITE_SUPABASE_URL:
      typeof source.VITE_SUPABASE_URL === 'string' &&
      source.VITE_SUPABASE_URL.trim()
        ? source.VITE_SUPABASE_URL.trim()
        : undefined,
    VITE_SUPABASE_PUBLISHABLE_KEY:
      typeof source.VITE_SUPABASE_PUBLISHABLE_KEY === 'string' &&
      source.VITE_SUPABASE_PUBLISHABLE_KEY.trim()
        ? source.VITE_SUPABASE_PUBLISHABLE_KEY.trim()
        : undefined,
  }

  const parsed = publicEnvSchema.parse(normalized)
  const hasUrl = Boolean(parsed.VITE_SUPABASE_URL)
  const hasKey = Boolean(parsed.VITE_SUPABASE_PUBLISHABLE_KEY)

  if (hasUrl !== hasKey) {
    throw new Error('Supabase public configuration is incomplete')
  }

  if (!hasUrl || !hasKey) {
    return { supabase: { enabled: false } }
  }

  const publishableKey = parsed.VITE_SUPABASE_PUBLISHABLE_KEY as string

  if (
    publishableKey.startsWith('sb_secret_') ||
    publishableKey.startsWith('service_role')
  ) {
    throw new Error(
      'Secret Supabase keys cannot be exposed in VITE_ variables',
    )
  }

  return {
    supabase: {
      enabled: true,
      url: parsed.VITE_SUPABASE_URL as string,
      publishableKey,
    },
  }
}

export const publicEnv = parsePublicEnv(import.meta.env)
