import type { ToolManifest } from '../types'

export const declarationBuilderManifest: ToolManifest = {
  slug: 'declaration-builder',
  name: 'Gerador de Declarações',
  shortDescription:
    'Crie declarações particulares com preenchimento orientado, prévia e geração local em PDF.',
  category: 'documents',
  processing: 'hybrid',
  accountRequirement: 'optional',
  persistence: 'optional',
  status: 'available',
  roadmapOrder: 5,
}
