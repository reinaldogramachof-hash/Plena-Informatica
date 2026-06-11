import { PDFDocument } from 'pdf-lib'
import { describe, expect, it, vi } from 'vitest'

import { buildDeclaration, type DeclarationDocument } from './build-declaration'
import {
  createDeclarationPdf,
  type DeclarationPdfRenderer,
} from './create-declaration-pdf'
import { parseDeclarationData } from './declaration-data'

const document = buildDeclaration(
  parseDeclarationData('residence', {
    declarantName: 'Ana Silva',
    cpf: '123.456.789-00',
    address: 'Rua Exemplo, 100',
    city: 'São José dos Campos',
    date: '2026-06-10',
  }),
)

describe('createDeclarationPdf', () => {
  it('passes the document to an injected renderer', async () => {
    const renderer: DeclarationPdfRenderer = vi
      .fn()
      .mockResolvedValue(new Uint8Array([1, 2, 3]))

    await createDeclarationPdf(document, renderer)

    expect(renderer).toHaveBeenCalledWith(document)
  })

  it('generates a valid PDF', async () => {
    const bytes = await createDeclarationPdf(document)
    const pdf = await PDFDocument.load(bytes)

    expect(pdf.getPageCount()).toBe(1)
  })

  it('creates additional pages when the document is long', async () => {
    const longDocument: DeclarationDocument = {
      ...document,
      paragraphs: Array.from(
        { length: 24 },
        (_, index) =>
          `Parágrafo ${index + 1}. Este conteúdo detalha informações declaradas, seu contexto, período de referência e responsabilidade do signatário, preservando legibilidade e organização no documento final.`,
      ),
    }

    const bytes = await createDeclarationPdf(longDocument)
    const pdf = await PDFDocument.load(bytes)

    expect(pdf.getPageCount()).toBeGreaterThan(1)
  })
})
