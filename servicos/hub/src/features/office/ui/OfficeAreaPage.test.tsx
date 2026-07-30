import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { OfficeAreaPage } from './OfficeAreaPage'

const officeServiceMocks = vi.hoisted(() => ({
  listOfficeData: vi.fn(),
  createOfficeClient: vi.fn(),
  createClientTask: vi.fn(),
  toggleClientTask: vi.fn(),
  createOfficeCategory: vi.fn(),
  createOfficeTransaction: vi.fn(),
  deleteOfficeTransaction: vi.fn(),
  createOfficeServiceItem: vi.fn(),
  createOfficeServiceRecord: vi.fn(),
  createOfficeCashClosing: vi.fn(),
  importCashControlJson: vi.fn(),
}))

vi.mock('../services/office-service', () => officeServiceMocks)

const officeData = {
  clients: [{ id: 'client-1', name: 'Cliente Ficticio', phone: '11999990000', email: null, document: null, address: null, notes: 'Retorno mensal', origin: 'escritorio', created_by: 'staff-1', created_at: '2026-07-28', updated_at: '2026-07-28' }],
  tasks: [{ id: 'task-1', client_id: 'client-1', text: 'Separar documentos', completed: false, due_date: null, created_at: '2026-07-28' }],
  categories: [{ id: 'category-1', name: 'Impressao', type: 'income', color: '#f17a02', active: true }],
  transactions: [{ id: 'transaction-1', type: 'income', amount: 25, quantity: 1, description: 'Impressao colorida', category_id: 'category-1', client_id: 'client-1', tags: [], transaction_date: '2026-07-28', payment_method: 'pix', created_by: 'staff-1', created_at: '2026-07-28' }],
  serviceItems: [{ id: 'service-1', name: 'Plastificacao', default_price: 8, active: true }],
  serviceRecords: [],
  cashClosings: [],
}

describe('OfficeAreaPage', () => {
  beforeEach(() => {
    Object.values(officeServiceMocks).forEach((mock) => mock.mockReset())
    officeServiceMocks.listOfficeData.mockResolvedValue(officeData)
  })

  it('renderiza dashboard com dados do escritorio', async () => {
    render(<OfficeAreaPage />)

    expect(await screen.findByText('Saldo em Caixa')).toBeDefined()
    expect(screen.getByText('Receitas')).toBeDefined()
  })

  it('salva cliente usando o servico mockado', async () => {
    officeServiceMocks.createOfficeClient.mockResolvedValue({ id: 'client-2' })
    render(<OfficeAreaPage initialTab="clients" />)

    await screen.findByText('Cliente Ficticio')
    fireEvent.click(screen.getByRole('button', { name: /novo cliente/i }))
    fireEvent.change(screen.getByPlaceholderText('Nome do Cliente ou Empresa'), { target: { value: 'Cliente Novo' } })
    fireEvent.click(screen.getByRole('button', { name: /criar cliente/i }))

    await waitFor(() => {
      expect(officeServiceMocks.createOfficeClient).toHaveBeenCalledWith({
        name: 'Cliente Novo',
        phone: '',
        email: '',
        document: '',
        address: '',
        notes: '',
      })
    })
  })

  it('confirma fechamento de caixa e persiste via createOfficeCashClosing', async () => {
    officeServiceMocks.createOfficeCashClosing.mockResolvedValue({ id: 'closing-1' })
    render(<OfficeAreaPage />)

    await screen.findByText('Saldo em Caixa')
    fireEvent.click(screen.getByRole('button', { name: /fechar caixa/i }))

    const confirmButton = await screen.findByRole('button', { name: /confirmar fechamento/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(officeServiceMocks.createOfficeCashClosing).toHaveBeenCalledWith(
        expect.objectContaining({ totalIncome: 0, totalExpense: 0, balance: 0, notes: '' })
      )
    })

    await waitFor(() => {
      expect(officeServiceMocks.listOfficeData).toHaveBeenCalledTimes(2)
    })

    expect(await screen.findByText('Caixa fechado com sucesso.')).toBeDefined()
  })

  it('bloqueia novo fechamento quando ja existe registro do dia', async () => {
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    officeServiceMocks.listOfficeData.mockResolvedValue({
      ...officeData,
      cashClosings: [
        {
          id: 'closing-1',
          closing_date: todayStr,
          total_income: 25,
          total_expense: 0,
          balance: 25,
          notes: null,
          closed_by: 'staff-1',
          created_at: '2026-07-28T10:00:00Z',
        },
      ],
    })

    render(<OfficeAreaPage />)

    await screen.findByText('Saldo em Caixa')
    fireEvent.click(screen.getByRole('button', { name: /fechar caixa/i }))

    await screen.findByText(/caixa já fechado hoje/i)
    expect(screen.queryByRole('button', { name: /confirmar fechamento/i })).toBeNull()
    expect(officeServiceMocks.createOfficeCashClosing).not.toHaveBeenCalled()
  })
})
