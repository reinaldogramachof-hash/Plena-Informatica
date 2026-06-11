import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

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
})
