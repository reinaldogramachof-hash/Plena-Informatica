import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ClientProposalPage } from './ClientProposalPage'

const proposalServiceMocks = vi.hoisted(() => ({
  getClientUserId: vi.fn(),
  listClientProposals: vi.fn(),
  requestClientMagicLink: vi.fn(),
  acceptProposal: vi.fn(),
}))

vi.mock('../services/proposal-service', () => ({
  getClientUserId: proposalServiceMocks.getClientUserId,
  listClientProposals: proposalServiceMocks.listClientProposals,
  requestClientMagicLink: proposalServiceMocks.requestClientMagicLink,
  acceptProposal: proposalServiceMocks.acceptProposal,
}))

const sentProposal = {
  id: 'proposal-1',
  clientName: 'Cliente Ficticio',
  clientEmail: 'cliente.ficticio@example.com',
  clientUserId: 'client-user-1',
  title: 'Portal de propostas',
  scopeIncluded: ['Area do cliente'],
  scopeExcluded: ['Hospedagem'],
  techStack: [],
  investmentAmount: 5000,
  currency: 'BRL',
  status: 'sent',
  version: 1,
  validUntil: '2026-08-31',
  createdBy: null,
  createdAt: '2026-07-28T12:00:00.000Z',
  updatedAt: '2026-07-28T12:00:00.000Z',
  sentAt: '2026-07-28T13:00:00.000Z',
  acceptedAt: null,
} as const

describe('ClientProposalPage', () => {
  beforeEach(() => {
    proposalServiceMocks.getClientUserId.mockReset()
    proposalServiceMocks.listClientProposals.mockReset()
    proposalServiceMocks.requestClientMagicLink.mockReset()
    proposalServiceMocks.acceptProposal.mockReset()
  })

  it('mostra login por magic link fora do fluxo administrativo', async () => {
    proposalServiceMocks.getClientUserId.mockResolvedValue(null)
    proposalServiceMocks.requestClientMagicLink.mockResolvedValue(undefined)

    render(<ClientProposalPage />)

    fireEvent.change(await screen.findByLabelText('E-mail'), {
      target: { value: 'cliente.ficticio@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Enviar link de acesso/i }))

    await waitFor(() => expect(proposalServiceMocks.requestClientMagicLink).toHaveBeenCalledWith('cliente.ficticio@example.com'))
    expect(await screen.findByRole('status')).toHaveTextContent('Enviamos um link')
  })

  it('lista proposta da sessao autenticada', async () => {
    proposalServiceMocks.getClientUserId.mockResolvedValue('client-user-1')
    proposalServiceMocks.listClientProposals.mockResolvedValue([sentProposal])

    render(<ClientProposalPage />)

    expect(await screen.findByRole('heading', { name: 'Portal de propostas' })).toBeInTheDocument()
    expect(screen.getByText('Area do cliente')).toBeInTheDocument()
    expect(screen.getByText('Hospedagem')).toBeInTheDocument()
  })

  it('registra aceite via servico de consentimento', async () => {
    proposalServiceMocks.getClientUserId.mockResolvedValue('client-user-1')
    proposalServiceMocks.listClientProposals.mockResolvedValue([sentProposal])
    proposalServiceMocks.acceptProposal.mockResolvedValue({
      ...sentProposal,
      status: 'accepted',
      acceptedAt: '2026-07-28T14:00:00.000Z',
    })

    render(<ClientProposalPage />)

    fireEvent.click(await screen.findByRole('button', { name: 'Aceitar proposta' }))

    await waitFor(() => expect(proposalServiceMocks.acceptProposal).toHaveBeenCalledWith(sentProposal, navigator.userAgent))
    expect(await screen.findByText('Proposta aceita')).toBeInTheDocument()
  })
})
