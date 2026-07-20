import { describe, expect, it } from 'vitest'

import {
  MAX_EDUCATION_ITEMS,
  MAX_EXPERIENCE_ITEMS,
  MAX_SKILLS,
  MAX_SUMMARY_CHARS,
  parseResumeData,
} from './resume-data'

const validResume = {
  personal: {
    fullName: '  Ana Silva  ',
    email: 'ana@example.com',
    phone: '(12) 99999-9999',
    city: 'Sao Jose dos Campos - SP',
    headline: 'Assistente administrativa',
    summary: 'Profissional organizada e focada em atendimento.',
  },
  experiences: [],
  education: [],
  skills: ['Organizacao', ' Atendimento ', ''],
}

describe('parseResumeData', () => {
  it('normalizes required data and removes empty skills', () => {
    const result = parseResumeData(validResume)

    expect(result.personal.fullName).toBe('Ana Silva')
    expect(result.skills).toEqual(['Organizacao', 'Atendimento'])
  })

  it('requires name, email, phone and headline — summary is optional', () => {
    // Todos os campos obrigatórios vazios: erro no primeiro (fullName)
    expect(() =>
      parseResumeData({
        ...validResume,
        personal: {
          fullName: '',
          email: '',
          phone: '',
          city: '',
          headline: '',
          summary: '',
        },
      }),
    ).toThrow('Informe seu nome completo')

    // summary vazio não deve lançar erro
    expect(() =>
      parseResumeData({
        ...validResume,
        personal: {
          ...validResume.personal,
          summary: '',
        },
      }),
    ).not.toThrow()
  })

  it('rejects summary longer than the limit', () => {
    expect(() =>
      parseResumeData({
        ...validResume,
        personal: {
          ...validResume.personal,
          summary: 'a'.repeat(MAX_SUMMARY_CHARS + 1),
        },
      }),
    ).toThrow(`${MAX_SUMMARY_CHARS} caracteres`)
  })

  it('rejects incomplete experience items', () => {
    expect(() =>
      parseResumeData({
        ...validResume,
        experiences: [
          {
            id: 'experience-1',
            role: 'Atendente',
            company: '',
            startDate: '2024-01',
            endDate: '',
            current: true,
            description: 'Atendimento ao cliente.',
          },
        ],
      }),
    ).toThrow('Informe a empresa')
  })

  it('enforces limits for dynamic sections', () => {
    const experience = {
      id: 'experience',
      role: 'Atendente',
      company: 'Empresa',
      startDate: '2024-01',
      endDate: '',
      current: true,
      description: 'Atendimento ao cliente.',
    }
    const education = {
      id: 'education',
      course: 'Administracao',
      institution: 'Faculdade',
      startYear: '2020',
      endYear: '2024',
    }

    expect(() =>
      parseResumeData({
        ...validResume,
        experiences: Array.from(
          { length: MAX_EXPERIENCE_ITEMS + 1 },
          (_, index) => ({ ...experience, id: `experience-${index}` }),
        ),
      }),
    ).toThrow(`Adicione no máximo ${MAX_EXPERIENCE_ITEMS} experiências`)

    expect(() =>
      parseResumeData({
        ...validResume,
        education: Array.from(
          { length: MAX_EDUCATION_ITEMS + 1 },
          (_, index) => ({ ...education, id: `education-${index}` }),
        ),
      }),
    ).toThrow(`Adicione no máximo ${MAX_EDUCATION_ITEMS} formações`)

    expect(() =>
      parseResumeData({
        ...validResume,
        skills: Array.from(
          { length: MAX_SKILLS + 1 },
          (_, index) => `Competencia ${index}`,
        ),
      }),
    ).toThrow(`Adicione no máximo ${MAX_SKILLS} competências`)
  })
})
