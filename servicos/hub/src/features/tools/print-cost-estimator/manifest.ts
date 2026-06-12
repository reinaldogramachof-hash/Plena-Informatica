import type { ToolManifest } from '../types'

export const printCostEstimatorManifest: ToolManifest = {
  slug: 'print-cost-estimator',
  name: 'Calculadora de Impressão',
  shortDescription:
    'Compare o custo de imprimir em casa com o custo de terceirizar na Plena.',
  category: 'utilities',
  processing: 'local',
  accountRequirement: 'none',
  persistence: 'none',
  status: 'available',
  roadmapOrder: 11,
}
