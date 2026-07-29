import { beforeEach, describe, expect, it, vi } from 'vitest'

const getSupabaseClient = vi.fn()

vi.mock('../../../admin/supabase-client', () => ({
  getSupabaseClient,
}))

async function loadModule() {
  vi.resetModules()
  return import('./office-service')
}

beforeEach(() => {
  getSupabaseClient.mockReset()
})

describe('office-service', () => {
  it('importa JSON do Cash Control sem acessar banco real', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null })
    const from = vi.fn().mockReturnValue({ insert })

    getSupabaseClient.mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { user: { id: 'staff-1' } } },
        }),
      },
      from,
    })

    const { importCashControlJson } = await loadModule()
    const result = await importCashControlJson({
      clients: [{ nome: 'Cliente Ficticio', telefone: '(11) 99999-0000' }],
      transactions: [{ descricao: 'Impressao', valor: '25,50', data: '2026-07-28', pagamento: 'pix' }],
      serviceItems: [{ nome: 'Plastificacao', valor: 8 }],
      serviceRecords: [{ servico: 'Plastificacao', quantidade: 2, data: '2026-07-28' }],
    })

    expect(result).toEqual({
      clients: 1,
      serviceItems: 1,
      transactions: 1,
      serviceRecords: 1,
    })
    expect(from).toHaveBeenCalledWith('clients')
    expect(from).toHaveBeenCalledWith('office_transactions')
    expect(from).toHaveBeenCalledWith('office_service_items')
    expect(from).toHaveBeenCalledWith('office_service_records')
    expect(insert).toHaveBeenCalledTimes(4)
  })

  it('salva transacao no schema novo do escritorio', async () => {
    const single = vi.fn().mockResolvedValue({
      data: { id: 'transaction-1', description: 'Pix recebido' },
      error: null,
    })
    const select = vi.fn().mockReturnValue({ single })
    const insert = vi.fn().mockReturnValue({ select })
    const from = vi.fn().mockReturnValue({ insert })

    getSupabaseClient.mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { user: { id: 'staff-1' } } },
        }),
      },
      from,
    })

    const { createOfficeTransaction } = await loadModule()
    const result = await createOfficeTransaction({
      type: 'income',
      amount: 120,
      quantity: 1,
      description: 'Pix recebido',
      categoryId: '',
      clientId: '',
      transactionDate: '2026-07-28',
      paymentMethod: 'pix',
      tags: 'balcao, teste',
    })

    expect(result).toEqual({ id: 'transaction-1', description: 'Pix recebido' })
    expect(from).toHaveBeenCalledWith('office_transactions')
    expect(insert).toHaveBeenCalledWith({
      type: 'income',
      amount: 120,
      quantity: 1,
      description: 'Pix recebido',
      category_id: null,
      client_id: null,
      tags: ['balcao', 'teste'],
      transaction_date: '2026-07-28',
      payment_method: 'pix',
      created_by: 'staff-1',
    })
  })
})
