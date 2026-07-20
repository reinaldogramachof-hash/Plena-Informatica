import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import App from '../../App'

const authMocks = vi.hoisted(() => ({
  getAdminSession: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('./AuthGuard', () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('../supabase-client', () => ({
  getAdminSession: authMocks.getAdminSession,
  signOut: authMocks.signOut,
}))

vi.mock('./LoginPage', () => ({
  LoginPage: () => <p>Tela de login</p>,
}))

vi.mock('../dashboard/DashboardPage', () => ({
  DashboardPage: () => <p>Conteúdo do dashboard</p>,
}))

vi.mock('../transactions/TransactionListPage', () => ({
  TransactionListPage: () => <p>Conteúdo dos atendimentos</p>,
}))

vi.mock('../reports/ReportPage', () => ({
  ReportPage: () => <p>Conteúdo dos relatórios</p>,
}))

vi.mock('../../app/InstitutionalShell', () => ({
  InstitutionalShell: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('../../app/ToolCard', () => ({
  ToolCard: () => <div>Tool card</div>,
}))

vi.mock('../../app/ToolPageLayout', () => ({
  ToolPageLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('../../app/tool-registry', () => ({
  getToolBySlug: () => null,
  toolRegistry: [],
}))

vi.mock('../../features/tools/business-card-creator/ui/BusinessCardCreatorTool', () => ({
  BusinessCardCreatorTool: () => null,
}))

vi.mock('../../features/tools/declaration-builder/ui/DeclarationBuilderTool', () => ({
  DeclarationBuilderTool: () => null,
}))

vi.mock('../../features/tools/images-to-pdf/ui/ImagesToPdfTool', () => ({
  ImagesToPdfTool: () => null,
}))

vi.mock('../../features/tools/label-generator/ui/LabelGeneratorTool', () => ({
  LabelGeneratorTool: () => null,
}))

vi.mock('../../features/tools/mei-das-guide/ui/MeiDasGuideTool', () => ({
  MeiDasGuideTool: () => null,
}))

vi.mock('../../features/tools/mei-irpf-checklist/ui/MeiIrpfChecklistTool', () => ({
  MeiIrpfChecklistTool: () => null,
}))

vi.mock('../../features/tools/merge-pdf/ui/MergePdfTool', () => ({
  MergePdfTool: () => null,
}))

vi.mock('../../features/tools/menu-builder/ui/MenuBuilderTool', () => ({
  MenuBuilderTool: () => null,
}))

vi.mock('../../features/tools/print-cost-estimator/ui/PrintCostEstimatorTool', () => ({
  PrintCostEstimatorTool: () => null,
}))

vi.mock('../../features/tools/qr-code/ui/QrCodeTool', () => ({
  QrCodeTool: () => null,
}))

vi.mock('../../features/tools/resume-builder/ui/ResumeBuilderTool', () => ({
  ResumeBuilderTool: () => null,
}))

describe('Admin app shell integration', () => {
  beforeEach(() => {
    window.location.hash = '#/admin/dashboard'
    authMocks.getAdminSession.mockReset()
    authMocks.signOut.mockReset()
  })

  afterEach(() => {
    window.location.hash = ''
  })

  it('exibe o e-mail do usuário autenticado na topbar', async () => {
    authMocks.getAdminSession.mockResolvedValue({
      userId: 'user-1',
      email: 'reinaldogramachof@gmail.com',
      role: 'admin',
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('reinaldogramachof@gmail.com')).toBeDefined()
      expect(screen.getByText('Conteúdo do dashboard')).toBeDefined()
    })
  })

  it('clicar em "Sair" executa logout e redireciona para /admin/login', async () => {
    authMocks.getAdminSession.mockResolvedValue({
      userId: 'user-1',
      email: 'reinaldogramachof@gmail.com',
      role: 'admin',
    })
    authMocks.signOut.mockResolvedValue({ error: null })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sair' })).toBeDefined()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))

    await waitFor(() => {
      expect(authMocks.signOut).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Tela de login')).toBeDefined()
    })
  })
})
