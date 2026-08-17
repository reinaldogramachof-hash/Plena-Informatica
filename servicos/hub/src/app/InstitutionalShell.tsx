import type { ReactNode } from 'react'

import plenaLogo from '../../../logo-plena.png'

const servicesPage = '../../servicos.html'

type InstitutionalShellProps = {
  children: ReactNode
}

export function InstitutionalShell({ children }: InstitutionalShellProps) {
  return (
    <div className="institutional-page">
      <header aria-label="NavegaÃ§Ã£o Plena" className="institutional-header">
        <a className="institutional-brand" href="../../index.html">
          <img alt="Plena InformÃ¡tica" src={plenaLogo} />
        </a>
        <nav aria-label="NavegaÃ§Ã£o principal">
          <a href="../../index.html">InÃ­cio</a>
          <a href={`${servicesPage}#ferramentas`}>Ferramentas</a>
          <a href={`${servicesPage}#como-funciona`}>Como funciona</a>
          <a href={`${servicesPage}#atendimento`}>Atendimento</a>
        </nav>
        <a
          className="institutional-contact"
          href="https://api.whatsapp.com/send?phone=5512992191018"
          rel="noopener noreferrer"
          target="_blank"
        >
          Fale conosco
        </a>
      </header>

      {children}

      <footer className="institutional-footer">
        <div>
          <strong>
            PLENA <span>SERVIÃ‡OS</span>
          </strong>
          <p>
            Agilidade, seguranÃ§a e excelÃªncia em SÃ£o JosÃ© dos Campos.
          </p>
        </div>
        <small>
          &copy; 2026 Plena InformÃ¡tica. Todos os direitos reservados.
        </small>
      </footer>
    </div>
  )
}
