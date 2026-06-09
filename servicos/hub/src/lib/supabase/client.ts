import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { publicEnv } from '../env'

let browserClient: SupabaseClient | null | undefined

export function getSupabaseClient(): SupabaseClient | null {
  if (!publicEnv.supabase.enabled) {
    return null
  }

  if (browserClient === undefined) {
    browserClient = createClient(
      publicEnv.supabase.url,
      publicEnv.supabase.publishableKey,
    )
  }

  return browserClient
}
