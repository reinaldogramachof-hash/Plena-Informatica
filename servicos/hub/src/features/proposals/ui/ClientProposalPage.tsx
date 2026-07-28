import { useEffect, useState } from 'react'

import {
  formatProposalAmount,
  PROPOSAL_STATUS_LABELS,
  type ProposalRecord,
} from '../domain/proposal-schema'
import {
  acceptProposal,
  getClientUserId,
  listClientProposals,
  requestClientMagicLink,
} from '../services/proposal-service'
import './proposals.css'

export function ClientProposalPage() {
  const [email, setEmail] = useState('')
  const [hasSession, setHasSession] = useState(false)
  const [proposals, setProposals] = useState<ProposalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadClientArea() {
    setIsLoading(true)
    setError('')
    try {
      const userId = await getClientUserId()
      setHasSession(Boolean(userId))
      if (userId) {
        setProposals(await listClientProposals())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel carregar propostas.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadClientArea()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  async function handleMagicLink(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)
    try {
      await requestClientMagicLink(email)
      setMessage('Enviamos um link de acesso para o e-mail informado.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao enviar link de acesso.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleAccept(proposal: ProposalRecord) {
    setError('')
    setMessage('')
    setIsSubmitting(true)
    try {
      const updated = await acceptProposal(proposal, navigator.userAgent)
      setProposals((current) =>
        current.map((item) => item.id === updated.id ? updated : item),
      )
      setMessage('Aceite registrado com sucesso.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao registrar aceite.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="proposal-client">
      <section className="proposal-client__hero">
        <strong>PLENA</strong>
        <span>Propostas comerciais</span>
        <h1>Acesse sua proposta com seguranca.</h1>
      </section>

      {message && <p className="proposal-notice" role="status">{message}</p>}
      {error && <p className="proposal-error" role="alert">{error}</p>}

      {isLoading ? (
        <div className="proposal-panel">Verificando acesso...</div>
      ) : !hasSession ? (
        <form className="proposal-panel proposal-login" onSubmit={handleMagicLink}>
          <h2>Entrar com magic link</h2>
          <p>Informe o mesmo e-mail usado na proposta. O acesso nao usa senha.</p>
          <label>
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar link de acesso'}
          </button>
        </form>
      ) : proposals.length === 0 ? (
        <div className="proposal-panel">Nenhuma proposta disponivel para este acesso.</div>
      ) : (
        <section className="proposal-list" aria-label="Suas propostas">
          {proposals.map((proposal) => (
            <article className="proposal-panel proposal-card" key={proposal.id}>
              <div className="proposal-card__header">
                <div>
                  <span className="proposal-eyebrow">Versao {proposal.version}</span>
                  <h2>{proposal.title}</h2>
                </div>
                <span className={`proposal-status proposal-status--${proposal.status}`}>
                  {PROPOSAL_STATUS_LABELS[proposal.status]}
                </span>
              </div>

              <dl className="proposal-summary">
                <div>
                  <dt>Cliente</dt>
                  <dd>{proposal.clientName}</dd>
                </div>
                <div>
                  <dt>Investimento</dt>
                  <dd>{formatProposalAmount(proposal.investmentAmount, proposal.currency)}</dd>
                </div>
                {proposal.estimatedTimeline && (
                  <div>
                    <dt>Prazo estimado</dt>
                    <dd>{proposal.estimatedTimeline}</dd>
                  </div>
                )}
                {proposal.validUntil && (
                  <div>
                    <dt>Validade</dt>
                    <dd>{new Date(`${proposal.validUntil}T12:00:00`).toLocaleDateString('pt-BR')}</dd>
                  </div>
                )}
              </dl>

              <div className="proposal-columns">
                <section>
                  <h3>Incluso</h3>
                  <ul>
                    {proposal.scopeIncluded.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </section>
                {proposal.scopeExcluded.length > 0 && (
                  <section>
                    <h3>Fora do escopo</h3>
                    <ul>
                      {proposal.scopeExcluded.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </section>
                )}
              </div>

              <p className="proposal-disclaimer">
                Ao aceitar, voce confirma ciencia das condicoes desta proposta.
                Este aceite fica registrado de forma vinculada a sua conta.
              </p>

              <button
                type="button"
                className="proposal-accept"
                disabled={isSubmitting || proposal.status !== 'sent'}
                onClick={() => void handleAccept(proposal)}
              >
                {proposal.status === 'accepted' ? 'Proposta aceita' : 'Aceitar proposta'}
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
