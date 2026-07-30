import React, { useMemo } from 'react'
import { X, MessageCircle, Calculator, Briefcase } from 'lucide-react'
import type { OfficeTransaction, OfficeServiceRecord, OfficeServiceItem } from '../../services/office-service'
import { formatCurrency, getTodayLocal, toNumber } from '../utils'

interface DailyClosingModalProps {
  transactions: OfficeTransaction[]
  services: OfficeServiceRecord[]
  serviceItems: OfficeServiceItem[]
  onClose: () => void
}

interface DailyStats {
  income: number
  expense: number
  balance: number
  byMethod: Record<string, number>
  count: number
}

export const DailyClosingModal: React.FC<DailyClosingModalProps> = ({
  transactions,
  services,
  serviceItems,
  onClose,
}) => {
  const todayStr = useMemo(() => getTodayLocal(), [])

  const todayStats: DailyStats = useMemo(() => {
    const todaysTransactions = transactions.filter(
      (t) => (t.transaction_date || '') === todayStr
    )

    const income = todaysTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + toNumber(t.amount), 0)

    const expense = todaysTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + toNumber(t.amount), 0)

    const byMethod: Record<string, number> = {}
    todaysTransactions.forEach((t) => {
      const amount = t.type === 'income' ? toNumber(t.amount) : -toNumber(t.amount)
      const method = t.payment_method || 'other'
      byMethod[method] = (byMethod[method] || 0) + amount
    })

    return {
      income,
      expense,
      balance: income - expense,
      byMethod,
      count: todaysTransactions.length,
    }
  }, [transactions, todayStr])

  const todayServices = useMemo(() => {
    const qtyMap: Record<string, number> = {}
    ;(services || [])
      .filter((s) => s.record_date === todayStr)
      .forEach((s) => {
        if (s.service_item_id) {
          qtyMap[s.service_item_id] = (qtyMap[s.service_item_id] || 0) + toNumber(s.quantity)
        }
      })

    return Object.entries(qtyMap)
      .map(([id, qty]) => {
        const item = (serviceItems || []).find((c) => c.id === id)
        return { name: item?.name || 'Serviço Excluído', quantity: qty }
      })
      .filter((r) => r.quantity > 0)
      .sort((a, b) => b.quantity - a.quantity)
  }, [services, serviceItems, todayStr])

  const handleWhatsApp = () => {
    const dateStr = new Date().toLocaleDateString('pt-BR')

    let message = `*📊 FECHAMENTO DE CAIXA - Plena Informática*\n`
    message += `📅 Data: ${dateStr}\n\n`

    message += `🟢 *Entradas:* ${formatCurrency(todayStats.income)}\n`
    message += `🔴 *Saídas:* ${formatCurrency(todayStats.expense)}\n`
    message += `💰 *SALDO:* ${formatCurrency(todayStats.balance)}\n\n`

    message += `*📝 Detalhamento por Método:*\n`

    Object.entries(todayStats.byMethod).forEach(([method, amount]) => {
      let label = method
      if (method === 'cash') label = 'Dinheiro'
      else if (method === 'card') label = 'Cartão'
      else if (method === 'pix') label = 'Pix'
      else if (method === 'transfer') label = 'Transferência'
      else if (method === 'other') label = 'Outro'

      message += `- ${label}: ${formatCurrency(amount)}\n`
    })

    if (todayServices.length > 0) {
      message += `\n*💼 Serviços Realizados:*\n`
      todayServices.forEach((s) => {
        message += `- ${s.name}: ${s.quantity}\n`
      })
    }

    message += `\n_Gerado em: ${new Date().toLocaleTimeString()}_`

    const phoneNumber = '5512981488505'
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center text-plena-orange">
            <Calculator className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Fechamento de Caixa</h2>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-gray-900">Plena Informática</h1>
            <p className="text-sm text-gray-500 mt-1">Relatório de Fechamento Diário</p>
            <p className="text-lg font-mono font-bold mt-2 border-b-2 border-dashed border-gray-200 inline-block pb-1 text-gray-800">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <p className="text-sm text-gray-600 mb-1">Total Entradas</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(todayStats.income)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <p className="text-sm text-gray-600 mb-1">Total Saídas</p>
              <p className="text-xl font-bold text-red-700">{formatCurrency(todayStats.expense)}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-1 uppercase font-bold">Saldo do Dia</p>
            <p className={`text-3xl font-mono font-bold ${todayStats.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              {formatCurrency(todayStats.balance)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase border-b border-gray-200 pb-2 mb-3">
              Detalhamento por Método
            </h3>
            <div className="space-y-2">
              {Object.entries(todayStats.byMethod).map(([method, amount]) => (
                <div key={method} className="flex justify-between items-center text-sm">
                  <span className="capitalize text-gray-700">
                    {method === 'cash' ? 'Dinheiro' : 
                     method === 'card' ? 'Cartão' : 
                     method === 'pix' ? 'Pix' :
                     method === 'transfer' ? 'Transferência' : 'Outro'}
                  </span>
                  <span className="font-mono font-medium text-gray-900">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {todayServices.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase border-b border-gray-200 pb-2 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Serviços Realizados
              </h3>
              <div className="space-y-2">
                {todayServices.map((s) => (
                  <div key={s.name} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{s.name}</span>
                    <span className="font-mono font-medium text-blue-700">{s.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-dashed border-gray-300 pt-4">
            <p className="text-xs text-center text-gray-400">
              Total de transações: {todayStats.count} | Gerado em: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Enviar WhatsApp
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-sm transition-colors cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  )
}
