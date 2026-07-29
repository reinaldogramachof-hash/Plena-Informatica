import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { getAdminSession, signIn, signOut } from '../supabase-client'
import { ADMIN_AREAS, canAccessArea, type AdminArea } from './admin-areas'
import '../admin.css'
import './login-page.css'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe seu e-mail').email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

interface LoginPanelProps {
  area?: AdminArea
  onLogin?: (
    email: string,
    password: string,
  ) => Promise<{ error: Error | null }>
  onSuccess?: () => void
  redirectedError?: string
  showPortalLink?: boolean
  autoFocus?: boolean
}

type LoginPageProps = Omit<LoginPanelProps, 'redirectedError'>

export function LoginPanel({
  area = 'digital',
  onLogin = signIn,
  onSuccess,
  redirectedError = '',
  showPortalLink = true,
  autoFocus = false,
}: LoginPanelProps) {
  const navigate = useNavigate()
  const portal = ADMIN_AREAS[area]
  const handleSuccess = onSuccess ?? (() => navigate(portal.path, { replace: true }))

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(redirectedError)

  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) {
      emailRef.current?.focus()
    }
  }, [autoFocus])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const firstError = result.error.issues[0]
      setError(firstError?.message ?? 'Dados inválidos.')
      return
    }

    setIsLoading(true)
    try {
      const { error: authError } = await onLogin(email, password)
      if (authError) {
        setError('E-mail ou senha incorretos.')
        return
      }

      const session = await getAdminSession()
      if (!canAccessArea(session, area)) {
        await signOut()
        setError(`Seu perfil não tem acesso ao portal ${portal.title}.`)
        return
      }

      handleSuccess()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Não foi possível acessar este portal.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className={`adm-login-card adm-login-card--${area}`}>
        <span className="adm-login-pill">{area === 'escritorio' ? 'Atendimento presencial' : 'Operação digital'}</span>
        <h1>{area === 'escritorio' ? 'Entrar no Escritório' : 'Entrar no Digital'}</h1>
        <p className="adm-login-copy">{portal.description}</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="adm-field">
            <label className="adm-label" htmlFor={`adm-${area}-email`}>
              E-mail <span aria-hidden="true">*</span>
            </label>
            <input
              ref={emailRef}
              id={`adm-${area}-email`}
              className="adm-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-required="true"
            />
          </div>

          <div className="adm-field">
            <label className="adm-label" htmlFor={`adm-${area}-password`}>
              Senha <span aria-hidden="true">*</span>
            </label>
            <div className="adm-password-row">
              <input
                id={`adm-${area}-password`}
                className="adm-input adm-input--password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-required="true"
              />
              <button
                type="button"
                className="adm-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {error && (
            <p className="adm-alert adm-alert--error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="adm-btn adm-btn--primary adm-btn--full"
            disabled={isLoading}
          >
            {isLoading
              ? 'Entrando...'
              : area === 'escritorio'
                ? 'Entrar no Escritório'
                : 'Entrar no Digital'}
          </button>
        </form>
      </div>

      {showPortalLink && (
        <p className="adm-login-notice">
          <Link to="/portais">Voltar aos portais</Link>
          <br />
          Acesso monitorado e restrito.
        </p>
      )}
    </>
  )
}

export function LoginPage({
  area = 'digital',
  onLogin = signIn,
  onSuccess,
}: LoginPageProps) {
  const location = useLocation()
  const portal = ADMIN_AREAS[area]
  const redirectedError =
    typeof location.state?.error === 'string' ? location.state.error : ''

  return (
    <div className={`adm-login-page adm-login-page--${area}`}>
      <div className="adm-login-header">
        <strong className="adm-login-brand">PLENA</strong>
        <span className="adm-login-brand-sub">{portal.title}</span>
      </div>

      <LoginPanel
        area={area}
        onLogin={onLogin}
        onSuccess={onSuccess}
        redirectedError={redirectedError}
        autoFocus
      />
    </div>
  )
}
