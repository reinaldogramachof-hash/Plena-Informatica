import { z } from 'zod'

export const PAYMENT_METHODS = ['dinheiro', 'pix', 'cartao', 'outro'] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  dinheiro: 'Dinheiro',
  pix: 'Pix',
  cartao: 'Cartão',
  outro: 'Outro',
}

export const SERVICE_CATEGORIES = [
  'MEI',
  'IRPF',
  'Impressão',
  'Documentos',
  'Currículo',
  'Cartão de Visitas',
  'Cardápio',
  'Encadernação',
  'Plastificação',
  'Outros',
] as const
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]

export const transactionSchema = z.object({
  serviceDate: z
    .string()
    .min(1, 'Informe a data do atendimento')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  category: z.enum(SERVICE_CATEGORIES, {
    error: 'Selecione uma categoria',
  }),
  serviceName: z
    .string()
    .trim()
    .min(1, 'Informe o serviço realizado')
    .max(120, 'Use no máximo 120 caracteres'),
  amount: z
    .string()
    .min(1, 'Informe o valor cobrado')
    .transform((v) => parseFloat(v.replace(',', '.')))
    .pipe(z.number().min(0.01, 'Valor deve ser maior que zero')),
  paymentMethod: z.enum(PAYMENT_METHODS, {
    error: 'Selecione a forma de pagamento',
  }),
  notes: z.string().trim().max(500, 'Use no máximo 500 caracteres').optional(),
})

export type TransactionInput = z.input<typeof transactionSchema>
export type Transaction = z.output<typeof transactionSchema>
