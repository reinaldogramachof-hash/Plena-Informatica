import { useState } from 'react'

import './reports.css'
import '../admin.css'
import { SERVICE_CATEGORIES } from '../transactions/transaction-schema'
import { getTransactions, type TransactionRecord } from '../transactions/transaction-service'

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)

export function ReportPage() {
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState(String(currentYear))
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const hasPeriodSelected = selectedMonth !== ''

  async function handleGenerate() {
    if (!hasPeriodSelected) return
    setIsLoading(true)
    setError('')
    setHasGenerated(true)
    try {
      const data = await getTransactions()
      // Filtrar pelos dados
      const filtered = data.filter((t) => {
        const d = new Date(t.serviceDate + 'T12:00:00')
        return d.getMonth() === Number(selectedMonth) - 1 && d.getFullYear() === Number(selectedYear)
      })
      setTransactions(filtered)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar relatório')
    } finally {
      setIsLoading(false)
    }
  }

  const { totalCount, totalAmount, categoryStats } = transactions.reduce(
    (acc, t) => {
      acc.totalCount++
      const amt = t.amount || 0
      acc.totalAmount += amt
      if (!acc.categoryStats[t.category]) {
        acc.categoryStats[t.category] = { count: 0, total: 0 }
      }
      acc.categoryStats[t.category].count++
      acc.categoryStats[t.category].total += amt
      return acc
    },
    {
      totalCount: 0,
      totalAmount: 0,
      categoryStats: {} as Record<string, { count: number; total: number }>
    }
  )

  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const average = totalCount > 0 ? totalAmount / totalCount : 0

  function handleExportCsv() {
    const monthName = MONTHS[Number(selectedMonth) - 1] ?? 'mes'
    const filename = `plena-relatorio-${monthName.toLowerCase()}-${selectedYear}.csv`

    let csvContent = 'Categoria,Qtd.,Total\n'
    for (const cat of SERVICE_CATEGORIES) {
      if (categoryStats[cat]) {
        csvContent += `${cat},${categoryStats[cat].count},${formatCurrency(categoryStats[cat].total).replace(',', '.')}\n`
      }
    }
    csvContent += `Total,${totalCount},${formatCurrency(totalAmount).replace(',', '.')}\n`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rpt-root">
      <h2 className="rpt-heading">Relatórios</h2>

      {/* Seletor de período */}
      <div className="adm-card rpt-period-card">
        <div className="rpt-period-row">
          <label className="adm-label rpt-label-inline">
            Período:
          </label>
          <select
            className="adm-select rpt-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            aria-label="Mês"
          >
            <option value="">Mês/Ano</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={String(i + 1)}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="adm-select rpt-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            aria-label="Ano"
          >
            {YEARS.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="adm-btn adm-btn--primary"
            onClick={handleGenerate}
            disabled={isLoading || !hasPeriodSelected}
          >
            {isLoading ? 'Gerando...' : 'Gerar relatório'}
          </button>
        </div>
      </div>

      {error && (
        <div className="adm-alert adm-alert--error" role="alert">
          {error}
        </div>
      )}

      {/* Resumo */}
      <div className="adm-card">
        <h3 className="rpt-section-title">Resumo</h3>
        <dl className="rpt-summary">
          <div className="rpt-summary-row">
            <dt>Total de atendimentos</dt>
            <dd>{hasGenerated ? totalCount : '—'}</dd>
          </div>
          <div className="rpt-summary-row">
            <dt>Total faturado</dt>
            <dd>R$&nbsp;{hasGenerated ? formatCurrency(totalAmount) : '—'}</dd>
          </div>
          <div className="rpt-summary-row">
            <dt>Média por atendimento</dt>
            <dd>R$&nbsp;{hasGenerated ? formatCurrency(average) : '—'}</dd>
          </div>
        </dl>
      </div>

      {/* Por categoria */}
      <div className="adm-card">
        <h3 className="rpt-section-title">Por categoria</h3>
        <table className="adm-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Qtd.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {!hasGenerated ? (
              <tr>
                <td colSpan={3} className="rpt-empty-row">
                  {hasPeriodSelected
                    ? 'Clique em "Gerar relatório" para ver os dados.'
                    : 'Aguardando seleção de período.'}
                </td>
              </tr>
            ) : totalCount === 0 ? (
              <tr>
                <td colSpan={3} className="rpt-empty-row">
                  Sem dados para o período selecionado.
                </td>
              </tr>
            ) : (
              SERVICE_CATEGORIES.map((cat) => {
                const stat = categoryStats[cat]
                if (!stat) return null
                return (
                  <tr key={cat}>
                    <td>{cat}</td>
                    <td>{stat.count}</td>
                    <td>R$&nbsp;{formatCurrency(stat.total)}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Exportar */}
      <div className="rpt-actions">
        <button
          type="button"
          className="adm-btn adm-btn--secondary"
          disabled={!hasGenerated || totalCount === 0}
          onClick={handleExportCsv}
        >
          Exportar CSV
        </button>
      </div>

      {/* Nota de privacidade */}
      <p className="rpt-privacy-note">
        Relatórios gerados localmente, sem envio de dados.
      </p>
    </div>
  )
}
