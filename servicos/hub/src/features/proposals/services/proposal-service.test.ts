import { beforeEach, describe, expect, it, vi } from 'vitest'

const getSupabaseClient = vi.fn()

vi.mock('../../../admin/supabase-client', () => ({
  getSupabaseClient,
}))

const row = {
  id: 'proposal-1',
  client_name: 'Cliente Ficticio',
  client_email: 'cliente.ficticio@example.com',
  client_user_id: 'client-user-1',
  title: 'Portal de propostas',
  scope_included: ['Area do cliente'],
  scope_excluded: ['Hospedagem'],
  tech_stack: ['React'],
  investment_amount: 5000,
  currency: 'BRL',
  estimated_timeline: '30 dias',
  status: 'sent',
  version: 2,
  valid_until: '2026-08-31',
  created_by: 'admin-user-1',
  created_at: '2026-07-28T12:00:00.000Z',
  updated_at: '2026-07-28T12:00:00.000Z',
  sent_at: '2026-07-28T12:30:00.000Z',
  accepted_at: null,
}

describe('proposal-service', () => {
  beforeEach(() => {
    vi.resetModules()
    getSupabaseClient.mockReset()
  })

  it('cria proposta em draft com o usuario admin atual', async () => {
    const single = vi.fn().mockResolvedValue({
      data: { ...row, status: 'draft', sent_at: null },
      error: null,
    })
    const select = vi.fn().mockReturnValue({ single })
    const insert = vi.fn().mockReturnValue({ select })
    const from = vi.fn().mockReturnValue({ insert })

    getSupabaseClient.mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { user: { id: 'admin-user-1' } } },
        }),
      },
      from,
    })

    const { createProposal } = await import('./proposal-service')

    const proposal = await createProposal({
      clientName: 'Cliente Ficticio',
      clientEmail: 'cliente.ficticio@example.com',
      title: 'Portal de propostas',
      scopeIncluded: ['Area do cliente'],
      scopeExcluded: ['Hospedagem'],
      techStack: ['React'],
      investmentAmount: 5000,
      estimatedTimeline: '30 dias',
      validUntil: '2026-08-31',
    })

    expect(from).toHaveBeenCalledWith('proposals')
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      status: 'draft',
      created_by: 'admin-user-1',
    }))
    expect(proposal.status).toBe('draft')
  })

  it('envia proposta apenas mudando draft para sent', async () => {
    const single = vi.fn().mockResolvedValue({ data: row, error: null })
    const select = vi.fn().mockReturnValue({ single })
    const eqStatus = vi.fn().mockReturnValue({ select })
    const eqId = vi.fn().mockReturnValue({ eq: eqStatus })
    const update = vi.fn().mockReturnValue({ eq: eqId })
    const from = vi.fn().mockReturnValue({ update })

    getSupabaseClient.mockReturnValue({ from })

    const { sendProposal } = await import('./proposal-service')

    await sendProposal('proposal-1')

    expect(update).toHaveBeenCalledWith(expect.objectContaining({ status: 'sent' }))
    expect(eqId).toHaveBeenCalledWith('id', 'proposal-1')
    expect(eqStatus).toHaveBeenCalledWith('status', 'draft')
  })

  it('aceita proposta inserindo consent_records sem atualizar proposals diretamente', async () => {
    const consentInsert = vi.fn().mockResolvedValue({ error: null })
    const proposalSingle = vi.fn().mockResolvedValue({
      data: { ...row, status: 'accepted', accepted_at: '2026-07-28T13:00:00.000Z' },
      error: null,
    })
    const proposalEq = vi.fn().mockReturnValue({ single: proposalSingle })
    const proposalSelect = vi.fn().mockReturnValue({ eq: proposalEq })
    const proposalUpdate = vi.fn()
    const from = vi.fn((table: string) => {
      if (table === 'consent_records') return { insert: consentInsert }
      if (table === 'proposals') {
        return {
          select: proposalSelect,
          update: proposalUpdate,
        }
      }
      throw new Error(table)
    })

    getSupabaseClient.mockReturnValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { user: { id: 'client-user-1' } } },
        }),
      },
      from,
    })

    const { acceptProposal } = await import('./proposal-service')

    const accepted = await acceptProposal({
      id: 'proposal-1',
      clientName: 'Cliente Ficticio',
      clientEmail: 'cliente.ficticio@example.com',
      clientUserId: 'client-user-1',
      title: 'Portal de propostas',
      scopeIncluded: ['Area do cliente'],
      scopeExcluded: [],
      techStack: [],
      investmentAmount: 5000,
      currency: 'BRL',
      status: 'sent',
      version: 2,
      validUntil: null,
      createdBy: null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      sentAt: row.sent_at,
      acceptedAt: null,
    }, 'Vitest')

    expect(consentInsert).toHaveBeenCalledWith({
      user_id: 'client-user-1',
      document_type: 'proposal',
      document_id: 'proposal-1',
      document_version: 2,
      user_agent: 'Vitest',
      ip_address: null,
    })
    expect(proposalUpdate).not.toHaveBeenCalled()
    expect(accepted.status).toBe('accepted')
  })
})
