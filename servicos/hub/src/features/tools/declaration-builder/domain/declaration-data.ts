import {
  getDeclarationTemplate,
  type DeclarationTemplateId,
} from './declaration-templates'

export type DeclarationValues = Record<string, string>

export interface QuoteItem {
  description: string
  quantity: number
  unitPrice: number
}

export interface RawQuoteItem {
  description: string
  quantity: string
  unitPrice: string
}

export type DeclarationData = {
  templateId: DeclarationTemplateId
  values: DeclarationValues
  items?: QuoteItem[]
}

function parsePositiveNum(value: string): number {
  const n = parseFloat(value.replace(',', '.'))
  return isNaN(n) || n <= 0 ? 0 : n
}

function parseQuoteItems(rawItems: RawQuoteItem[]): QuoteItem[] {
  if (rawItems.length === 0) {
    throw new Error('Informe ao menos um item no orcamento')
  }
  const items: QuoteItem[] = []
  for (let i = 0; i < rawItems.length; i++) {
    const raw = rawItems[i]!
    const description = raw.description.trim()
    if (!description) throw new Error(`Item ${i + 1}: descricao e obrigatoria`)
    const quantity = parsePositiveNum(raw.quantity)
    if (!quantity) throw new Error(`Item ${i + 1}: quantidade deve ser maior que zero`)
    const unitPrice = parsePositiveNum(raw.unitPrice)
    if (!unitPrice) throw new Error(`Item ${i + 1}: valor unitario deve ser maior que zero`)
    items.push({ description, quantity, unitPrice })
  }
  return items
}

export function parseDeclarationData(
  templateId: DeclarationTemplateId,
  values: DeclarationValues,
  rawItems?: RawQuoteItem[],
): DeclarationData {
  const template = getDeclarationTemplate(templateId)
  const normalized: DeclarationValues = {}

  for (const field of template.fields) {
    const value = (values[field.id] ?? '').trim()
    if (field.required && !value) throw new Error(field.errorMessage)
    if (value.length > field.maxLength) {
      throw new Error(
        `${field.label} deve ter no maximo ${field.maxLength} caracteres`,
      )
    }
    normalized[field.id] = value
  }

  if (templateId === 'quote') {
    const items = parseQuoteItems(rawItems ?? [])
    return { templateId, values: normalized, items }
  }

  return { templateId, values: normalized }
}
