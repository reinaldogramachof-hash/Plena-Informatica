import type { ComponentType, ReactNode } from 'react'
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'

import { InstitutionalShell } from './app/InstitutionalShell'
import { ToolCard } from './app/ToolCard'
import { ToolPageLayout } from './app/ToolPageLayout'
import { getToolBySlug, toolRegistry } from './app/tool-registry'
import { AuthGuard } from './admin/auth/AuthGuard'
import { LoginPage } from './admin/auth/LoginPage'
import { AdminShell } from './admin/shell/AdminShell'
import { DashboardPage } from './admin/dashboard/DashboardPage'
import { TransactionListPage } from './admin/transactions/TransactionListPage'
import { ReportPage } from './admin/reports/ReportPage'
import { BusinessCardCreatorTool } from './features/tools/business-card-creator/ui/BusinessCardCreatorTool'
import { DeclarationBuilderTool } from './features/tools/declaration-builder/ui/DeclarationBuilderTool'
import { ImagesToPdfTool } from './features/tools/images-to-pdf/ui/ImagesToPdfTool'
import { LabelGeneratorTool } from './features/tools/label-generator/ui/LabelGeneratorTool'
import { MeiDasGuideTool } from './features/tools/mei-das-guide/ui/MeiDasGuideTool'
import { MeiIrpfChecklistTool } from './features/tools/mei-irpf-checklist/ui/MeiIrpfChecklistTool'
import { MergePdfTool } from './features/tools/merge-pdf/ui/MergePdfTool'
import { MenuBuilderTool } from './features/tools/menu-builder/ui/MenuBuilderTool'
import { PrintCostEstimatorTool } from './features/tools/print-cost-estimator/ui/PrintCostEstimatorTool'
import { QrCodeTool } from './features/tools/qr-code/ui/QrCodeTool'
import { ResumeBuilderTool } from './features/tools/resume-builder/ui/ResumeBuilderTool'
import './styles/app.css'

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

function ToolCatalog() {
  return (
    <main>
      <section className="hub-hero">
        <a className="brand" href="../servicos.html">
          Plena Informática
        </a>
        <span className="eyebrow">Hub de Soluções Digitais</span>
        <h1>Ferramentas simples, seguras e sob seu controle.</h1>
        <p>
          Escolha uma solução, entenda o resultado antes de começar e conte com
          atendimento profissional somente quando precisar.
        </p>
      </section>

      <section className="catalog" aria-labelledby="catalog-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Serviços digitais Plena</span>
            <h2 id="catalog-title">Escolha o que precisa resolver</h2>
          </div>
          <p>
            Benefícios claros, processamento local sempre que possível e
            ferramentas preparadas para celular.
          </p>
        </div>

        <div className="tool-grid">
          {toolRegistry.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </main>
  )
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

function AdminPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <AuthGuard>
      <AdminShell pageTitle={title}>{children}</AdminShell>
    </AuthGuard>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ferramentas/qr-code" replace />} />
        <Route path="/catalogo" element={<ToolCatalog />} />
        <Route path="/ferramentas/:slug" element={<ToolRoute />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/dashboard"
          element={<AdminPage title="Dashboard"><DashboardPage /></AdminPage>}
        />
        <Route
          path="/admin/atendimentos"
          element={<AdminPage title="Atendimentos"><TransactionListPage /></AdminPage>}
        />
        <Route
          path="/admin/relatorios"
          element={<AdminPage title="Relatórios"><ReportPage /></AdminPage>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
