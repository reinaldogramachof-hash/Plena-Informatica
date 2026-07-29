import { createClient } from '@supabase/supabase-js'
import type { Database } from '../lib/supabase/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

let supabaseClient: ReturnType<typeof createClient<Database>> | undefined

export function getSupabaseClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      'Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY para usar a área administrativa.',
    )
  }

  supabaseClient ??= createClient<Database>(supabaseUrl, supabasePublishableKey)
  return supabaseClient
}

export type AdminSession = {
  userId: string
  email: string
  role: string
  areas: string[]
}

type ProfileAccessRow = {
  role: string
  areas: string[] | null
}

async function getProfileAccess(userId: string): Promise<Pick<AdminSession, 'role' | 'areas'> | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('role, areas')
    .eq('id', userId)
    .maybeSingle() as { data: ProfileAccessRow | null; error: { message: string } | null }

  if (error || !data?.role) {
    return null
  }

  return {
    role: data.role,
    areas: Array.isArray(data.areas) ? data.areas : [],
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = getSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null

  const access = await getProfileAccess(session.user.id)
  if (!access) return null

  return {
    userId: session.user.id,
    email: session.user.email ?? '',
    role: access.role,
    areas: access.areas,
  }
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  const supabase = getSupabaseClient()
  return supabase.auth.signOut()
}

export function onAdminAuthStateChange(
  callback: (session: AdminSession | null) => void,
) {
  const supabase = getSupabaseClient()
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) {
      callback(null)
      return
    }

    void getProfileAccess(session.user.id)
      .then((access) => {
        if (!access) {
          callback(null)
          return
        }

        callback({
          userId: session.user.id,
          email: session.user.email ?? '',
          role: access.role,
          areas: access.areas,
        })
      })
      .catch(() => {
        callback(null)
      })
  })

  return subscription
}
