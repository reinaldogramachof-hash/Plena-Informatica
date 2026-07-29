import { useState, type ReactNode } from 'react'
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

const officeModules = [
  { icon: 'D', label: 'Dashboard', path: '/escritorio' },
  { icon: 'T', label: 'Transacoes', path: '/escritorio/transacoes' },
  { icon: 'C', label: 'Clientes', path: '/escritorio/clientes' },
  { icon: 'S', label: 'Servicos', path: '/escritorio/servicos' },
  { icon: 'F', label: 'Fechamento', path: '/escritorio/fechamento' },
  { icon: 'G', label: 'Categorias', path: '/escritorio/categorias' },
  { icon: 'I', label: 'Importar JSON', path: '/escritorio/importar' },
]

const digitalModules = [
  { icon: 'P', label: 'Propostas', path: '/digital/propostas' },
  { icon: 'C', label: 'Clientes tecnologia', path: '/digital/propostas' },
  { icon: 'J', label: 'Projetos', path: '/digital/propostas' },
  { icon: 'A', label: 'Catalogo', path: '/digital/propostas' },
]

export function AdminShell({
  children,
  pageTitle,
  session,
  activeArea,
  onLogout,
}: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const modules = activeArea === 'escritorio' ? officeModules : digitalModules
  const portalLabel = activeArea === 'escritorio' ? 'Controle v2.0' : 'Digital'
  const todayLabel = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

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
          <div className="adm-sidebar__brand-icon">$</div>
          <div>
            <strong>PLENA</strong>
            <span>{portalLabel}</span>
          </div>
        </div>

        <nav className="adm-sidebar__nav">
          {modules.map((item, index) => (
            <NavLink
              key={`${item.label}-${index}`}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? 'adm-nav-link adm-nav-link--active'
                  : 'adm-nav-link'
              }
            >
              <span className="adm-nav-link__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="adm-sidebar__footer">
          <button
            type="button"
            className="adm-logout"
            onClick={onLogout}
          >
            Sair
          </button>
          <p>
            Desenvolvido por<br />
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
            aria-label="Abrir menu"
          >
            Menu
          </button>
          <div>
            <h1 className="adm-topbar__title">{pageTitle}</h1>
            <span className="adm-topbar__portal">
              {activeArea === 'escritorio' ? 'Gestao Escritorio' : 'Gestao Digital'}
            </span>
          </div>
          <div className="adm-topbar__meta">
            <div className="adm-topbar__date">
              <span>Hoje</span>
              <strong>{todayLabel}</strong>
            </div>
            <div className="adm-topbar__avatar" title={session.email}>
              P
            </div>
          </div>
        </header>
        <main className="adm-content">{children}</main>
      </div>
    </div>
  )
}
