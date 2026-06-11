import { describe, expect, it } from 'vitest'

import { getVisibleSections } from './resume-layout'
import { parseResumeData } from './resume-data'

const resumeWithContent = parseResumeData({
  personal: {
    fullName: 'Ana Silva',
    email: 'ana@example.com',
    phone: '(12) 99999-9999',
    city: 'Sao Paulo - SP',
    headline: 'Desenvolvedora',
    summary: 'Profissional com experiencia em tecnologia.',
  },
  experiences: [
    {
      id: 'exp-1',
      role: 'Dev',
      company: 'Tech',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: 'Desenvolvimento de sistemas.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      course: 'Ciencia da Computacao',
      institution: 'UNICAMP',
      startYear: '2018',
      endYear: '2022',
    },
  ],
  skills: ['JavaScript', 'TypeScript'],
})

const resumeEmpty = parseResumeData({
  personal: {
    fullName: 'Ana Silva',
    email: 'ana@example.com',
    phone: '(12) 99999-9999',
    city: '',
    headline: 'Desenvolvedora',
    summary: 'Resumo profissional.',
  },
  experiences: [],
  education: [],
  skills: [],
})

describe('getVisibleSections', () => {
  it('marks sections with content as visible', () => {
    const sections = getVisibleSections(resumeWithContent, 'classic-ats')

    expect(sections.hasExperience).toBe(true)
    expect(sections.hasEducation).toBe(true)
    expect(sections.hasSkills).toBe(true)
  })

  it('marks empty sections as hidden', () => {
    const sections = getVisibleSections(resumeEmpty, 'classic-ats')

    expect(sections.hasExperience).toBe(false)
    expect(sections.hasEducation).toBe(false)
    expect(sections.hasSkills).toBe(false)
  })

  it('sets experienceIsSecondary true for first-job template', () => {
    const sections = getVisibleSections(resumeWithContent, 'first-job')

    expect(sections.experienceIsSecondary).toBe(true)
  })

  it('sets experienceIsSecondary false for other templates', () => {
    for (const templateId of ['classic-ats', 'executive', 'modern', 'creative'] as const) {
      const sections = getVisibleSections(resumeWithContent, templateId)
      expect(sections.experienceIsSecondary).toBe(false)
    }
  })
})
