import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

import '../admin.css'
import './admin-shell.css'

interface AdminShellProps {
  children: ReactNode
  pageTitle: string
  userEmail?: string
  onLogout?: () => void
}

export function AdminShell({
  children,
  pageTitle,
  userEmail,
  onLogout,
}: AdminShellProps) {
  return (
    <div className="adm-layout">
      <aside className="adm-sidebar" aria-label="Navegação administrativa">
        <div className="adm-sidebar__brand">
          <strong>PLENA</strong>
          <span>Admin</span>
        </div>
        <nav>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? 'adm-nav-link adm-nav-link--active' : 'adm-nav-link'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/atendimentos"
            className={({ isActive }) =>
              isActive ? 'adm-nav-link adm-nav-link--active' : 'adm-nav-link'
            }
          >
            Atendimentos
          </NavLink>
          <NavLink
            to="/admin/propostas"
            className={({ isActive }) =>
              isActive ? 'adm-nav-link adm-nav-link--active' : 'adm-nav-link'
            }
          >
            Propostas
          </NavLink>
          <NavLink
            to="/admin/relatorios"
            className={({ isActive }) =>
              isActive ? 'adm-nav-link adm-nav-link--active' : 'adm-nav-link'
            }
          >
            Relatórios
          </NavLink>
        </nav>
        <button
          type="button"
          className="adm-logout"
          onClick={onLogout}
        >
          Sair
        </button>
      </aside>

      <div className="adm-body">
        <header className="adm-topbar" aria-label="Cabeçalho administrativo">
          <h1 className="adm-topbar__title">{pageTitle}</h1>
          {userEmail && (
            <span className="adm-topbar__user">{userEmail}</span>
          )}
        </header>
        <main className="adm-content">{children}</main>
      </div>
    </div>
  )
}
