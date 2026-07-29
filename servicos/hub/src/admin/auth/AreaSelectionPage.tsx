import '../admin.css'
import './area-selection-page.css'
import { LoginPanel } from './LoginPage'

function getInstitutionalHomeHref(location = window.location) {
  if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
    return 'http://127.0.0.1:8080/index.html'
  }

  return '../../../index.html'
}

const portals = [
  {
    tag: 'Atendimento presencial',
    title: 'Plena Gestão Escritório',
    description: 'Caixa, clientes, serviços, fechamento e rotina da recepção.',
    area: 'escritorio' as const,
  },
  {
    tag: 'Operação digital',
    title: 'Plena Gestão Digital',
    description: 'Propostas comerciais e próximos módulos de tecnologia.',
    area: 'digital' as const,
  },
]

export function AreaSelectionPage() {
  const institutionalHomeHref = getInstitutionalHomeHref()

  return (
    <main className="area-choice">
      <a className="area-choice__home-link" href={institutionalHomeHref}>
        Voltar para a página inicial
      </a>

      <section className="area-choice__header">
        <strong>PLENA</strong>
        <span>Acessos administrativos</span>
      </section>

      <div className="area-choice__grid">
        {portals.map((portal) => (
          <section className={`area-choice__login area-choice__login--${portal.area}`} key={portal.area}>
            <div className="area-choice__login-intro">
              <span className="area-choice__tag">{portal.tag}</span>
              <h2>{portal.title}</h2>
              <p>{portal.description}</p>
            </div>
            <LoginPanel area={portal.area} showPortalLink={false} />
          </section>
        ))}
      </div>
    </main>
  )
}
