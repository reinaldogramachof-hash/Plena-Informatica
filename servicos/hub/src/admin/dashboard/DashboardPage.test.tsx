import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import { DashboardPage } from './DashboardPage'

vi.mock('../transactions/transaction-service', () => ({
  getTransactions: vi.fn().mockResolvedValue([]),
}))

describe('DashboardPage', () => {
  it('renderiza 3 cards: "Hoje", "Este mês", "Este ano"', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )
    expect(await screen.findByText('Hoje')).toBeDefined()
    expect(screen.getByText('Este mês')).toBeDefined()
    expect(screen.getByText('Este ano')).toBeDefined()
  })

  it('tabela de categorias está presente', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )
    expect(await screen.findByText('Por categoria (este mês)')).toBeDefined()
    expect(screen.getByRole('table')).toBeDefined()
  })

  it('Link "Registrar atendimento" aponta para /admin/atendimentos', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )
    const link = await screen.findByRole('link', { name: /Registrar atendimento/i })
    expect(link).toBeDefined()
  })

  it('Link "Ver todos os atendimentos" está presente', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )
    const link = await screen.findByRole('link', { name: /Ver todos os atendimentos/i })
    expect(link).toBeDefined()
  })
})
