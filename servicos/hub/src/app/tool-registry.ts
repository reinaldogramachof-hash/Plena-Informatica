import { businessCardCreatorManifest } from '../features/tools/business-card-creator/manifest'
import { declarationBuilderManifest } from '../features/tools/declaration-builder/manifest'
import { imagesToPdfManifest } from '../features/tools/images-to-pdf/manifest'
import { labelGeneratorManifest } from '../features/tools/label-generator/manifest'
import { meiDasGuideManifest } from '../features/tools/mei-das-guide/manifest'
import { meiIrpfChecklistManifest } from '../features/tools/mei-irpf-checklist/manifest'
import { mergePdfManifest } from '../features/tools/merge-pdf/manifest'
import { menuBuilderManifest } from '../features/tools/menu-builder/manifest'
import { printCostEstimatorManifest } from '../features/tools/print-cost-estimator/manifest'
import { qrCodeManifest } from '../features/tools/qr-code/manifest'
import { resumeBuilderManifest } from '../features/tools/resume-builder/manifest'
import type { ToolManifest } from '../features/tools/types'

export const toolRegistry: readonly ToolManifest[] = [
  qrCodeManifest,
  imagesToPdfManifest,
  mergePdfManifest,
  resumeBuilderManifest,
  declarationBuilderManifest,
  meiIrpfChecklistManifest,
  menuBuilderManifest,
  businessCardCreatorManifest,
  labelGeneratorManifest,
  meiDasGuideManifest,
  printCostEstimatorManifest,
].sort((left, right) => left.roadmapOrder - right.roadmapOrder)

export function getToolBySlug(slug: string): ToolManifest | undefined {
  return toolRegistry.find((tool) => tool.slug === slug)
}
