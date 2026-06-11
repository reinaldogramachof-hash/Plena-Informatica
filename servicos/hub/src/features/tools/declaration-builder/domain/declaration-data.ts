import {
  getDeclarationTemplate,
  type DeclarationTemplateId,
} from './declaration-templates'

export type DeclarationValues = Record<string, string>

export type DeclarationData = {
  templateId: DeclarationTemplateId
  values: DeclarationValues
}

export function parseDeclarationData(
  templateId: DeclarationTemplateId,
  values: DeclarationValues,
): DeclarationData {
  const template = getDeclarationTemplate(templateId)
  const normalized: DeclarationValues = {}

  for (const field of template.fields) {
    const value = (values[field.id] ?? '').trim()
    if (field.required && !value) throw new Error(field.errorMessage)
    if (value.length > field.maxLength) {
      throw new Error(
        `${field.label} deve ter no máximo ${field.maxLength} caracteres`,
      )
    }
    normalized[field.id] = value
  }

  return { templateId, values: normalized }
}
