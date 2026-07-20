import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import { LoginPage } from './LoginPage'

vi.mock('../supabase-client')

describe('LoginPage', () => {
  it('renderiza campo E-mail e campo Senha', () => {
    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    expect(container.querySelector('#adm-email')).toBeDefined()
    expect(container.querySelector('#adm-password')).toBeDefined()
  })

  it('botão "Entrar" está presente', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeDefined()
  })

  it('e-mail inválido ao submeter -> role="alert" com mensagem Zod', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.change(container.querySelector('#adm-email')!, {
      target: { value: 'nao-e-email' },
    })
    fireEvent.change(container.querySelector('#adm-password')!, {
      target: { value: 'senha123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined()
      expect(screen.getByRole('alert').textContent).toContain('E-mail inválido')
    })
  })

  it('senha curta ao submeter -> role="alert" com mensagem Zod', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    fireEvent.change(container.querySelector('#adm-email')!, {
      target: { value: 'admin@plena.com' },
    })
    fireEvent.change(container.querySelector('#adm-password')!, {
      target: { value: '123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined()
      expect(screen.getByRole('alert').textContent).toContain(
        'Senha deve ter ao menos 6 caracteres',
      )
    })
  })

  it('onLogin chamado com email e senha ao submeter dados válidos', async () => {
    const onLogin = vi.fn().mockResolvedValue({ error: null })
    const onSuccess = vi.fn()

    const { container } = render(
      <MemoryRouter>
        <LoginPage onLogin={onLogin} onSuccess={onSuccess} />
      </MemoryRouter>,
    )

    fireEvent.change(container.querySelector('#adm-email')!, {
      target: { value: 'admin@plena.com' },
    })
    fireEvent.change(container.querySelector('#adm-password')!, {
      target: { value: 'senha123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith('admin@plena.com', 'senha123')
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
  })

  it('botão exibe "Entrando..." e fica disabled durante isLoading', async () => {
    let resolveLogin: (v: { error: null }) => void
    const blockingLogin = () =>
      new Promise<{ error: null }>((r) => {
        resolveLogin = r
      })

    const { container } = render(
      <MemoryRouter>
        <LoginPage onLogin={blockingLogin} onSuccess={vi.fn()} />
      </MemoryRouter>,
    )

    fireEvent.change(container.querySelector('#adm-email')!, {
      target: { value: 'admin@plena.com' },
    })
    fireEvent.change(container.querySelector('#adm-password')!, {
      target: { value: 'senha123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /Entrando.../i })
      expect(btn).toBeDefined()
      expect((btn as HTMLButtonElement).disabled).toBe(true)
    })

    resolveLogin!({ error: null })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Entrar' })).toBeDefined()
    })
  })

  it('quando onLogin retorna error -> exibe role="alert" com "E-mail ou senha incorretos."', async () => {
    const onLogin = vi
      .fn()
      .mockResolvedValue({ error: new Error('Invalid credentials') })

    const { container } = render(
      <MemoryRouter>
        <LoginPage onLogin={onLogin} onSuccess={vi.fn()} />
      </MemoryRouter>,
    )

    fireEvent.change(container.querySelector('#adm-email')!, {
      target: { value: 'admin@plena.com' },
    })
    fireEvent.change(container.querySelector('#adm-password')!, {
      target: { value: 'senha123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain(
        'E-mail ou senha incorretos.',
      )
    })
  })

  it('quando onLogin rejeita por erro de infraestrutura -> exibe role="alert" com mensagem visível', async () => {
    const onLogin = vi
      .fn()
      .mockRejectedValue(new Error('Configure VITE_SUPABASE_URL antes de entrar.'))

    const { container } = render(
      <MemoryRouter>
        <LoginPage onLogin={onLogin} onSuccess={vi.fn()} />
      </MemoryRouter>,
    )

    fireEvent.change(container.querySelector('#adm-email')!, {
      target: { value: 'admin@plena.com' },
    })
    fireEvent.change(container.querySelector('#adm-password')!, {
      target: { value: 'senha123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain(
        'Configure VITE_SUPABASE_URL antes de entrar.',
      )
    })
  })

  it('renderiza erro vindo do redirecionamento do AuthGuard', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/admin/login',
            state: { error: 'Não foi possível validar a sessão.' },
          },
        ]}
      >
        <LoginPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain(
        'Não foi possível validar a sessão.',
      )
    })
  })

  it('toggle de senha: clique alterna type password <-> text', () => {
    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    const passwordInput = container.querySelector('#adm-password') as HTMLInputElement
    expect(passwordInput.type).toBe('password')

    fireEvent.click(screen.getByRole('button', { name: /Mostrar senha/i }))
    expect(passwordInput.type).toBe('text')

    fireEvent.click(screen.getByRole('button', { name: /Ocultar senha/i }))
    expect(passwordInput.type).toBe('password')
  })
})
