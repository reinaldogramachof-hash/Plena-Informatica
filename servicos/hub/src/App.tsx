import { lazy, Suspense, type ComponentType } from 'react'
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'

import { InstitutionalShell } from './app/InstitutionalShell'
import { CatalogRedirect } from './app/catalog-redirect'
import { ToolPageLayout } from './app/ToolPageLayout'
import { getToolBySlug } from './app/tool-registry'
import './styles/app.css'

const BusinessCardCreatorTool = lazy(() => import('./features/tools/business-card-creator/ui/BusinessCardCreatorTool').then((m) => ({ default: m.BusinessCardCreatorTool })))
const DeclarationBuilderTool = lazy(() => import('./features/tools/declaration-builder/ui/DeclarationBuilderTool').then((m) => ({ default: m.DeclarationBuilderTool })))
const ImagesToPdfTool = lazy(() => import('./features/tools/images-to-pdf/ui/ImagesToPdfTool').then((m) => ({ default: m.ImagesToPdfTool })))
const LabelGeneratorTool = lazy(() => import('./features/tools/label-generator/ui/LabelGeneratorTool').then((m) => ({ default: m.LabelGeneratorTool })))
const MeiDasGuideTool = lazy(() => import('./features/tools/mei-das-guide/ui/MeiDasGuideTool').then((m) => ({ default: m.MeiDasGuideTool })))
const MeiIrpfChecklistTool = lazy(() => import('./features/tools/mei-irpf-checklist/ui/MeiIrpfChecklistTool').then((m) => ({ default: m.MeiIrpfChecklistTool })))
const MergePdfTool = lazy(() => import('./features/tools/merge-pdf/ui/MergePdfTool').then((m) => ({ default: m.MergePdfTool })))
const MenuBuilderTool = lazy(() => import('./features/tools/menu-builder/ui/MenuBuilderTool').then((m) => ({ default: m.MenuBuilderTool })))
const PrintCostEstimatorTool = lazy(() => import('./features/tools/print-cost-estimator/ui/PrintCostEstimatorTool').then((m) => ({ default: m.PrintCostEstimatorTool })))
const QrCodeTool = lazy(() => import('./features/tools/qr-code/ui/QrCodeTool').then((m) => ({ default: m.QrCodeTool })))
const ResumeBuilderTool = lazy(() => import('./features/tools/resume-builder/ui/ResumeBuilderTool').then((m) => ({ default: m.ResumeBuilderTool })))

const toolComponents: Record<string, ComponentType> = {
  'qr-code': QrCodeTool,
  'images-to-pdf': ImagesToPdfTool,
  'merge-pdf': MergePdfTool,
  'resume-builder': ResumeBuilderTool,
  'declaration-builder': DeclarationBuilderTool,
  'mei-irpf-checklist': MeiIrpfChecklistTool,
  'menu-builder': MenuBuilderTool,
  'business-card-creator': BusinessCardCreatorTool,
  'label-generator': LabelGeneratorTool,
  'mei-das-guide': MeiDasGuideTool,
  'print-cost-estimator': PrintCostEstimatorTool,
}

function ToolRoute() {
  const { slug = '' } = useParams()
  const tool = getToolBySlug(slug)
  const ToolComponent = toolComponents[slug]

  if (!tool || !ToolComponent) {
    return <Navigate to="/" replace />
  }

  return (
    <InstitutionalShell>
      <ToolPageLayout tool={tool}>
        <ToolComponent />
      </ToolPageLayout>
    </InstitutionalShell>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div className="p-8 text-center text-gray-500 font-medium animate-pulse">Carregando...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/catalogo" replace />} />
          <Route path="/catalogo" element={<CatalogRedirect />} />
          <Route path="/ferramentas/:slug" element={<ToolRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
