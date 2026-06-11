import { useState } from 'react'

import './transactions.css'
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  SERVICE_CATEGORIES,
  transactionSchema,
} from './transaction-schema'
import type { Transaction } from './transaction-schema'

interface NewTransactionFormProps {
  onSubmit?: (data: Transaction) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}

function todayIso() {
  return new Date().toISOString().split('T')[0]!
}

export function NewTransactionForm({
  onSubmit = async () => {},
  onCancel,
  isSubmitting = false,
}: NewTransactionFormProps) {
  const [serviceDate, setServiceDate] = useState(todayIso)
  const [category, setCategory] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const result = transactionSchema.safeParse({
      serviceDate,
      category,
      serviceName,
      amount,
      paymentMethod,
      notes: notes || undefined,
    })

    if (!result.success) {
      const firstError = result.error.issues[0]
      setError(firstError?.message ?? 'Verifique os campos e tente novamente.')
      return
    }

    await onSubmit(result.data)
  }

  return (
    <form
      className="ntf-form adm-card"
      onSubmit={handleSubmit}
      aria-label="Registrar atendimento"
    >
      <h2 className="ntf-title">Registrar atendimento</h2>

      <div className="ntf-grid">
        {/* Data */}
        <div className="adm-field">
          <label className="adm-label" htmlFor="ntf-date">
            Data do atendimento <span aria-hidden="true">*</span>
          </label>
          <input
            id="ntf-date"
            className="adm-input"
            type="date"
            value={serviceDate}
            onChange={(e) => setServiceDate(e.target.value)}
            aria-required="true"
          />
        </div>

        {/* Categoria */}
        <div className="adm-field">
          <label className="adm-label" htmlFor="ntf-category">
            Categoria <span aria-hidden="true">*</span>
          </label>
          <select
            id="ntf-category"
            className="adm-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-required="true"
          >
            <option value="">Selecione...</option>
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Serviço */}
        <div className="adm-field ntf-full">
          <label className="adm-label" htmlFor="ntf-service">
            Serviço realizado <span aria-hidden="true">*</span>
          </label>
          <input
            id="ntf-service"
            className="adm-input"
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            maxLength={120}
            aria-required="true"
          />
        </div>

        {/* Valor */}
        <div className="adm-field">
          <label className="adm-label" htmlFor="ntf-amount">
            Valor cobrado (R$) <span aria-hidden="true">*</span>
          </label>
          <input
            id="ntf-amount"
            className="adm-input"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-required="true"
          />
        </div>

        {/* Forma de pagamento */}
        <div className="adm-field ntf-full">
          <fieldset className="ntf-payment-fieldset">
            <legend className="adm-label">
              Forma de pagamento <span aria-hidden="true">*</span>
            </legend>
            <div className="ntf-payment-grid">
              {PAYMENT_METHODS.map((method) => (
                <label key={method} className="ntf-radio-label">
                  <input
                    type="radio"
                    name="ntf-payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    aria-label={PAYMENT_METHOD_LABELS[method]}
                  />
                  {PAYMENT_METHOD_LABELS[method]}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Observações */}
        <div className="adm-field ntf-full">
          <label className="adm-label" htmlFor="ntf-notes">
            Observações
          </label>
          <textarea
            id="ntf-notes"
            className="adm-textarea"
            rows={3}
            maxLength={500}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="adm-alert adm-alert--error" role="alert">
          {error}
        </p>
      )}

      <div className="ntf-actions">
        <button
          type="button"
          className="adm-btn adm-btn--secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="adm-btn adm-btn--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Registrar atendimento'}
        </button>
      </div>
    </form>
  )
}
