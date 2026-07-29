import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { AreaSelectionPage } from './AreaSelectionPage'

vi.mock('../supabase-client', async () => {
  const actual = await vi.importActual<typeof import('../supabase-client')>('../supabase-client')
  return {
    ...actual,
    getAdminSession: vi.fn(),
    signOut: vi.fn(),
  }
})

describe('AreaSelectionPage', () => {
  it('exibe dois cards completos de login administrativo', () => {
    render(
      <MemoryRouter>
        <AreaSelectionPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Acessos administrativos')).toBeDefined()
    expect(screen.queryByText('Entrar nos sistemas Plena')).toBeNull()
    expect(screen.getByRole('link', { name: 'Voltar para a página inicial' })).toHaveAttribute(
      'href',
      'http://127.0.0.1:8080/index.html',
    )
    expect(screen.getByText('Plena Gestão Escritório')).toBeDefined()
    expect(screen.getByText('Plena Gestão Digital')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Entrar no Escritório' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Entrar no Digital' })).toBeDefined()
    expect(screen.getAllByLabelText(/E-mail/)).toHaveLength(2)
    expect(screen.getAllByLabelText(/Senha/)).toHaveLength(2)
  })
})
