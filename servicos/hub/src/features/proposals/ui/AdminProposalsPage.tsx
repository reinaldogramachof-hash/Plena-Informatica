import { useEffect, useState } from 'react'

import {
  formatProposalAmount,
  linesToItems,
  PROPOSAL_STATUS_LABELS,
  proposalFormSchema,
  type ProposalRecord,
} from '../domain/proposal-schema'
import {
  createProposal,
  listAdminProposals,
  sendProposal,
} from '../services/proposal-service'
import './proposals.css'

export function AdminProposalsPage() {
  const [proposals, setProposals] = useState<ProposalRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')

  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [title, setTitle] = useState('')
  const [scopeIncluded, setScopeIncluded] = useState('')
  const [scopeExcluded, setScopeExcluded] = useState('')
  const [techStack, setTechStack] = useState('')
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [estimatedTimeline, setEstimatedTimeline] = useState('')
  const [validUntil, setValidUntil] = useState('')

  async function loadProposals() {
    setIsLoading(true)
    setError('')
    try {
      setProposals(await listAdminProposals())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar propostas.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProposals()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  function resetForm() {
    setClientName('')
    setClientEmail('')
    setTitle('')
    setScopeIncluded('')
    setScopeExcluded('')
    setTechStack('')
    setInvestmentAmount('')
    setEstimatedTimeline('')
    setValidUntil('')
    setFormError('')
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFormError('')

    const parsed = proposalFormSchema.safeParse({
      clientName,
      clientEmail,
      title,
      scopeIncluded: linesToItems(scopeIncluded),
      scopeExcluded: linesToItems(scopeExcluded),
      techStack: linesToItems(techStack),
      investmentAmount,
      estimatedTimeline: estimatedTimeline || undefined,
      validUntil,
    })

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Revise os campos.')
      return
    }

    setIsSubmitting(true)
    try {
      const proposal = await createProposal(parsed.data)
      setProposals((current) => [proposal, ...current])
      resetForm()
      setShowForm(false)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Falha ao criar proposta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSend(proposal: ProposalRecord) {
    setError('')
    try {
      const updated = await sendProposal(proposal.id)
      setProposals((current) =>
        current.map((item) => item.id === updated.id ? updated : item),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao enviar proposta.')
    }
  }

  return (
    <div className="proposal-admin">
      <div className="proposal-toolbar">
        <button
          type="button"
          className="adm-btn adm-btn--primary"
          onClick={() => setShowForm((value) => !value)}
        >
          {showForm ? 'Fechar formulario' : '+ Nova proposta'}
        </button>
      </div>

      {showForm && (
        <form className="adm-card proposal-form" onSubmit={handleSubmit} aria-label="Criar proposta">
          <h2>Nova proposta</h2>
          <div className="proposal-form__grid">
            <label className="adm-field">
              <span className="adm-label">Cliente</span>
              <input className="adm-input" value={clientName} onChange={(event) => setClientName(event.target.value)} />
            </label>
            <label className="adm-field">
              <span className="adm-label">E-mail do cliente</span>
              <input className="adm-input" type="email" value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} />
            </label>
            <label className="adm-field proposal-form__full">
              <span className="adm-label">Titulo</span>
              <input className="adm-input" value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
            <label className="adm-field">
              <span className="adm-label">Escopo incluso, um item por linha</span>
              <textarea className="adm-textarea" rows={5} value={scopeIncluded} onChange={(event) => setScopeIncluded(event.target.value)} />
            </label>
            <label className="adm-field">
              <span className="adm-label">Fora do escopo</span>
              <textarea className="adm-textarea" rows={5} value={scopeExcluded} onChange={(event) => setScopeExcluded(event.target.value)} />
            </label>
            <label className="adm-field">
              <span className="adm-label">Tecnologias</span>
              <textarea className="adm-textarea" rows={3} value={techStack} onChange={(event) => setTechStack(event.target.value)} />
            </label>
            <label className="adm-field">
              <span className="adm-label">Investimento</span>
              <input className="adm-input" inputMode="decimal" placeholder="0,00" value={investmentAmount} onChange={(event) => setInvestmentAmount(event.target.value)} />
            </label>
            <label className="adm-field">
              <span className="adm-label">Prazo estimado</span>
              <input className="adm-input" value={estimatedTimeline} onChange={(event) => setEstimatedTimeline(event.target.value)} />
            </label>
            <label className="adm-field">
              <span className="adm-label">Validade</span>
              <input className="adm-input" type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} />
            </label>
          </div>

          {formError && <p className="adm-alert adm-alert--error" role="alert">{formError}</p>}

          <div className="proposal-actions">
            <button type="button" className="adm-btn adm-btn--secondary" onClick={() => { resetForm(); setShowForm(false) }}>
              Cancelar
            </button>
            <button type="submit" className="adm-btn adm-btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar rascunho'}
            </button>
          </div>
        </form>
      )}

      {error && <div className="adm-alert adm-alert--error" role="alert">{error}</div>}

      <div className="adm-card proposal-table-wrap" aria-live="polite">
        {isLoading ? (
          <div className="adm-empty">Carregando propostas...</div>
        ) : proposals.length === 0 ? (
          <div className="adm-empty">Nenhuma proposta cadastrada.</div>
        ) : (
          <table className="adm-table proposal-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Proposta</th>
                <th>Status</th>
                <th>Investimento</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => (
                <tr key={proposal.id}>
                  <td>
                    <strong>{proposal.clientName}</strong>
                    <span>{proposal.clientEmail}</span>
                  </td>
                  <td>
                    <strong>{proposal.title}</strong>
                    {proposal.estimatedTimeline && <span>{proposal.estimatedTimeline}</span>}
                  </td>
                  <td>
                    <span className={`proposal-status proposal-status--${proposal.status}`}>
                      {PROPOSAL_STATUS_LABELS[proposal.status]}
                    </span>
                  </td>
                  <td>{formatProposalAmount(proposal.investmentAmount, proposal.currency)}</td>
                  <td>
                    <button
                      type="button"
                      className="adm-btn adm-btn--secondary"
                      disabled={proposal.status !== 'draft'}
                      onClick={() => void handleSend(proposal)}
                    >
                      Enviar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
