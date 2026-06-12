import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

let supabaseClient: ReturnType<typeof createClient> | undefined

export function getSupabaseClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      'Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY para usar a área administrativa.',
    )
  }

  supabaseClient ??= createClient(supabaseUrl, supabasePublishableKey)
  return supabaseClient
}

export type AdminSession = {
  userId: string
  email: string
  role: string
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = getSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null
  return { userId: session.user.id, email: session.user.email ?? '', role: 'admin' }
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
    callback({ userId: session.user.id, email: session.user.email ?? '', role: 'admin' })
  })

  return subscription
}
