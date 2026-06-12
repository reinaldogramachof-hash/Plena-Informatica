import type { ToolManifest } from '../types'

export const labelGeneratorManifest: ToolManifest = {
  slug: 'label-generator',
  name: 'Gerador de Etiquetas',
  shortDescription: 'Crie etiquetas para impressão em folha A4 padrão.',
  category: 'documents',
  processing: 'local',
  accountRequirement: 'none',
  persistence: 'none',
  status: 'available',
  roadmapOrder: 9,
}
