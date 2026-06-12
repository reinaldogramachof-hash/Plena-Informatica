import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TransactionListPage } from './TransactionListPage'

vi.mock('./transaction-service', () => ({
  getTransactions: vi.fn().mockResolvedValue([]),
  addTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
}))

describe('TransactionListPage', () => {
  it('renderiza heading "Atendimentos" (via pageTitle no shell — aqui verifica toolbar)', () => {
    render(<TransactionListPage />)
    expect(
      screen.getByRole('button', { name: /Novo atendimento/i }),
    ).toBeDefined()
  })

  it('botão "Novo atendimento" está presente', () => {
    render(<TransactionListPage />)
    expect(
      screen.getByRole('button', { name: /Novo atendimento/i }),
    ).toBeDefined()
  })

  it('inputs de filtro de data (De / Até) estão presentes', () => {
    render(<TransactionListPage />)
    expect(screen.getByLabelText('Filtrar de')).toBeDefined()
    expect(screen.getByLabelText('Filtrar até')).toBeDefined()
  })

  it('mensagem de estado vazio é visível', async () => {
    render(<TransactionListPage />)
    expect(
      await screen.findByText(/Nenhum atendimento/i),
    ).toBeDefined()
  })

  it('clicar em "Novo atendimento" → NewTransactionForm aparece no DOM', () => {
    render(<TransactionListPage />)
    fireEvent.click(screen.getByRole('button', { name: /Novo atendimento/i }))
    expect(
      screen.getByRole('button', { name: /Registrar atendimento/i }),
    ).toBeDefined()
  })

  it('clicar em "Cancelar" no formulário → formulário some do DOM', () => {
    render(<TransactionListPage />)
    fireEvent.click(screen.getByRole('button', { name: /Novo atendimento/i }))
    expect(
      screen.getByRole('button', { name: /Registrar atendimento/i }),
    ).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }))
    expect(
      screen.queryByRole('button', { name: /Registrar atendimento/i }),
    ).toBeNull()
  })
})
