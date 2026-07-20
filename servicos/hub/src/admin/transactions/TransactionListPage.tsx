import { useEffect, useState } from 'react'

import './transactions.css'
import { NewTransactionForm } from './NewTransactionForm'
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS, SERVICE_CATEGORIES } from './transaction-schema'
import type { Transaction } from './transaction-schema'
import { getTransactions, addTransaction, deleteTransaction, type TransactionRecord } from './transaction-service'

export function TransactionListPage() {
  const [showForm, setShowForm] = useState(false)
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filters
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterPayment, setFilterPayment] = useState('')

  async function loadTransactions() {
    setIsLoading(true)
    try {
      const data = await getTransactions()
      setTransactions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar atendimentos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTransactions()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  async function handleAddTransaction(data: Transaction) {
    setIsSubmitting(true)
    try {
      const record = await addTransaction(data)
      setTransactions((prev) => [record, ...prev])
      setShowForm(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir este atendimento?')) return
    try {
      await deleteTransaction(id)
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir')
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filterFrom && t.serviceDate < filterFrom) return false
    if (filterTo && t.serviceDate > filterTo) return false
    if (filterCategory && t.category !== filterCategory) return false
    if (filterPayment && t.paymentMethod !== filterPayment) return false
    return true
  })

  return (
    <div className="tl-root">
      <div className="tl-toolbar">
        <button
          type="button"
          className="adm-btn adm-btn--primary"
          onClick={() => setShowForm(true)}
        >
          + Novo atendimento
        </button>

        <div className="tl-filters">
          <label className="tl-filter-label">
            De:
            <input
              type="date"
              className="tl-filter-input"
              aria-label="Filtrar de"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
            />
          </label>
          <label className="tl-filter-label">
            Até:
            <input
              type="date"
              className="tl-filter-input"
              aria-label="Filtrar até"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
            />
          </label>
          <select
            className="tl-filter-input"
            aria-label="Filtrar por categoria"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Categoria</option>
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            className="tl-filter-input"
            aria-label="Filtrar por pagamento"
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
          >
            <option value="">Pagamento</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {PAYMENT_METHOD_LABELS[m]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <NewTransactionForm
          onCancel={() => setShowForm(false)}
          onSubmit={handleAddTransaction}
          isSubmitting={isSubmitting}
        />
      )}

      {error && (
        <div className="adm-alert adm-alert--error" role="alert">
          {error}
        </div>
      )}

      <div
        className="adm-card tl-table-container"
        aria-live="polite"
        aria-label="Lista de atendimentos"
      >
        {isLoading ? (
          <div className="adm-empty">Carregando atendimentos...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="adm-empty">
            <p>Nenhum atendimento encontrado.</p>
            {!transactions.length && <p>Use o botão &ldquo;Novo atendimento&rdquo; para começar.</p>}
          </div>
        ) : (
          <table className="tl-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Serviço</th>
                <th>Categoria</th>
                <th>Pagamento</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id}>
                  <td>{new Date(t.serviceDate + 'T12:00:00').toLocaleDateString('pt-BR')}</td>
                  <td>
                    <strong>{t.serviceName}</strong>
                    {t.notes && <div className="tl-notes">{t.notes}</div>}
                  </td>
                  <td>{t.category}</td>
                  <td>{PAYMENT_METHOD_LABELS[t.paymentMethod]}</td>
                  <td>R$ {t.amount}</td>
                  <td>
                    <button
                      type="button"
                      className="tl-btn-delete"
                      onClick={() => handleDelete(t.id)}
                      aria-label="Excluir atendimento"
                    >
                      Excluir
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
