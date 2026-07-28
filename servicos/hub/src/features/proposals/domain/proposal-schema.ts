import { z } from 'zod'

export const PROPOSAL_STATUSES = ['draft', 'sent', 'accepted', 'declined'] as const
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number]

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: 'Rascunho',
  sent: 'Enviada',
  accepted: 'Aceita',
  declined: 'Recusada',
}

export const proposalFormSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(1, 'Informe o nome do cliente')
    .max(140, 'Use no maximo 140 caracteres'),
  clientEmail: z
    .string()
    .trim()
    .min(1, 'Informe o e-mail do cliente')
    .email('E-mail invalido'),
  title: z
    .string()
    .trim()
    .min(1, 'Informe o titulo da proposta')
    .max(160, 'Use no maximo 160 caracteres'),
  scopeIncluded: z
    .array(z.string().trim().min(1))
    .min(1, 'Informe ao menos um item incluso'),
  scopeExcluded: z.array(z.string().trim().min(1)).default([]),
  techStack: z.array(z.string().trim().min(1)).default([]),
  investmentAmount: z
    .string()
    .trim()
    .min(1, 'Informe o investimento')
    .transform((value) => Number.parseFloat(value.replace(/\./g, '').replace(',', '.')))
    .pipe(z.number().min(0.01, 'Investimento deve ser maior que zero')),
  estimatedTimeline: z.string().trim().max(120, 'Use no maximo 120 caracteres').optional(),
  validUntil: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data invalida')
    .optional()
    .or(z.literal('')),
})

export type ProposalFormInput = z.input<typeof proposalFormSchema>
export type ProposalFormData = z.output<typeof proposalFormSchema>

export interface ProposalRecord {
  id: string
  clientName: string
  clientEmail: string
  clientUserId: string | null
  title: string
  scopeIncluded: string[]
  scopeExcluded: string[]
  techStack: string[]
  investmentAmount: number
  currency: string
  estimatedTimeline?: string
  status: ProposalStatus
  version: number
  validUntil: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
  sentAt: string | null
  acceptedAt: string | null
}

export function linesToItems(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function formatProposalAmount(amount: number, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount)
}
