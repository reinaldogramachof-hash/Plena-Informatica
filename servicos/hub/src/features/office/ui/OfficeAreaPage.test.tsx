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

    expect(await screen.findByText('Plena Gestao Escritorio')).toBeDefined()
    expect(screen.getByText('Impressao colorida')).toBeDefined()
    expect(screen.getByText('Cliente Ficticio')).toBeDefined()
  })

  it('salva cliente usando o servico mockado', async () => {
    officeServiceMocks.createOfficeClient.mockResolvedValue({ id: 'client-2' })
    render(<OfficeAreaPage initialTab="clients" />)

    await screen.findByText('Cliente Ficticio')
    fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'Cliente Novo' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar cliente' }))

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
})
