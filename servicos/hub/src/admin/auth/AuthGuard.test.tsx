import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

import { AuthGuard } from './AuthGuard'

vi.mock('../supabase-client', () => ({
  getAdminSession: vi.fn(),
  onAdminAuthStateChange: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
}))

const ADMIN_SESSION = {
  userId: 'user-123',
  email: 'admin@plena.com',
  role: 'admin',
}

function LoginProbe() {
  const location = useLocation()

  return (
    <div>
      <p>Tela de login</p>
      <p>{String(location.state?.error ?? '')}</p>
    </div>
  )
}

describe('AuthGuard', () => {
  it('exibe "Verificando acesso..." durante carregamento', () => {
    const neverResolve = () => new Promise<null>(() => {})

    render(
      <MemoryRouter>
        <AuthGuard getSession={neverResolve}>
          <p>Conteúdo protegido</p>
        </AuthGuard>
      </MemoryRouter>,
    )

    expect(screen.getByText('Verificando acesso...')).toBeDefined()
  })

  it('redireciona para /admin/login quando getSession retorna null', async () => {
    const getSession = vi.fn().mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <AuthGuard getSession={getSession}>
          <p>Conteúdo protegido</p>
        </AuthGuard>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.queryByText('Conteúdo protegido')).toBeNull()
      expect(screen.queryByText('Verificando acesso...')).toBeNull()
    })
  })

  it('renderiza children quando getSession retorna sessão admin válida', async () => {
    const getSession = vi.fn().mockResolvedValue(ADMIN_SESSION)

    render(
      <MemoryRouter>
        <AuthGuard getSession={getSession}>
          <p>Conteúdo protegido</p>
        </AuthGuard>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Conteúdo protegido')).toBeDefined()
    })
  })

  it('quando getSession rejeita, redireciona para /admin/login com erro legível', async () => {
    const getSession = vi
      .fn()
      .mockRejectedValue(new Error('Não foi possível validar a sessão.'))

    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route
            path="/admin/dashboard"
            element={(
              <AuthGuard getSession={getSession}>
                <p>Conteúdo protegido</p>
              </AuthGuard>
            )}
          />
          <Route path="/admin/login" element={<LoginProbe />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Tela de login')).toBeDefined()
      expect(screen.getByText('Não foi possível validar a sessão.')).toBeDefined()
      expect(screen.queryByText('Verificando acesso...')).toBeNull()
    })
  })
})
