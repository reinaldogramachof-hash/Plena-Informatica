import { useEffect, useState, useMemo } from 'react'
import './dashboard.css'
import { Link } from 'react-router-dom'

import { SERVICE_CATEGORIES } from '../transactions/transaction-schema'
import { getTransactions, type TransactionRecord } from '../transactions/transaction-service'

export function DashboardPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getTransactions()
      .then((data) => setTransactions(data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const { todayTotal, todayCount, monthTotal, monthCount, yearTotal, yearCount, categoryStats } = useMemo(() => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const todayStr = today.toISOString().split('T')[0]!

    let todayTotal = 0, todayCount = 0
    let monthTotal = 0, monthCount = 0
    let yearTotal = 0, yearCount = 0

    const catStats = Object.fromEntries(
      SERVICE_CATEGORIES.map(cat => [cat, { count: 0, total: 0 }])
    )

    transactions.forEach(t => {
      const amount = t.amount || 0
      const dateObj = new Date(t.serviceDate + 'T12:00:00')

      if (t.serviceDate === todayStr) {
        todayCount++
        todayTotal += amount
      }
      if (dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear) {
        monthCount++
        monthTotal += amount

        if (catStats[t.category]) {
          catStats[t.category].count++
          catStats[t.category].total += amount
        }
      }
      if (dateObj.getFullYear() === currentYear) {
        yearCount++
        yearTotal += amount
      }
    })

    return { todayTotal, todayCount, monthTotal, monthCount, yearTotal, yearCount, categoryStats: catStats }
  }, [transactions])

  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  if (isLoading) {
    return <div className="dash-root" aria-live="polite">Carregando painel...</div>
  }

  return (
    <div className="dash-root">
      {/* KPIs */}
      <div className="adm-kpi-grid">
        <div className="adm-card">
          <p className="adm-kpi-label">Hoje</p>
          <p className="adm-kpi-value">R$&nbsp;{formatCurrency(todayTotal)}</p>
          <p className="dash-kpi-sub">{todayCount} atendimentos</p>
        </div>
        <div className="adm-card">
          <p className="adm-kpi-label">Este mês</p>
          <p className="adm-kpi-value">R$&nbsp;{formatCurrency(monthTotal)}</p>
          <p className="dash-kpi-sub">{monthCount} atendimentos</p>
        </div>
        <div className="adm-card">
          <p className="adm-kpi-label">Este ano</p>
          <p className="adm-kpi-value">R$&nbsp;{formatCurrency(yearTotal)}</p>
          <p className="dash-kpi-sub">{yearCount} atendimentos</p>
        </div>
      </div>

      {/* Por categoria */}
      <div className="adm-card dash-table-card">
        <h2 className="dash-section-title">Por categoria (este mês)</h2>
        <table className="adm-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Qtd.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {SERVICE_CATEGORIES.map((cat) => {
              const stat = categoryStats[cat] || { count: 0, total: 0 }
              return (
                <tr key={cat}>
                  <td>{cat}</td>
                  <td>{stat.count || '-'}</td>
                  <td>R$&nbsp;{stat.total ? formatCurrency(stat.total) : '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Ações */}
      <div className="dash-actions">
        <Link to="/admin/atendimentos" className="adm-btn adm-btn--primary">
          + Registrar atendimento
        </Link>
        <Link to="/admin/atendimentos" className="adm-btn adm-btn--secondary">
          Ver todos os atendimentos
        </Link>
      </div>
    </div>
  )
}
