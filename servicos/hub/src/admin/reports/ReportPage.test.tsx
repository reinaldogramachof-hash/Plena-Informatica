import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ReportPage } from './ReportPage'

vi.mock('../transactions/transaction-service', () => ({
  getTransactions: vi.fn().mockResolvedValue([]),
}))

describe('ReportPage', () => {
  it('renderiza heading "Relatórios"', () => {
    render(<ReportPage />)
    expect(screen.getByRole('heading', { name: /Relatórios/i })).toBeDefined()
  })

  it('seletores de mês e ano estão presentes', () => {
    render(<ReportPage />)
    expect(screen.getByRole('combobox', { name: /Mês/i })).toBeDefined()
    expect(screen.getByRole('combobox', { name: /Ano/i })).toBeDefined()
  })

  it('botão "Gerar relatório" está presente', () => {
    render(<ReportPage />)
    expect(
      screen.getByRole('button', { name: /Gerar relatório/i }),
    ).toBeDefined()
  })

  it('botão "Exportar CSV" está presente no DOM', () => {
    render(<ReportPage />)
    expect(
      screen.getByRole('button', { name: /Exportar CSV/i }),
    ).toBeDefined()
  })

  it('resumo de KPIs presente com traços iniciais', () => {
    render(<ReportPage />)
    expect(screen.getByText(/Total de atendimentos/i)).toBeDefined()
    expect(screen.getByText(/Total faturado/i)).toBeDefined()
    expect(screen.getByText(/Média por atendimento/i)).toBeDefined()
  })

  it('nota de privacidade sobre geração local está presente', () => {
    render(<ReportPage />)
    expect(
      screen.getByText(/Relatórios gerados localmente/i),
    ).toBeDefined()
  })
})
