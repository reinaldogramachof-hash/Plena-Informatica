import { PDFDocument } from 'pdf-lib'
import { describe, expect, it, vi } from 'vitest'

import { buildDeclaration, type DeclarationDocument } from './build-declaration'
import {
  createDeclarationPdf,
  type DeclarationPdfRenderer,
} from './create-declaration-pdf'
import { parseDeclarationData } from './declaration-data'

const footerText =
  'não possui assinatura digital, reconhecimento de firma ou validação automática pela Plena Informática'

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

  it('renders a quote PDF without throwing', async () => {
    const quoteDocument: DeclarationDocument = {
      title: 'Orcamento',
      paragraphs: [
        'Emitente: Ana Silva.',
        'Cliente: Empresa Exemplo.',
        'Este orcamento nao constitui nota fiscal.',
      ],
      locationDate: 'São José dos Campos, 10 de junho de 2026',
      signatureName: 'Ana Silva',
      signatureLabel: 'Emitente',
      footerNote: footerText,
      table: {
        headers: ['Descricao', 'Qtd.', 'Vlr. unit.', 'Subtotal'],
        rows: [
          ['Impressão PB', '100', 'R$ 3,00', 'R$ 300,00'],
          ['Impressão Color', '20', 'R$ 4,00', 'R$ 80,00'],
        ],
        totalLabel: 'Total',
        totalValue: 'R$ 380,00',
      },
    }

    const bytes = await createDeclarationPdf(quoteDocument)
    expect(bytes.byteLength).toBeGreaterThan(500)
  })
})
