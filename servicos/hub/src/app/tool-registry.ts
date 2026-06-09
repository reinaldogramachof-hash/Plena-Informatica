import { declarationBuilderManifest } from '../features/tools/declaration-builder/manifest'
import { imagesToPdfManifest } from '../features/tools/images-to-pdf/manifest'
import { meiIrpfChecklistManifest } from '../features/tools/mei-irpf-checklist/manifest'
import { mergePdfManifest } from '../features/tools/merge-pdf/manifest'
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
].sort((left, right) => left.roadmapOrder - right.roadmapOrder)

export function getToolBySlug(slug: string): ToolManifest | undefined {
  return toolRegistry.find((tool) => tool.slug === slug)
}
