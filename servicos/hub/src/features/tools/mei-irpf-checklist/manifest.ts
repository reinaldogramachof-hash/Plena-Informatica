import type { ToolManifest } from '../types'

export const meiIrpfChecklistManifest: ToolManifest = {
  slug: 'mei-irpf-checklist',
  name: 'Checklist MEI e IRPF',
  shortDescription:
    'Lista personalizada de documentos e providências para MEI ou IRPF',
  category: 'business',
  processing: 'hybrid',
  accountRequirement: 'optional',
  persistence: 'optional',
  status: 'available',
  roadmapOrder: 6,
}
