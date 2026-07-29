import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import type { AdminSession } from '../supabase-client'
import { getAdminSession, onAdminAuthStateChange } from '../supabase-client'

interface AuthGuardProps {
  children: ReactNode
  getSession?: () => Promise<AdminSession | null>
  loginPath?: string
}

export function AuthGuard({
  children,
  getSession = getAdminSession,
  loginPath = '/digital/login',
}: AuthGuardProps) {
  const [session, setSession] = useState<AdminSession | null | 'loading'>(
    'loading',
  )
  const [redirectError, setRedirectError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let subscription: { unsubscribe: () => void } | null = null

    getSession()
      .then((s) => {
        if (cancelled) return
        setRedirectError(null)
        setSession(s)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setRedirectError(
          error instanceof Error
            ? error.message
            : 'Não foi possível validar a sessão.',
        )
        setSession(null)
      })

    void Promise.resolve()
      .then(() => onAdminAuthStateChange((s) => {
        if (cancelled) return
        setRedirectError(null)
        setSession(s)
      }))
      .then((nextSubscription) => {
        if (cancelled) {
          nextSubscription.unsubscribe()
          return
        }
        subscription = nextSubscription
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setRedirectError(
            error instanceof Error
              ? error.message
              : 'Não foi possível validar a sessão.',
          )
          setSession(null)
        }
      })

    return () => {
      cancelled = true
      subscription?.unsubscribe()
    }
  }, [getSession])

  if (session === 'loading') {
    return <div aria-live="polite">Verificando acesso...</div>
  }

  if (session === null) {
    return (
      <Navigate
        to={loginPath}
        replace
        state={redirectError ? { error: redirectError } : undefined}
      />
    )
  }

  return <>{children}</>
}
