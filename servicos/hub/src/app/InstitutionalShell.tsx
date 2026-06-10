import type { ReactNode } from 'react'

import plenaLogo from '../../../logo-plena.png'

const servicesPage = '../../servicos.html'

type InstitutionalShellProps = {
  children: ReactNode
}

export function InstitutionalShell({ children }: InstitutionalShellProps) {
  return (
    <div className="institutional-page">
      <header aria-label="Navegação Plena" className="institutional-header">
        <a className="institutional-brand" href="../../index.html">
          <img alt="Plena Informática" src={plenaLogo} />
        </a>
        <nav aria-label="Navegação principal">
          <a href="../../index.html">Início</a>
          <a href={`${servicesPage}#ferramentas`}>Ferramentas</a>
          <a href={`${servicesPage}#como-funciona`}>Como funciona</a>
          <a href={`${servicesPage}#atendimento`}>Atendimento</a>
        </nav>
        <a
          className="institutional-contact"
          href="https://api.whatsapp.com/send?phone=5512981488505"
          rel="noreferrer"
          target="_blank"
        >
          Fale conosco
        </a>
      </header>

      {children}

      <footer className="institutional-footer">
        <div>
          <strong>
            PLENA <span>SERVIÇOS</span>
          </strong>
          <p>
            Agilidade, segurança e excelência em São José dos Campos.
          </p>
        </div>
        <small>
          &copy; 2026 Plena Informática. Todos os direitos reservados.
        </small>
      </footer>
    </div>
  )
}
