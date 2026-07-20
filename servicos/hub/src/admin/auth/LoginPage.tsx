import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { signIn } from '../supabase-client'
import '../admin.css'
import './login-page.css'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe seu e-mail').email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

interface LoginPageProps {
  onLogin?: (
    email: string,
    password: string,
  ) => Promise<{ error: Error | null }>
  onSuccess?: () => void
}

export function LoginPage({
  onLogin = signIn,
  onSuccess,
}: LoginPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const handleSuccess = onSuccess ?? (() => navigate('/admin/dashboard', { replace: true }))
  const redirectedError =
    typeof location.state?.error === 'string' ? location.state.error : ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(redirectedError)

  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

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
      } else {
        handleSuccess()
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Não foi possível acessar a área administrativa.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="adm-login-page">
      <div className="adm-login-header">
        <strong className="adm-login-brand">PLENA</strong>
        <span className="adm-login-brand-sub">Área Administrativa</span>
      </div>

      <div className="adm-login-card">
        <h1>Acesso restrito</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="adm-field">
            <label className="adm-label" htmlFor="adm-email">
              E-mail <span aria-hidden="true">*</span>
            </label>
            <input
              ref={emailRef}
              id="adm-email"
              className="adm-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-required="true"
            />
          </div>

          <div className="adm-field">
            <label className="adm-label" htmlFor="adm-password">
              Senha <span aria-hidden="true">*</span>
            </label>
            <div className="adm-password-row">
              <input
                id="adm-password"
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
                {showPassword ? '🙈' : '👁'}
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
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>

      <p className="adm-login-notice">
        Não compartilhe suas credenciais.
        <br />
        Acesso monitorado e restrito.
      </p>
    </div>
  )
}
