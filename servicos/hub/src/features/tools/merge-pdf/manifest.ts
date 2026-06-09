import type { ToolManifest } from '../types'

export const mergePdfManifest: ToolManifest = {
  slug: 'merge-pdf',
  name: 'Unificador de PDFs',
  shortDescription:
    'Reuna documentos PDF e escolha a ordem final diretamente no navegador.',
  category: 'pdf',
  processing: 'local',
  accountRequirement: 'none',
  persistence: 'none',
  status: 'planned',
  roadmapOrder: 3,
}
