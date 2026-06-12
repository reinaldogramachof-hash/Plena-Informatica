import { z } from 'zod'
import { buildPixPayload } from './pix-payload'

export const MAX_QR_CONTENT_LENGTH = 2048

const limitedText = (emptyMessage: string) =>
  z
    .string()
    .trim()
    .min(1, emptyMessage)
    .max(
      MAX_QR_CONTENT_LENGTH,
      `O conteúdo deve ter no máximo ${MAX_QR_CONTENT_LENGTH} caracteres`,
    )

const phoneSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ''))
  .refine((value) => value.length >= 10 && value.length <= 15, {
    message: 'Informe um telefone com DDD e código do país',
  })

const qrInputSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('link'),
    url: limitedText('Informe o link').superRefine((value, context) => {
      try {
        const url = new URL(value)
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('invalid protocol')
        }
      } catch {
        context.addIssue({
          code: 'custom',
          message: 'Informe um link iniciado por http:// ou https://',
        })
      }
    }),
  }),
  z.object({
    mode: z.literal('text'),
    text: limitedText('Digite o texto do QR Code'),
  }),
  z.object({
    mode: z.literal('whatsapp'),
    phone: phoneSchema,
    message: z.string().trim().max(500, 'A mensagem deve ter no máximo 500 caracteres'),
  }),
  z.object({
    mode: z.literal('phone'),
    phone: phoneSchema,
  }),
  z.object({
    mode: z.literal('wifi'),
    security: z.enum(['WPA', 'WEP', 'nopass']),
    ssid: limitedText('Informe o nome da rede').max(
      64,
      'O nome da rede deve ter no máximo 64 caracteres',
    ),
    password: z.string().max(128, 'A senha deve ter no máximo 128 caracteres'),
    hidden: z.boolean(),
  }),
  z.object({
    mode: z.literal('pix'),
    pixType: z.enum(['copia-cola', 'chave']),
    payload: z.string().optional(),
    key: z.string().optional(),
    merchantName: z.string().optional(),
    merchantCity: z.string().optional(),
    amount: z.number().optional(),
  }).superRefine((data, context) => {
    if (data.pixType === 'copia-cola') {
      if (!data.payload?.trim()) {
        context.addIssue({
          code: 'custom',
          path: ['payload'],
          message: 'Cole o código Pix Copia e Cola',
        })
      } else if (!data.payload.startsWith('000201')) {
        context.addIssue({
          code: 'custom',
          path: ['payload'],
          message: 'O código Pix Copia e Cola informado não parece válido',
        })
      }
    } else {
      if (!data.key?.trim()) {
        context.addIssue({
          code: 'custom',
          path: ['key'],
          message: 'Informe a chave Pix',
        })
      }
      if (!data.merchantName?.trim()) {
        context.addIssue({
          code: 'custom',
          path: ['merchantName'],
          message: 'Informe o nome do recebedor',
        })
      }
      if (!data.merchantCity?.trim()) {
        context.addIssue({
          code: 'custom',
          path: ['merchantCity'],
          message: 'Informe a cidade do recebedor',
        })
      }
    }
  }),
])

export type QrInput = z.input<typeof qrInputSchema>
export type QrMode = QrInput['mode']

function parseQrInput(input: QrInput) {
  const result = qrInputSchema.safeParse(input)

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? 'Dados inválidos')
  }

  return result.data
}

function escapeWifiValue(value: string): string {
  return value.replace(/([\\;,:"])/g, '\\$1')
}

export function buildQrPayload(input: QrInput): string {
  const parsed = parseQrInput(input)

  switch (parsed.mode) {
    case 'link':
      return new URL(parsed.url).toString()
    case 'text':
      return parsed.text
    case 'whatsapp': {
      const message = parsed.message
        ? `?text=${encodeURIComponent(parsed.message)}`
        : ''
      return `https://wa.me/${parsed.phone}${message}`
    }
    case 'phone':
      return `tel:+${parsed.phone}`
    case 'wifi':
      return [
        `WIFI:T:${parsed.security}`,
        `S:${escapeWifiValue(parsed.ssid)}`,
        `P:${escapeWifiValue(parsed.password)}`,
        `H:${String(parsed.hidden)}`,
        '',
        '',
      ].join(';')
    case 'pix':
      if (parsed.pixType === 'copia-cola') {
        return parsed.payload!
      } else {
        return buildPixPayload({
          key: parsed.key!,
          merchantName: parsed.merchantName!,
          merchantCity: parsed.merchantCity!,
          amount: parsed.amount,
        })
      }
  }
}
