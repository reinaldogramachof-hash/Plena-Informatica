import { getSupabaseClient } from '../../../admin/supabase-client'
import type { Tables } from '../../../lib/supabase/database.types'
import type { ProposalFormData, ProposalRecord } from '../domain/proposal-schema'

type ProposalRow = Tables<'proposals'>

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

function rowToProposal(row: ProposalRow): ProposalRecord {
  return {
    id: row.id,
    clientName: row.client_name,
    clientEmail: row.client_email,
    clientUserId: row.client_user_id,
    title: row.title,
    scopeIncluded: toStringArray(row.scope_included),
    scopeExcluded: toStringArray(row.scope_excluded),
    techStack: toStringArray(row.tech_stack),
    investmentAmount: Number(row.investment_amount),
    currency: row.currency,
    estimatedTimeline: row.estimated_timeline ?? undefined,
    status: row.status as ProposalRecord['status'],
    version: row.version,
    validUntil: row.valid_until,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sentAt: row.sent_at,
    acceptedAt: row.accepted_at,
  }
}

export async function listAdminProposals(): Promise<ProposalRecord[]> {
  const supabase = getSupabaseClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false }) as {
      data: ProposalRow[] | null
      error: unknown
    }

  if (error) {
    throw new Error('Falha ao carregar propostas.')
  }

  return (data ?? []).map(rowToProposal)
}

export async function createProposal(input: ProposalFormData): Promise<ProposalRecord> {
  const supabase = getSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Usuario nao autenticado.')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('proposals')
    .insert({
      client_name: input.clientName,
      client_email: input.clientEmail,
      title: input.title,
      scope_included: input.scopeIncluded,
      scope_excluded: input.scopeExcluded,
      tech_stack: input.techStack,
      investment_amount: input.investmentAmount,
      currency: 'BRL',
      estimated_timeline: input.estimatedTimeline || null,
      valid_until: input.validUntil || null,
      status: 'draft',
      created_by: session.user.id,
    })
    .select()
    .single() as { data: ProposalRow | null; error: unknown }

  if (error || !data) {
    throw new Error('Falha ao criar proposta.')
  }

  return rowToProposal(data)
}

export async function sendProposal(id: string): Promise<ProposalRecord> {
  const supabase = getSupabaseClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('proposals')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('status', 'draft')
    .select()
    .single() as { data: ProposalRow | null; error: unknown }

  if (error || !data) {
    throw new Error('Falha ao enviar proposta.')
  }

  return rowToProposal(data)
}

export async function requestClientMagicLink(email: string): Promise<void> {
  const supabase = getSupabaseClient()
  const emailRedirectTo = `${window.location.origin}${window.location.pathname}#/propostas`
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo },
  })

  if (error) {
    throw new Error('Falha ao enviar link de acesso.')
  }
}

export async function getClientUserId(): Promise<string | null> {
  const supabase = getSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session?.user.id ?? null
}

export async function listClientProposals(): Promise<ProposalRecord[]> {
  const supabase = getSupabaseClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('proposals')
    .select('*')
    .in('status', ['sent', 'accepted'])
    .order('created_at', { ascending: false }) as {
      data: ProposalRow[] | null
      error: unknown
    }

  if (error) {
    throw new Error('Falha ao carregar suas propostas.')
  }

  return (data ?? []).map(rowToProposal)
}

export async function acceptProposal(proposal: ProposalRecord, userAgent: string): Promise<ProposalRecord> {
  const supabase = getSupabaseClient()
  const userId = await getClientUserId()

  if (!userId) {
    throw new Error('Acesse pelo magic link antes de aceitar.')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('consent_records')
    .insert({
      user_id: userId,
      document_type: 'proposal',
      document_id: proposal.id,
      document_version: proposal.version,
      user_agent: userAgent || null,
      ip_address: null,
    }) as { error: unknown }

  if (error) {
    throw new Error('Falha ao registrar aceite.')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error: refreshError } = await (supabase as any)
    .from('proposals')
    .select('*')
    .eq('id', proposal.id)
    .single() as { data: ProposalRow | null; error: unknown }

  if (refreshError || !data) {
    return { ...proposal, status: 'accepted', acceptedAt: new Date().toISOString() }
  }

  return rowToProposal(data)
}
