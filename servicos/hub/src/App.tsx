import { useEffect, useState, lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'

import { InstitutionalShell } from './app/InstitutionalShell'
import { CatalogRedirect } from './app/catalog-redirect'
import { ToolPageLayout } from './app/ToolPageLayout'
import { getToolBySlug } from './app/tool-registry'
import { AuthGuard } from './admin/auth/AuthGuard'
import { AreaSelectionPage } from './admin/auth/AreaSelectionPage'
import { canAccessArea, type AdminArea } from './admin/auth/admin-areas'
import { LoginPage } from './admin/auth/LoginPage'
import { AdminShell } from './admin/shell/AdminShell'
import { getAdminSession, signOut, type AdminSession } from './admin/supabase-client'
import './styles/app.css'

const ClientProposalPage = lazy(() => import('./features/proposals/ui/ClientProposalPage').then((m) => ({ default: m.ClientProposalPage })))
const AdminProposalsPage = lazy(() => import('./features/proposals/ui/AdminProposalsPage').then((m) => ({ default: m.AdminProposalsPage })))
const OfficeAreaPage = lazy(() => import('./features/office/ui/OfficeAreaPage').then((m) => ({ default: m.OfficeAreaPage })))

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

function AdminPage({
  title,
  area,
  children,
}: {
  title: string
  area: AdminArea
  children: ReactNode
}) {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    getAdminSession()
      .then((session) => {
        if (!cancelled) {
          setSession(session)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSession(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleLogout() {
    await signOut()
    window.location.hash = area === 'escritorio' ? '#/escritorio/login' : '#/digital/login'
  }

  const loginPath = area === 'escritorio' ? '/escritorio/login' : '/digital/login'

  return (
    <AuthGuard loginPath={loginPath}>
      {isLoading ? (
        <div aria-live="polite">Carregando area administrativa...</div>
      ) : session && canAccessArea(session, area) ? (
        <AdminShell pageTitle={title} session={session} activeArea={area} onLogout={handleLogout}>
          {children}
        </AdminShell>
      ) : (
        <Navigate
          to={loginPath}
          replace
          state={{ error: 'Seu perfil nao tem acesso a este portal.' }}
        />
      )}
    </AuthGuard>
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
          <Route path="/admin" element={<Navigate to="/portais" replace />} />
          <Route path="/admin/login" element={<Navigate to="/portais" replace />} />
          <Route path="/admin/areas" element={<Navigate to="/portais" replace />} />
          <Route path="/portais" element={<AreaSelectionPage />} />
          <Route path="/escritorio/login" element={<LoginPage area="escritorio" />} />
          <Route path="/digital/login" element={<LoginPage area="digital" />} />
          <Route path="/admin/dashboard" element={<Navigate to="/escritorio" replace />} />
          <Route path="/admin/atendimentos" element={<Navigate to="/escritorio" replace />} />
          <Route path="/admin/relatorios" element={<Navigate to="/escritorio" replace />} />
          <Route path="/admin/escritorio" element={<Navigate to="/escritorio" replace />} />
          <Route path="/admin/propostas" element={<Navigate to="/digital/propostas" replace />} />
          <Route path="/admin/digital/propostas" element={<Navigate to="/digital/propostas" replace />} />
          <Route
            path="/escritorio"
            element={<AdminPage title="Gestao Escritorio" area="escritorio"><OfficeAreaPage /></AdminPage>}
          />
          <Route
            path="/escritorio/transacoes"
            element={<AdminPage title="Transacoes" area="escritorio"><OfficeAreaPage initialTab="transactions" /></AdminPage>}
          />
          <Route
            path="/escritorio/clientes"
            element={<AdminPage title="Clientes" area="escritorio"><OfficeAreaPage initialTab="clients" /></AdminPage>}
          />
          <Route
            path="/escritorio/servicos"
            element={<AdminPage title="Servicos" area="escritorio"><OfficeAreaPage initialTab="services" /></AdminPage>}
          />
          <Route
            path="/escritorio/fechamento"
            element={<AdminPage title="Fechamento" area="escritorio"><OfficeAreaPage initialTab="closing" /></AdminPage>}
          />
          <Route
            path="/escritorio/categorias"
            element={<AdminPage title="Categorias" area="escritorio"><OfficeAreaPage initialTab="settings" /></AdminPage>}
          />
          <Route
            path="/escritorio/importar"
            element={<AdminPage title="Importar JSON" area="escritorio"><OfficeAreaPage initialTab="import" /></AdminPage>}
          />
          <Route
            path="/digital/propostas"
            element={<AdminPage title="Propostas" area="digital"><AdminProposalsPage /></AdminPage>}
          />
          <Route path="/propostas" element={<ClientProposalPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
