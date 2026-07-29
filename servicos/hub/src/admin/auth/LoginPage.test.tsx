import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import { LoginPage } from './LoginPage'

const authMocks = vi.hoisted(() => ({
  getAdminSession: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('../supabase-client', async () => {
  const actual = await vi.importActual<typeof import('../supabase-client')>('../supabase-client')
  return {
    ...actual,
    getAdminSession: authMocks.getAdminSession,
    signOut: authMocks.signOut,
  }
})

function renderLogin(area: 'escritorio' | 'digital' = 'digital') {
  return render(
    <MemoryRouter>
      <LoginPage area={area} />
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    authMocks.getAdminSession.mockReset()
    authMocks.signOut.mockReset()
  })

  it('renderiza login do portal digital por padrao', () => {
    renderLogin()

    expect(screen.getByText('Plena Gestão Digital')).toBeDefined()
    expect(screen.getByLabelText(/E-mail/)).toBeDefined()
    expect(screen.getByLabelText(/Senha/)).toBeDefined()
  })

  it('renderiza login proprio do escritorio', () => {
    renderLogin('escritorio')

    expect(screen.getByText('Plena Gestão Escritório')).toBeDefined()
    expect(screen.getByRole('heading', { name: 'Entrar no Escritório' })).toBeDefined()
  })

  it('valida e-mail invalido ao submeter', async () => {
    renderLogin()

    fireEvent.change(screen.getByLabelText(/E-mail/), {
      target: { value: 'nao-e-email' },
    })
    fireEvent.change(screen.getByLabelText(/Senha/), {
      target: { value: 'senha123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain('E-mail inválido')
    })
  })

  it('chama sucesso quando perfil tem a area do portal', async () => {
    const onLogin = vi.fn().mockResolvedValue({ error: null })
    const onSuccess = vi.fn()
    authMocks.getAdminSession.mockResolvedValue({
      userId: 'user-1',
      email: 'staff@plena.com',
      role: 'recepcao',
      areas: ['escritorio'],
    })

    render(
      <MemoryRouter>
        <LoginPage area="escritorio" onLogin={onLogin} onSuccess={onSuccess} />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/E-mail/), {
      target: { value: 'staff@plena.com' },
    })
    fireEvent.change(screen.getByLabelText(/Senha/), {
      target: { value: 'senha123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith('staff@plena.com', 'senha123')
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
  })

  it('nega acesso e encerra sessao quando perfil nao tem a area do portal', async () => {
    const onLogin = vi.fn().mockResolvedValue({ error: null })
    authMocks.getAdminSession.mockResolvedValue({
      userId: 'user-1',
      email: 'cliente@plena.com',
      role: 'cliente',
      areas: [],
    })
    authMocks.signOut.mockResolvedValue({ error: null })

    render(
      <MemoryRouter>
        <LoginPage area="digital" onLogin={onLogin} onSuccess={vi.fn()} />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/E-mail/), {
      target: { value: 'cliente@plena.com' },
    })
    fireEvent.change(screen.getByLabelText(/Senha/), {
      target: { value: 'senha123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => {
      expect(authMocks.signOut).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('alert').textContent).toContain('não tem acesso')
    })
  })
})
