import type { ToolManifest } from '../types'

export const declarationBuilderManifest: ToolManifest = {
  slug: 'declaration-builder',
  name: 'Gerador de Declaracoes',
  shortDescription:
    'Preencha modelos orientados e salve rascunhos apenas quando desejar.',
  category: 'documents',
  processing: 'hybrid',
  accountRequirement: 'optional',
  persistence: 'optional',
  status: 'planned',
  roadmapOrder: 5,
}
