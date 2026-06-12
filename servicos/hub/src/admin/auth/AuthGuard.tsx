import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import type { AdminSession } from '../supabase-client'
import { getAdminSession, onAdminAuthStateChange } from '../supabase-client'

interface AuthGuardProps {
  children: ReactNode
  getSession?: () => Promise<AdminSession | null>
}

export function AuthGuard({
  children,
  getSession = getAdminSession,
}: AuthGuardProps) {
  const [session, setSession] = useState<AdminSession | null | 'loading'>(
    'loading',
  )

  useEffect(() => {
    let cancelled = false
    getSession().then((s) => {
      if (!cancelled) setSession(s)
    })

    const subscription = onAdminAuthStateChange((s) => {
      if (!cancelled) setSession(s)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [getSession])

  if (session === 'loading') {
    return <div aria-live="polite">Verificando acesso...</div>
  }

  if (session === null) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
