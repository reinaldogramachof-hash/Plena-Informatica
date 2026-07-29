import { z } from 'zod'

export const officeTransactionTypeSchema = z.enum(['income', 'expense'])
export const officePaymentMethodSchema = z.enum(['cash', 'card', 'transfer', 'pix', 'other'])

export const officeClientSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome do cliente'),
  phone: z.string().trim().optional(),
  email: z.string().trim().email('E-mail invalido').optional().or(z.literal('')),
  document: z.string().trim().optional(),
  address: z.string().trim().optional(),
  notes: z.string().trim().optional(),
})

export const officeTransactionSchema = z.object({
  type: officeTransactionTypeSchema,
  amount: z.coerce.number().positive('Informe um valor maior que zero'),
  quantity: z.coerce.number().int().positive().optional().or(z.literal('')),
  description: z.string().trim().min(2, 'Informe a descricao'),
  categoryId: z.string().optional(),
  clientId: z.string().optional(),
  transactionDate: z.string().min(1, 'Informe a data'),
  paymentMethod: officePaymentMethodSchema,
  tags: z.string().optional(),
})

export const officeCategorySchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome da categoria'),
  type: officeTransactionTypeSchema,
  color: z.string().trim().optional(),
})

export const officeServiceItemSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome do servico'),
  defaultPrice: z.coerce.number().nonnegative('Informe um valor valido'),
})

export const officeServiceRecordSchema = z.object({
  serviceItemId: z.string().optional(),
  name: z.string().trim().min(2, 'Informe o servico'),
  quantity: z.coerce.number().int().positive('Informe a quantidade'),
  clientId: z.string().optional(),
  recordDate: z.string().min(1, 'Informe a data'),
})

export const officeCashClosingSchema = z.object({
  closingDate: z.string().min(1, 'Informe a data'),
  totalIncome: z.coerce.number().nonnegative(),
  totalExpense: z.coerce.number().nonnegative(),
  balance: z.coerce.number(),
  notes: z.string().trim().optional(),
})

export type OfficeClientInput = z.infer<typeof officeClientSchema>
export type OfficeTransactionInput = z.infer<typeof officeTransactionSchema>
export type OfficeCategoryInput = z.infer<typeof officeCategorySchema>
export type OfficeServiceItemInput = z.infer<typeof officeServiceItemSchema>
export type OfficeServiceRecordInput = z.infer<typeof officeServiceRecordSchema>
export type OfficeCashClosingInput = z.infer<typeof officeCashClosingSchema>

export const PAYMENT_METHOD_LABELS = {
  cash: 'Dinheiro',
  card: 'Cartao',
  transfer: 'Transferencia',
  pix: 'Pix',
  other: 'Outro',
} as const
