import type { ToolManifest } from '../types'

export const menuBuilderManifest: ToolManifest = {
  slug: 'menu-builder',
  name: 'Gerador de Cardápio',
  shortDescription: 'Crie o layout do seu cardápio e baixe em PDF para impressão.',
  category: 'documents',
  processing: 'local',
  accountRequirement: 'none',
  persistence: 'none',
  status: 'available',
  roadmapOrder: 7,
}
