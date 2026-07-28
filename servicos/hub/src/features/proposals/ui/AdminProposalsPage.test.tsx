import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AdminProposalsPage } from './AdminProposalsPage'

const proposalServiceMocks = vi.hoisted(() => ({
  listAdminProposals: vi.fn(),
  createProposal: vi.fn(),
  sendProposal: vi.fn(),
}))

vi.mock('../services/proposal-service', () => ({
  listAdminProposals: proposalServiceMocks.listAdminProposals,
  createProposal: proposalServiceMocks.createProposal,
  sendProposal: proposalServiceMocks.sendProposal,
}))

const draftProposal = {
  id: 'proposal-1',
  clientName: 'Cliente Ficticio',
  clientEmail: 'cliente.ficticio@example.com',
  clientUserId: null,
  title: 'Portal de propostas',
  scopeIncluded: ['Area do cliente'],
  scopeExcluded: [],
  techStack: [],
  investmentAmount: 5000,
  currency: 'BRL',
  status: 'draft',
  version: 1,
  validUntil: null,
  createdBy: 'admin-user-1',
  createdAt: '2026-07-28T12:00:00.000Z',
  updatedAt: '2026-07-28T12:00:00.000Z',
  sentAt: null,
  acceptedAt: null,
} as const

describe('AdminProposalsPage', () => {
  beforeEach(() => {
    proposalServiceMocks.listAdminProposals.mockReset()
    proposalServiceMocks.createProposal.mockReset()
    proposalServiceMocks.sendProposal.mockReset()
    proposalServiceMocks.listAdminProposals.mockResolvedValue([])
  })

  it('lista estado vazio de propostas', async () => {
    render(<AdminProposalsPage />)

    expect(await screen.findByText('Nenhuma proposta cadastrada.')).toBeInTheDocument()
  })

  it('cria uma proposta em rascunho com cliente ficticio', async () => {
    proposalServiceMocks.createProposal.mockResolvedValue(draftProposal)

    render(<AdminProposalsPage />)
    await screen.findByText('Nenhuma proposta cadastrada.')
    fireEvent.click(screen.getByRole('button', { name: /Nova proposta/i }))
    fireEvent.change(screen.getByLabelText('Cliente'), {
      target: { value: 'Cliente Ficticio' },
    })
    fireEvent.change(screen.getByLabelText('E-mail do cliente'), {
      target: { value: 'cliente.ficticio@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Titulo'), {
      target: { value: 'Portal de propostas' },
    })
    fireEvent.change(screen.getByLabelText(/Escopo incluso/i), {
      target: { value: 'Area do cliente' },
    })
    fireEvent.change(screen.getByLabelText('Investimento'), {
      target: { value: '5.000,00' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Salvar rascunho/i }))

    await waitFor(() => expect(proposalServiceMocks.createProposal).toHaveBeenCalledWith(expect.objectContaining({
      clientEmail: 'cliente.ficticio@example.com',
      scopeIncluded: ['Area do cliente'],
      investmentAmount: 5000,
    })))
    expect(await screen.findByText('Portal de propostas')).toBeInTheDocument()
  })

  it('envia apenas propostas em rascunho', async () => {
    proposalServiceMocks.listAdminProposals.mockResolvedValue([draftProposal])
    proposalServiceMocks.sendProposal.mockResolvedValue({ ...draftProposal, status: 'sent', sentAt: '2026-07-28T13:00:00.000Z' })

    render(<AdminProposalsPage />)

    fireEvent.click(await screen.findByRole('button', { name: 'Enviar' }))

    await waitFor(() => expect(proposalServiceMocks.sendProposal).toHaveBeenCalledWith('proposal-1'))
    expect(await screen.findByText('Enviada')).toBeInTheDocument()
  })
})
