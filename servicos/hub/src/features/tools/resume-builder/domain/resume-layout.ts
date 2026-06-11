import type { ResumeData } from './resume-data'
import type { TemplateId } from './resume-templates'

export interface VisibleSections {
  hasExperience: boolean
  hasEducation: boolean
  hasSkills: boolean
  hasSummary: boolean
  experienceIsSecondary: boolean
}

export function getVisibleSections(
  data: ResumeData,
  templateId: TemplateId,
): VisibleSections {
  return {
    hasExperience: data.experiences.length > 0,
    hasEducation: data.education.length > 0,
    hasSkills: data.skills.length > 0,
    hasSummary: data.personal.summary.trim().length > 0,
    experienceIsSecondary: templateId === 'first-job',
  }
}
