import type { ToolManifest } from '../types'

export const resumeBuilderManifest: ToolManifest = {
  slug: 'resume-builder',
  name: 'Criador de Curriculo',
  shortDescription:
    'Monte e revise um curriculo profissional com salvamento opcional.',
  category: 'professional',
  processing: 'hybrid',
  accountRequirement: 'optional',
  persistence: 'optional',
  status: 'available',
  roadmapOrder: 4,
}
