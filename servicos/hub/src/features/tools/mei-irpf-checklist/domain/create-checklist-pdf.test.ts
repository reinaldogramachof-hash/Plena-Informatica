import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'

import { createChecklistPdf } from './create-checklist-pdf'
import type { ChecklistGroup } from './build-checklist'
import { createSession } from './checklist-session'

describe('createChecklistPdf', () => {
  const mockGroups: ChecklistGroup[] = [
    {
      category: 'Identificação pessoal',
      items: [
        {
          id: 'mei-rg',
          audience: 'mei',
          category: 'Identificação pessoal',
          title: 'Documento de identidade (RG ou CNH)',
          description: 'Cópia e original do documento de identidade com foto válido.',
        },
        {
          id: 'mei-cpf',
          audience: 'mei',
          category: 'Identificação pessoal',
          title: 'CPF',
          description: 'Número do CPF — confirme se está regularizado na Receita Federal.',
          attention: 'Confirme a situação cadastral do CPF no site da Receita Federal.',
        }
      ]
    }
  ]

  it('retorna Uint8Array com dados', async () => {
    const session = createSession()
    session.checked.add('mei-rg') // Marcar um item
    const result = await createChecklistPdf(mockGroups, session, 'mei')
    
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result.length).toBeGreaterThan(0)

    const pdf = await PDFDocument.load(result)
    expect(pdf.getPageCount()).toBe(1)
  })

  it('funciona com grupos vazios sem lancar excecao', async () => {
    const session = createSession()
    const result = await createChecklistPdf([], session, 'irpf')
    
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result.length).toBeGreaterThan(0)

    const pdf = await PDFDocument.load(result)
    expect(pdf.getPageCount()).toBe(1)
  })
})
