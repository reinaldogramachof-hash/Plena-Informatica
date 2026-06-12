import { describe, expect, it, vi } from 'vitest'
import { PDFDocument } from 'pdf-lib'

import {
  buildResumeDocument,
  createResumePdf,
  type ResumePdfRenderer,
} from './create-resume-pdf'
import { parseResumeData } from './resume-data'
import type { TemplateId } from './resume-templates'

const resume = parseResumeData({
  personal: {
    fullName: 'Ana Silva',
    email: 'ana@example.com',
    phone: '(12) 99999-9999',
    city: 'Sao Jose dos Campos - SP',
    headline: 'Assistente administrativa',
    summary: 'Profissional organizada e focada em atendimento.',
  },
  experiences: [
    {
      id: 'experience-1',
      role: 'Atendente',
      company: 'Empresa Exemplo',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: 'Atendimento ao cliente e organizacao de documentos.',
    },
  ],
  education: [
    {
      id: 'education-1',
      course: 'Tecnico em Administracao',
      institution: 'Escola Exemplo',
      startYear: '2020',
      endYear: '2021',
    },
  ],
  skills: ['Atendimento', 'Organizacao'],
})

describe('resume PDF', () => {
  it('builds the professional sections in the expected order', () => {
    const document = buildResumeDocument(resume)

    expect(document.title).toBe('Ana Silva')
    expect(document.subtitle).toBe('Assistente administrativa')
    expect(document.sections.map((section) => section.title)).toEqual([
      'Resumo profissional',
      'Experiencia profissional',
      'Formacao',
      'Competencias',
    ])
    expect(document.sections[1]?.items[0]).toContain(
      'Atendente - Empresa Exemplo',
    )
    expect(document.sections[1]?.items[0]).toContain('Atual')
  })

  it('passes the document model to the renderer', async () => {
    const renderer: ResumePdfRenderer = vi
      .fn()
      .mockResolvedValue(new Uint8Array([1, 2, 3]))

    const result = await createResumePdf(resume, 'classic-ats', renderer)

    expect(result).toEqual(new Uint8Array([1, 2, 3]))
    expect(renderer).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Ana Silva',
        contactLine: expect.stringContaining('ana@example.com'),
      }),
      'classic-ats',
    )
  })

  it('generates a valid PDF document', async () => {
    const bytes = await createResumePdf(resume)
    const pdf = await PDFDocument.load(bytes)

    expect(pdf.getPageCount()).toBeGreaterThan(0)
  })

  it('classic-ats template produces a valid loadable PDF', async () => {
    const bytes = await createResumePdf(resume, 'classic-ats')
    const pdf = await PDFDocument.load(bytes)
    expect(pdf.getPageCount()).toBeGreaterThan(0)
  })

  it('executive template produces a valid loadable PDF', async () => {
    const bytes = await createResumePdf(resume, 'executive')
    const pdf = await PDFDocument.load(bytes)
    expect(pdf.getPageCount()).toBeGreaterThan(0)
  })

  it('modern template produces a valid loadable PDF', async () => {
    const bytes = await createResumePdf(resume, 'modern')
    const pdf = await PDFDocument.load(bytes)
    expect(pdf.getPageCount()).toBeGreaterThan(0)
  })

  it('first-job template produces a valid loadable PDF', async () => {
    const bytes = await createResumePdf(resume, 'first-job')
    const pdf = await PDFDocument.load(bytes)
    expect(pdf.getPageCount()).toBeGreaterThan(0)
  })

  it('creative template produces a valid loadable PDF', async () => {
    const bytes = await createResumePdf(resume, 'creative')
    const pdf = await PDFDocument.load(bytes)
    expect(pdf.getPageCount()).toBeGreaterThan(0)
  })

  it('forwards templateId to the renderer via dependency injection', async () => {
    const capturedArgs: Array<{ templateId: TemplateId | undefined }> = []
    const renderer: ResumePdfRenderer = vi.fn().mockImplementation((_doc, tid) => {
      capturedArgs.push({ templateId: tid })
      return Promise.resolve(new Uint8Array([1]))
    })

    await createResumePdf(resume, 'modern', renderer)

    expect(capturedArgs[0]?.templateId).toBe('modern')
  })
})
