import { useState, type ReactNode } from 'react'
import {
  ArrowRightLeft,
  Briefcase,
  FileJson,
  FileText,
  Lock,
  Menu,
  PieChart,
  Tag,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import type { AdminArea } from '../auth/admin-areas'
import type { AdminSession } from '../supabase-client'
import '../admin.css'
import './admin-shell.css'

interface AdminShellProps {
  children: ReactNode
  pageTitle: string
  session: AdminSession
  activeArea: AdminArea
  onLogout?: () => void
}

interface AdminModuleItem {
  icon: LucideIcon
  label: string
  path: string
  iconLabel: string
}

interface AdminModuleSection {
  title: string
  items: AdminModuleItem[]
}

const officeSections: AdminModuleSection[] = [
  {
    title: 'Principal',
    items: [
      { icon: PieChart, label: 'Dashboard', path: '/escritorio', iconLabel: 'Dashboard' },
    ],
  },
  {
    title: 'Operacional',
    items: [
      {
        icon: ArrowRightLeft,
        label: 'Transacoes',
        path: '/escritorio/transacoes',
        iconLabel: 'Transacoes',
      },
      { icon: Users, label: 'Clientes', path: '/escritorio/clientes', iconLabel: 'Clientes' },
      { icon: Briefcase, label: 'Servicos', path: '/escritorio/servicos', iconLabel: 'Servicos' },
      { icon: Lock, label: 'Fechamento', path: '/escritorio/fechamento', iconLabel: 'Fechamento' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { icon: Tag, label: 'Categorias', path: '/escritorio/categorias', iconLabel: 'Categorias' },
      {
        icon: FileJson,
        label: 'Importar JSON',
        path: '/escritorio/importar',
        iconLabel: 'Importar JSON',
      },
    ],
  },
]

const digitalSections: AdminModuleSection[] = [
  {
    title: 'Digital',
    items: [
      { icon: FileText, label: 'Propostas', path: '/digital/propostas', iconLabel: 'Propostas' },
    ],
  },
]

export function AdminShell({
  children,
  pageTitle,
  session,
  activeArea,
  onLogout,
}: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const sections = activeArea === 'escritorio' ? officeSections : digitalSections
  const portalLabel = activeArea === 'escritorio' ? 'Controle v2.0' : 'Digital'
  const areaLabel = activeArea === 'escritorio' ? 'Gestao Escritorio' : 'Gestao Digital'
  const todayLabel = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const avatarLabel = session.email.trim().charAt(0).toUpperCase() || 'P'
  const MobileMenuIcon = isSidebarOpen ? X : Menu
  const mobileMenuLabel = isSidebarOpen ? 'Fechar menu' : 'Abrir menu'

  return (
    <div className="adm-layout">
      {isSidebarOpen && (
        <button
          type="button"
          className="adm-sidebar-overlay"
          aria-label="Fechar menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={isSidebarOpen ? 'adm-sidebar adm-sidebar--open' : 'adm-sidebar'}
        aria-label="Navegacao administrativa"
      >
        <div className="adm-sidebar__brand">
          <div className="adm-sidebar__brand-icon" aria-hidden="true">
            <Wallet className="adm-sidebar__brand-icon-svg" />
          </div>
          <div>
            <strong>PLENA</strong>
            <span>{portalLabel}</span>
          </div>
        </div>

        <nav className="adm-sidebar__nav" aria-label={`Menu ${areaLabel}`}>
          {sections.map((section) => (
            <div key={section.title} className="adm-nav-section">
              <h2 className="adm-nav-section__title">{section.title}</h2>

              <div className="adm-nav-section__items">
                {section.items.map((item) => {
                  const Icon = item.icon

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={({ isActive }) =>
                        isActive ? 'adm-nav-link adm-nav-link--active' : 'adm-nav-link'
                      }
                    >
                      <span
                        className="adm-nav-link__icon"
                        aria-hidden="true"
                        data-testid={`nav-icon-${item.path.replace(/[^\w]+/g, '-')}`}
                      >
                        <Icon className="adm-nav-link__icon-svg" />
                      </span>
                      <span>{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="adm-sidebar__footer">
          <button type="button" className="adm-logout" onClick={onLogout}>
            Sair
          </button>
          <p>
            Desenvolvido por
            <br />
            Plena Informatica
          </p>
        </div>
      </aside>

      <div className="adm-body">
        <header className="adm-topbar" aria-label="Cabecalho administrativo">
          <button
            type="button"
            className="adm-menu-button"
            onClick={() => setIsSidebarOpen((value) => !value)}
            aria-label={mobileMenuLabel}
            title={mobileMenuLabel}
          >
            <MobileMenuIcon className="adm-menu-button__icon" aria-hidden="true" />
          </button>
          <div>
            <h1 className="adm-topbar__title">{pageTitle}</h1>
            <span className="adm-topbar__portal">{areaLabel}</span>
          </div>
          <div className="adm-topbar__meta">
            <div className="adm-topbar__date">
              <span>Hoje</span>
              <strong>{todayLabel}</strong>
            </div>
            <div className="adm-topbar__avatar" title={session.email}>
              {avatarLabel}
            </div>
          </div>
        </header>
        <main className="adm-content">{children}</main>
      </div>
    </div>
  )
}
