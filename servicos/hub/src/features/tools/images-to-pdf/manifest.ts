import type { ToolManifest } from '../types'

export const imagesToPdfManifest: ToolManifest = {
  slug: 'images-to-pdf',
  name: 'Imagens para PDF',
  shortDescription:
    'Organize imagens em um unico PDF sem enviar os arquivos para a nuvem.',
  category: 'pdf',
  processing: 'local',
  accountRequirement: 'none',
  persistence: 'none',
  status: 'available',
  roadmapOrder: 2,
}
