import { useEffect, useMemo, useState, useRef } from 'react'
import {
  Briefcase, CheckCircle, Plus, Minus, Search, Settings2, Trash2, Edit2, X, Printer,
  FileText, User, Mail, Phone, MapPin, StickyNote, CheckSquare, Check, Folder, Calendar,
  Save, CalendarDays, Trophy, Hash, Share2, TrendingUp, TrendingDown, DollarSign, Upload
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import {
  PAYMENT_METHOD_LABELS,
  officeCategorySchema,
  officeClientSchema,
  officeTransactionSchema,
  type OfficeCategoryInput,
  type OfficeClientInput,
  type OfficeTransactionInput,
} from '../domain/office-schema'
import {
  createClientTask,
  createOfficeCategory,
  createOfficeClient,
  createOfficeServiceItem,
  createOfficeServiceRecord,
  createOfficeTransaction,
  deleteOfficeTransaction,
  importCashControlJson,
  listOfficeData,
  toggleClientTask,
  updateOfficeServiceItem,
  deleteOfficeServiceItem,
  updateOfficeServiceRecord,
  deleteOfficeServiceRecord,
  updateOfficeClient,
  deleteOfficeClient,
  deleteClientTask,
  updateClientTask,
  type OfficeData,
  type OfficeClient,
  type OfficeServiceItem,
  type ClientTask,
} from '../services/office-service'

import { Dashboard } from './components/Dashboard'
import { TransactionForm } from './components/TransactionForm'
import { DailyClosingModal } from './components/DailyClosingModal'
import { formatCurrency, getTodayLocal, toNumber } from './utils'

export type OfficeTab = 'dashboard' | 'transactions' | 'clients' | 'services' | 'closing' | 'settings' | 'import'

const emptyData: OfficeData = {
  clients: [],
  tasks: [],
  categories: [],
  transactions: [],
  serviceItems: [],
  serviceRecords: [],
  cashClosings: [],
}

function getFormData<T extends Record<string, unknown>>(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form).entries()) as T
}

export function OfficeAreaPage({ initialTab = 'dashboard' }: { initialTab?: OfficeTab }) {
  const activeTab = initialTab
  const [data, setData] = useState<OfficeData>(emptyData)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false)

  const [transactionSearch, setTransactionSearch] = useState('')
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'income' | 'expense'>('all')

  const filteredTransactions = useMemo(() => {
    return data.transactions.filter((t) => {
      const matchesSearch =
        !transactionSearch ||
        t.description.toLowerCase().includes(transactionSearch.toLowerCase()) ||
        (data.categories.find((c) => c.id === t.category_id)?.name || '')
          .toLowerCase()
          .includes(transactionSearch.toLowerCase())

      const matchesFilter =
        transactionFilter === 'all' || t.type === transactionFilter

      return matchesSearch && matchesFilter
    })
  }, [data.transactions, transactionSearch, transactionFilter, data.categories])

  // Services states
  const [selectedServiceDate, setSelectedServiceDate] = useState(getTodayLocal())
  const [serviceSearchTerm, setServiceSearchTerm] = useState('')
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false)
  const [isServiceReportModalOpen, setIsServiceReportModalOpen] = useState(false)

  // Service Catalog Item Form
  const [editingServiceItem, setEditingServiceItem] = useState<OfficeServiceItem | null>(null)
  const [serviceItemName, setServiceItemName] = useState('')
  const [serviceItemPrice, setServiceItemPrice] = useState('')

  // Service Report Range
  const [serviceReportStartDate, setServiceReportStartDate] = useState(getTodayLocal())
  const [serviceReportEndDate, setServiceReportEndDate] = useState(getTodayLocal())

  // Helper to format date as YYYY-MM-DD using local time
  const toLocalDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getStartOfMonth = () => {
    const d = new Date()
    d.setDate(1)
    return toLocalDateString(d)
  }
  const getTodayDate = () => toLocalDateString(new Date())

  // Closing / Report states
  const [closingStartDate, setClosingStartDate] = useState(getStartOfMonth())
  const [closingEndDate, setClosingEndDate] = useState(getTodayDate())
  const [isDetailedReportOpen, setIsDetailedReportOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Memoized stats & calculations
  const reportTransactions = useMemo(() => {
    return data.transactions.filter(
      (t) => (t.transaction_date || '') >= closingStartDate && (t.transaction_date || '') <= closingEndDate
    )
  }, [data.transactions, closingStartDate, closingEndDate])

  const closingStats = useMemo(() => {
    const income = reportTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + toNumber(t.amount), 0)
    const expense = reportTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + toNumber(t.amount), 0)
    const balance = income - expense
    return { income, expense, balance }
  }, [reportTransactions])

  const topService = useMemo(() => {
    const serviceMap: Record<string, number> = {}
    reportTransactions
      .filter((t) => t.type === 'income')
      .forEach((t) => {
        if (t.category_id) {
          serviceMap[t.category_id] = (serviceMap[t.category_id] || 0) + toNumber(t.amount)
        }
      })

    let topId = ''
    let maxAmount = 0
    Object.entries(serviceMap).forEach(([id, amount]) => {
      if (amount > maxAmount) {
        maxAmount = amount
        topId = id
      }
    })

    if (!topId) return null
    const category = data.categories.find((c) => c.id === topId)
    return {
      name: category?.name || 'Desconhecido',
      color: category?.color || '#f17a02',
      amount: maxAmount,
      percentage: closingStats.income > 0 ? (maxAmount / closingStats.income) * 100 : 0,
    }
  }, [reportTransactions, data.categories, closingStats.income])

  const serviceQuantities = useMemo(() => {
    const qtyMap: Record<string, number> = {}
    data.serviceRecords
      .filter((s) => (s.record_date || '') >= closingStartDate && (s.record_date || '') <= closingEndDate)
      .forEach((s) => {
        if (s.service_item_id) {
          qtyMap[s.service_item_id] = (qtyMap[s.service_item_id] || 0) + toNumber(s.quantity)
        }
      })

    return Object.entries(qtyMap)
      .map(([id, qty]) => {
        const item = data.serviceItems.find((c) => c.id === id)
        return {
          id,
          name: item?.name || 'Serviço Excluído',
          quantity: qty,
        }
      })
      .sort((a, b) => b.quantity - a.quantity)
      .filter((r) => r.quantity > 0)
  }, [data.serviceRecords, data.serviceItems, closingStartDate, closingEndDate])

  const chartData = useMemo(() => {
    const list = []
    const daysMap = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const s = new Date(closingStartDate + 'T12:00:00')
    const e = new Date(closingEndDate + 'T12:00:00')

    if (isNaN(s.getTime()) || isNaN(e.getTime()) || s > e) return []

    const current = new Date(s)
    let limit = 0
    while (current <= e && limit < 100) {
      const dateStr = toLocalDateString(current)
      const dayLabel = `${daysMap[current.getDay()]} ${current.getDate()}`
      const entry = {
        name: dayLabel,
        fullDate: dateStr,
        income: 0,
        expense: 0,
      }
      reportTransactions
        .filter((t) => t.transaction_date === dateStr)
        .forEach((t) => {
          if (t.type === 'income') entry.income += toNumber(t.amount)
          else entry.expense += toNumber(t.amount)
        })
      list.push(entry)
      current.setDate(current.getDate() + 1)
      limit++
    }
    return list
  }, [reportTransactions, closingStartDate, closingEndDate])

  const handleFileMerge = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    let totalAdded = 0
    try {
      for (const file of Array.from(files)) {
        const text = await file.text()
        const payload = JSON.parse(text)
        const result = await importCashControlJson(payload)
        totalAdded += (result.clients + result.serviceItems + result.transactions + result.serviceRecords)
      }
      showSuccess(`Consolidação concluída! ${totalAdded} novos registros salvos no banco.`)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao consolidar arquivos.')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleWhatsAppShare = () => {
    const sDate = new Date(closingStartDate + 'T12:00:00').toLocaleDateString('pt-BR')
    const eDate = new Date(closingEndDate + 'T12:00:00').toLocaleDateString('pt-BR')

    let message = `*📊 RELATÓRIO DE CAIXA - Plena Informática*\n`
    message += `📅 Período: ${sDate} a ${eDate}\n\n`
    message += `🟢 *Entradas:* ${formatCurrency(closingStats.income)}\n`
    message += `🔴 *Saídas:* ${formatCurrency(closingStats.expense)}\n`
    message += `💰 *SALDO:* ${formatCurrency(closingStats.balance)}\n\n`

    if (topService) {
      message += `🏆 *Destaque:* ${topService.name} (${formatCurrency(topService.amount)})\n`
    }

    if (chartData.length > 0) {
      const bestDay = chartData.reduce((prev, curr) => (curr.income > prev.income ? curr : prev), chartData[0])
      if (bestDay && bestDay.income > 0) {
        message += `📅 *Melhor Dia:* ${bestDay.name} (${formatCurrency(bestDay.income)})\n`
      }
    }

    if (serviceQuantities.length > 0) {
      message += `\n*💼 Serviços Realizados:*\n`
      serviceQuantities.forEach((s) => {
        message += `- ${s.name}: ${s.quantity}\n`
      })
    }

    message += `\n_Gerado pelo Sistema Web Plena_`
    const phoneNumber = '5512981488505'
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank')
  }

  const getQuantityForToday = (itemId: string) => {
    const record = data.serviceRecords.find(
      (s) => s.service_item_id === itemId && s.record_date === selectedServiceDate
    )
    return record ? toNumber(record.quantity) : 0
  }

  const handleIncrement = async (item: OfficeServiceItem) => {
    const existing = data.serviceRecords.find(
      (s) => s.service_item_id === item.id && s.record_date === selectedServiceDate
    )
    try {
      if (existing) {
        await updateOfficeServiceRecord(existing.id, toNumber(existing.quantity) + 1)
      } else {
        await createOfficeServiceRecord({
          serviceItemId: item.id,
          name: item.name,
          quantity: 1,
          recordDate: selectedServiceDate,
        })
      }
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao incrementar serviço.')
    }
  }

  const handleDecrement = async (item: OfficeServiceItem) => {
    const existing = data.serviceRecords.find(
      (s) => s.service_item_id === item.id && s.record_date === selectedServiceDate
    )
    if (!existing) return
    try {
      const newQty = toNumber(existing.quantity) - 1
      if (newQty <= 0) {
        await deleteOfficeServiceRecord(existing.id)
      } else {
        await updateOfficeServiceRecord(existing.id, newQty)
      }
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao decrementar serviço.')
    }
  }

  const handleCatalogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingServiceItem) {
        await updateOfficeServiceItem(editingServiceItem.id, serviceItemName, parseFloat(serviceItemPrice) || 0)
        showSuccess('Serviço atualizado no catálogo.')
      } else {
        await createOfficeServiceItem({
          name: serviceItemName,
          defaultPrice: parseFloat(serviceItemPrice) || 0,
        })
        showSuccess('Serviço adicionado ao catálogo.')
      }
      setServiceItemName('')
      setServiceItemPrice('')
      setEditingServiceItem(null)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar item no catálogo.')
    }
  }

  const handleDeleteCatalogItem = async (id: string) => {
    try {
      await deleteOfficeServiceItem(id)
      showSuccess('Serviço removido do catálogo.')
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao remover item do catálogo.')
    }
  }

  const filteredServiceItems = useMemo(() => {
    if (!serviceSearchTerm) return data.serviceItems
    return data.serviceItems.filter((i) =>
      i.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    )
  }, [data.serviceItems, serviceSearchTerm])

  // Clients states
  const [clientSearchTerm, setClientSearchTerm] = useState('')
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<OfficeClient | null>(null)
  const [selectedClient, setSelectedClient] = useState<OfficeClient | null>(null)

  // Client Checklist states
  const [newClientTaskText, setNewClientTaskText] = useState('')
  const [newClientTaskDate, setNewClientTaskDate] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskText, setEditingTaskText] = useState('')
  const [editingTaskDate, setEditingTaskDate] = useState('')

  const filteredClients = useMemo(() => {
    return data.clients.filter(c =>
      c.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
      (c.document || '').includes(clientSearchTerm) ||
      (c.email || '').toLowerCase().includes(clientSearchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name))
  }, [data.clients, clientSearchTerm])

  const handleDeleteClient = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return
    try {
      await deleteOfficeClient(id)
      showSuccess('Cliente excluído com sucesso.')
      if (selectedClient?.id === id) setSelectedClient(null)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao excluir cliente.')
    }
  }

  const handleClientFormSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = getFormData<OfficeClientInput>(form)

    const parsed = officeClientSchema.safeParse(formData)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos.')
      return
    }

    try {
      if (editingClient) {
        const updated = await updateOfficeClient(editingClient.id, parsed.data)
        showSuccess('Cliente atualizado com sucesso.')
        if (selectedClient?.id === editingClient.id) {
          setSelectedClient(updated)
        }
      } else {
        await createOfficeClient(parsed.data)
        showSuccess('Cliente salvo com sucesso.')
      }
      setIsClientModalOpen(false)
      setEditingClient(null)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar cliente.')
    }
  }

  const handleClientTaskAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientTaskText.trim() || !selectedClient) return
    try {
      await createClientTask(selectedClient.id, newClientTaskText)
      setNewClientTaskText('')
      setNewClientTaskDate('')
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar tarefa.')
    }
  }

  const handleClientTaskToggle = async (task: ClientTask) => {
    try {
      await toggleClientTask(task.id, !task.completed)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar tarefa.')
    }
  }

  const handleClientTaskDelete = async (taskId: string) => {
    if (!window.confirm('Excluir esta tarefa permanentemente?')) return
    try {
      await deleteClientTask(taskId)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao excluir tarefa.')
    }
  }

  const handleClientTaskSave = async () => {
    if (!selectedClient || !editingTaskId || !editingTaskText.trim()) return
    try {
      await updateClientTask(editingTaskId, editingTaskText, editingTaskDate || null)
      setEditingTaskId(null)
      setEditingTaskText('')
      setEditingTaskDate('')
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar tarefa.')
    }
  }

  const getProgress = (clientId: string) => {
    const clientTasks = data.tasks.filter(t => t.client_id === clientId)
    if (clientTasks.length === 0) return 0
    const completed = clientTasks.filter(t => t.completed).length
    return Math.round((completed / clientTasks.length) * 100)
  }

  async function loadData() {
    setIsLoading(true)
    setError('')
    try {
      setData(await listOfficeData())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possivel carregar o escritorio.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  function showSuccess(text: string) {
    setMessage(text)
    setError('')
    setTimeout(() => setMessage(''), 3000)
  }

  async function submitTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const parsed = officeTransactionSchema.safeParse(getFormData<OfficeTransactionInput>(form))
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos.')
      return
    }
    await createOfficeTransaction(parsed.data)
    form.reset()
    setIsTransactionModalOpen(false)
    showSuccess('Transação salva com sucesso.')
    await loadData()
  }

  async function submitCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const parsed = officeCategorySchema.safeParse(getFormData<OfficeCategoryInput>(form))
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos.')
      return
    }
    await createOfficeCategory(parsed.data)
    form.reset()
    showSuccess('Categoria salva.')
    await loadData()
  }

  if (isLoading) {
    return <div className="p-8 w-full flex items-center justify-center text-gray-500 font-medium animate-pulse">Carregando escritório...</div>
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={() => setIsClosingModalOpen(true)}
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
          Fechar Caixa
        </button>
        <button
          type="button"
          onClick={() => setIsTransactionModalOpen(true)}
          className="bg-plena-orange hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Transação
        </button>
      </div>

      {message && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg shadow-sm flex items-center">
          <span className="text-green-800 font-medium">{message}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm flex items-center">
          <span className="text-red-800 font-medium">{error}</span>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <Dashboard
          transactions={data.transactions}
          categories={data.categories}
          services={data.serviceRecords}
          serviceItems={data.serviceItems}
        />
      )}

      {activeTab === 'transactions' && (
        <div className="animate-fade-in space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Histórico de Transações</h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                  className="w-full sm:w-56 pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-plena-orange bg-white"
                />
              </div>
              <select
                value={transactionFilter}
                onChange={(e) => setTransactionFilter(e.target.value as 'all' | 'income' | 'expense')}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-plena-orange bg-white font-medium text-gray-700"
              >
                <option value="all">Todos</option>
                <option value="income">Entradas</option>
                <option value="expense">Saídas</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Qtd</th>
                    <th className="px-6 py-4">Método</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTransactions.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Nenhuma transação encontrada.</td></tr>
                  ) : filteredTransactions.map((t) => {
                    const cat = data.categories.find(c => c.id === t.category_id)
                    return (
                      <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                          {new Date((t.transaction_date || getTodayLocal()) + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{t.description}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${cat?.color || '#eee'}33`, color: cat?.color || '#666' }}>
                            {cat?.name || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{toNumber(t.quantity) || 1}</td>
                        <td className="px-6 py-4 text-gray-600 capitalize">{PAYMENT_METHOD_LABELS[t.payment_method as keyof typeof PAYMENT_METHOD_LABELS] || t.payment_method || '-'}</td>
                        <td className={`px-6 py-4 font-semibold whitespace-nowrap ${t.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                          {t.type === 'expense' ? '-' : '+'}{formatCurrency(toNumber(t.amount))}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => { void deleteOfficeTransaction(t.id).then(loadData) }}
                            className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="animate-fade-in space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
              <p className="text-gray-500 text-sm">Gerencie seus clientes, anotações e checklists.</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-plena-orange outline-none text-black text-sm"
                  value={clientSearchTerm}
                  onChange={e => setClientSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => { setEditingClient(null); setIsClientModalOpen(true); }}
                className="bg-plena-orange hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center justify-center cursor-pointer whitespace-nowrap text-sm"
              >
                <Plus className="w-5 h-5 mr-1" />
                Novo Cliente
              </button>
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Nenhum cliente encontrado</h3>
              <p className="text-gray-500 mt-1">Adicione um novo cliente para começar a organizar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredClients.map(client => {
                const clientTasks = data.tasks.filter(t => t.client_id === client.id)
                const isAllCompleted = clientTasks.length > 0 && clientTasks.every(t => t.completed)
                return (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-plena-orange transition-all cursor-pointer relative overflow-hidden text-gray-800"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/85 rounded-bl-lg backdrop-blur-sm z-10">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setEditingClient(client); setIsClientModalOpen(true); }}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); void handleDeleteClient(client.id); }}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Folder className="w-10 h-10 text-yellow-500 fill-yellow-100" />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className="text-base font-bold text-gray-900 truncate pr-6 leading-tight">{client.name}</h3>
                        <div className="flex flex-col gap-1 mt-1">
                          {client.phone && (
                            <span className="text-xs text-gray-500 flex items-center truncate">
                              <Phone className="w-3 h-3 mr-1" /> {client.phone}
                            </span>
                          )}

                          <div className="flex items-center gap-2 mt-2">
                            {client.notes && (
                              <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded flex items-center font-bold">
                                <StickyNote className="w-3 h-3 mr-1" /> Nota
                              </span>
                            )}
                            {clientTasks.length > 0 && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center font-bold ${
                                isAllCompleted
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                <CheckSquare className="w-3 h-3 mr-1" />
                                {clientTasks.filter(t => t.completed).length}/{clientTasks.length}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="animate-fade-in space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Controle de Serviços</h2>
              <p className="text-sm text-gray-500">Registre rapidamente a quantidade de serviços realizados no dia.</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="date"
                value={selectedServiceDate}
                onChange={e => setSelectedServiceDate(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-plena-orange outline-none bg-white text-gray-700 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setIsCatalogModalOpen(true)}
                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
              >
                <Settings2 className="w-5 h-5" />
                Catálogo
              </button>
              <button
                type="button"
                onClick={() => setIsServiceReportModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                <FileText className="w-5 h-5" />
                Relatório
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="relative mb-6">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar serviço no catálogo..."
                value={serviceSearchTerm}
                onChange={e => setServiceSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-plena-orange focus:border-transparent outline-none bg-gray-50/50 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServiceItems.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500 flex flex-col items-center">
                  <Briefcase className="w-12 h-12 text-gray-300 mb-3" />
                  <p>Nenhum serviço encontrado. Adicione novos no Catálogo.</p>
                </div>
              ) : (
                filteredServiceItems.map(item => {
                  const qty = getQuantityForToday(item.id)
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 leading-tight">{item.name}</h3>
                      </div>

                      <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                        <button
                          type="button"
                          onClick={() => handleDecrement(item)}
                          disabled={qty === 0}
                          className={`p-1.5 rounded-md transition-colors ${qty > 0 ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-bold text-lg text-gray-900 font-mono">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrement(item)}
                          className="p-1.5 rounded-md text-white bg-plena-orange hover:bg-orange-600 transition-colors shadow-sm cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'closing' && (
        <div className="animate-fade-in space-y-6 text-gray-800">

          {/* Header & Controls */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Relatório por Período</h2>
              <p className="text-gray-500 text-sm">Selecione as datas para consolidar e analisar.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 w-full xl:w-auto">

              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                <CalendarDays className="w-4 h-4 text-gray-400 ml-1" />
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={closingStartDate}
                        onChange={(e) => setClosingStartDate(e.target.value)}
                        className="bg-transparent border-none text-sm focus:ring-0 text-gray-700 p-1 outline-none"
                        title="Data Inicial"
                    />
                    <span className="text-gray-400 text-xs">até</span>
                    <input
                        type="date"
                        value={closingEndDate}
                        onChange={(e) => setClosingEndDate(e.target.value)}
                        className="bg-transparent border-none text-sm focus:ring-0 text-gray-700 p-1 outline-none"
                        title="Data Final"
                    />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer whitespace-nowrap"
                >
                  <Upload className="w-4 h-4 text-gray-500" />
                  Consolidar
                </button>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  accept=".json"
                  onChange={handleFileMerge}
                />

                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-xl transition-colors cursor-pointer shadow-md shadow-green-100 flex items-center justify-center"
                  title="Enviar Relatório no WhatsApp"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailedReportOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-colors cursor-pointer shadow-md shadow-blue-100 flex items-center justify-center"
                  title="Gerar Relatório Detalhado"
                >
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Receita do Período</span>
                 <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-mono font-bold text-gray-900">{formatCurrency(closingStats.income)}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Despesa do Período</span>
                 <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-mono font-bold text-gray-900">{formatCurrency(closingStats.expense)}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden hover:shadow-md transition-shadow">
              <div className={`absolute right-0 top-0 h-full w-1.5 ${closingStats.balance >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div className="flex items-center justify-between mb-2">
                 <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Saldo do Período</span>
                 <DollarSign className="w-5 h-5 text-plena-orange" />
              </div>
              <p className={`text-3xl font-mono font-bold ${closingStats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(closingStats.balance)}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Desempenho Diário</h3>
            <div className="h-80 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{fill: '#6b7280', fontSize: 12}}
                        dy={10}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(val) => `R$${val}`} />
                    <Tooltip
                      cursor={{fill: '#f9fafb'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'}}
                      formatter={(value: number | string) => formatCurrency(toNumber(value))}
                      labelStyle={{color: '#374151', fontWeight: 'bold'}}
                    />
                    <Bar dataKey="income" name="Entradas" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="expense" name="Saídas" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Calendar className="w-12 h-12 mb-2 opacity-20" />
                  <p>Nenhum dado encontrado para este período.</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Service Highlight */}
          {topService && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-100">
                  <Trophy className="w-8 h-8 text-plena-orange" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Serviço Destaque</h3>
                  <p className="text-gray-500 text-sm">O serviço que gerou maior receita neste período.</p>
                </div>
              </div>

              <div className="flex-1 w-full md:w-auto bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white"
                    style={{ backgroundColor: topService.color }}
                  />
                  <span className="font-semibold text-gray-900 text-lg">{topService.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-mono font-bold text-gray-900">{formatCurrency(topService.amount)}</p>
                  <p className="text-xs text-gray-500 font-semibold bg-white px-2 py-0.5 rounded-full inline-block border border-gray-100 shadow-sm mt-1">
                    {topService.percentage.toFixed(1)}% da receita
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Services Quantities List */}
          {serviceQuantities.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Hash className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900">Quantidade por Serviço Realizado</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {serviceQuantities.map(svc => (
                  <div key={svc.id} className="flex flex-col p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                      <span className="font-bold text-gray-800 line-clamp-1 text-sm">{svc.name}</span>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <div>
                        <span className="text-xs text-gray-500">Quantidade:</span>
                        <span className="ml-1.5 text-lg font-bold text-gray-900 font-mono">{svc.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-fade-in space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
              <h3 className="text-lg font-bold mb-4">Nova Categoria</h3>
              <form onSubmit={submitCategory} className="space-y-4">
                <input name="name" placeholder="Nome da Categoria" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-plena-orange outline-none" />
                <select name="type" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-plena-orange outline-none">
                  <option value="income">Entrada</option>
                  <option value="expense">Saída</option>
                </select>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-500">Cor:</label>
                  <input name="color" type="color" defaultValue="#f17a02" className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
                </div>
                <button type="submit" className="w-full bg-plena-orange text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">Salvar Categoria</button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-6">Categorias Cadastradas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {data.categories.map(category => (
                    <div key={category.id} className="flex items-center p-3 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                      <span className="w-4 h-4 rounded-full mr-3 shadow-sm" style={{ backgroundColor: category.color ?? '#f17a02' }} />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{category.name}</p>
                        <p className="text-xs text-gray-400">{category.type === 'income' ? 'Entrada' : 'Saída'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isTransactionModalOpen && (
        <TransactionForm
          categories={data.categories}
          clients={data.clients}
          onSubmit={submitTransaction}
          onClose={() => setIsTransactionModalOpen(false)}
        />
      )}

      {isClosingModalOpen && (
        <DailyClosingModal
          transactions={data.transactions}
          services={data.serviceRecords}
          serviceItems={data.serviceItems}
          cashClosings={data.cashClosings}
          onClose={() => setIsClosingModalOpen(false)}
          onClosed={async () => {
            showSuccess('Caixa fechado com sucesso.')
            await loadData()
          }}
        />
      )}

      {isCatalogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col h-[80vh] animate-fade-in text-gray-800">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Catálogo de Serviços</h2>
              <button
                type="button"
                onClick={() => {
                  setIsCatalogModalOpen(false)
                  setEditingServiceItem(null)
                  setServiceItemName('')
                  setServiceItemPrice('')
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Form */}
              <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 p-6 bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                  {editingServiceItem ? 'Editar Serviço' : 'Novo Serviço'}
                </h3>
                <form onSubmit={handleCatalogSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome</label>
                    <input
                      type="text"
                      required
                      value={serviceItemName}
                      onChange={e => setServiceItemName(e.target.value)}
                      placeholder="Ex: Impressão PB"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plena-orange outline-none bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Valor Unitário</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={serviceItemPrice}
                      onChange={e => setServiceItemPrice(e.target.value)}
                      placeholder="0,00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-plena-orange outline-none bg-white text-sm"
                    />
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full py-2 text-white bg-gray-900 rounded-lg hover:bg-black transition-colors font-medium shadow-sm cursor-pointer"
                    >
                      {editingServiceItem ? 'Atualizar' : 'Adicionar'}
                    </button>
                    {editingServiceItem && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingServiceItem(null)
                          setServiceItemName('')
                          setServiceItemPrice('')
                        }}
                        className="w-full py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="w-full md:w-2/3 p-6 overflow-y-auto">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                  Itens Cadastrados
                </h3>
                <div className="space-y-2">
                  {data.serviceItems.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Nenhum serviço cadastrado.</p>
                  ) : (
                    data.serviceItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <span className="font-semibold text-gray-900 block leading-tight">{item.name}</span>
                          <span className="text-xs text-plena-orange font-medium font-mono">{formatCurrency(toNumber(item.default_price))}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingServiceItem(item)
                              setServiceItemName(item.name)
                              setServiceItemPrice(toNumber(item.default_price).toString())
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Excluir este serviço do catálogo?')) {
                                void handleDeleteCatalogItem(item.id)
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isServiceReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 print:bg-white print:p-0">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:max-h-none print:w-full text-gray-800 animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 print:hidden">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Relatório de Serviços</h2>
                <p className="text-sm text-gray-500">Gere um relatório detalhado de serviços por período</p>
              </div>
              <button
                type="button"
                onClick={() => setIsServiceReportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8 print:p-0 print:space-y-6 flex-1">
              {/* Controls */}
              <div className="flex flex-col md:flex-row gap-4 items-end mb-6 print:hidden">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Data Inicial</label>
                  <input
                    type="date"
                    value={serviceReportStartDate}
                    onChange={(e) => setServiceReportStartDate(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-plena-orange outline-none bg-white text-gray-700 w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Data Final</label>
                  <input
                    type="date"
                    value={serviceReportEndDate}
                    onChange={(e) => setServiceReportEndDate(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-plena-orange outline-none bg-white text-gray-700 w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer h-[38px] font-bold"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Relatório
                </button>
              </div>

              {/* Report Header (Print only) */}
              <div className="hidden print:block text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Relatório de Serviços</h2>
                <p className="text-gray-600">
                  Período: {new Date(serviceReportStartDate + 'T12:00:00').toLocaleDateString('pt-BR')} a {new Date(serviceReportEndDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                </p>
              </div>

              {/* Report Content */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Serviços Realizados</h3>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-gray-700">Serviço</th>
                        <th className="px-6 py-3 font-semibold text-gray-700 text-right">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(() => {
                        const qtyMap: Record<string, number> = {};
                        (data.serviceRecords || []).filter(s => (s.record_date || '') >= serviceReportStartDate && (s.record_date || '') <= serviceReportEndDate).forEach(s => {
                          if (s.service_item_id) {
                            qtyMap[s.service_item_id] = (qtyMap[s.service_item_id] || 0) + toNumber(s.quantity);
                          }
                        });

                        const result = Object.entries(qtyMap).map(([id, qty]) => {
                          const item = (data.serviceItems || []).find(c => c.id === id);
                          return {
                            id,
                            name: item?.name || 'Serviço Excluído',
                            quantity: qty
                          };
                        }).filter(r => r.quantity > 0).sort((a, b) => b.quantity - a.quantity);

                        if (result.length === 0) {
                          return (
                            <tr>
                              <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                                Nenhum serviço registrado neste período.
                              </td>
                            </tr>
                          );
                        }

                        return result.map(svc => (
                          <tr key={svc.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 text-gray-900">{svc.name}</td>
                            <td className="px-6 py-4 text-right font-mono font-medium text-blue-600">{svc.quantity}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Details Modal (Folder View) */}
      {selectedClient && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh] text-gray-800">

            {/* Folder Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-start">
               <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-200">
                     <Folder className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedClient.name}</h2>
                     <p className="text-xs text-gray-400 mt-1">Pasta do Cliente</p>
                  </div>
               </div>
               <button type="button" onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                 <X className="w-6 h-6" />
               </button>
            </div>

            <div className="p-6 overflow-y-auto bg-gray-50/50 flex-1 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Info Column */}
                  <div className="space-y-4">
                     <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Informações de Contato</h3>

                     <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                        <div className="flex items-center text-gray-700 text-sm">
                           <Phone className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                           <span>{selectedClient.phone || <span className="text-gray-400 italic">Sem telefone</span>}</span>
                        </div>
                        <div className="flex items-center text-gray-700 text-sm">
                           <Mail className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                           <span className="break-all">{selectedClient.email || <span className="text-gray-400 italic">Sem email</span>}</span>
                        </div>
                        <div className="flex items-center text-gray-700 text-sm">
                           <MapPin className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                           <span>{selectedClient.address || <span className="text-gray-400 italic">Sem endereço</span>}</span>
                        </div>
                        {selectedClient.document && (
                          <div className="flex items-center text-gray-700 pt-3 border-t border-gray-100 mt-3">
                             <span className="text-xs font-bold mr-2 text-gray-500">DOC:</span>
                             <span className="font-mono text-sm">{selectedClient.document}</span>
                          </div>
                        )}
                     </div>

                     <button
                       type="button"
                       className="w-full py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-medium shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                       onClick={() => { setEditingClient(selectedClient); setIsClientModalOpen(true); }}
                     >
                       <Edit2 className="w-4 h-4" />
                       Editar Informações
                     </button>
                  </div>

                  {/* Notes & Tasks Column */}
                  <div className="space-y-6">

                     {/* Post-it Note */}
                     <div className="relative">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                           <StickyNote className="w-4 h-4 mr-2 text-yellow-600" />
                           Anotações
                        </h3>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-sm rounded-r-lg relative">
                           <div className="font-mono text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
                              {selectedClient.notes ? selectedClient.notes : (
                                <span className="text-yellow-700/50 italic">Nenhuma anotação...</span>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* Checklist */}
                     <div>
                        <div className="flex justify-between items-center mb-2">
                           <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                              <CheckSquare className="w-4 h-4 mr-2 text-blue-600" />
                              Check-list
                           </h3>
                           <span className="text-xs font-medium text-gray-500">
                              {getProgress(selectedClient.id)}% Concluído
                           </span>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                           {/* Add Task Input */}
                           <form onSubmit={handleClientTaskAdd} className="flex flex-col gap-2 border-b border-gray-100 p-2 bg-gray-50/50">
                              <div className="flex gap-2">
                                <input
                                   type="text"
                                   className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-plena-orange"
                                   placeholder="Nova tarefa..."
                                   value={newClientTaskText}
                                   onChange={e => setNewClientTaskText(e.target.value)}
                                />
                                <button
                                   type="submit"
                                   disabled={!newClientTaskText.trim()}
                                   className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                                >
                                   <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2 px-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <input
                                  type="date"
                                  className="bg-transparent text-xs text-gray-600 focus:outline-none"
                                  value={newClientTaskDate}
                                  onChange={e => setNewClientTaskDate(e.target.value)}
                                />
                              </div>
                           </form>

                           {/* Task List */}
                           <div className="max-h-[200px] overflow-y-auto">
                              {data.tasks.filter(t => t.client_id === selectedClient.id).length === 0 ? (
                                 <p className="text-center text-gray-400 py-6 text-sm italic">Nenhuma tarefa criada.</p>
                              ) : (
                                 <ul className="divide-y divide-gray-100">
                                    {data.tasks.filter(t => t.client_id === selectedClient.id).map(task => (
                                       <li key={task.id} className="p-3 hover:bg-gray-50 group transition-colors">

                                          {editingTaskId === task.id ? (
                                            // EDIT MODE
                                            <div className="flex flex-col gap-2 animate-fade-in">
                                               <input
                                                 type="text"
                                                 className="w-full bg-white border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200"
                                                 value={editingTaskText}
                                                 onChange={e => setEditingTaskText(e.target.value)}
                                                 autoFocus
                                               />
                                               <div className="flex justify-between items-center">
                                                  <input
                                                    type="date"
                                                    className="bg-white border border-gray-200 rounded px-2 py-1 text-xs"
                                                    value={editingTaskDate}
                                                    onChange={e => setEditingTaskDate(e.target.value)}
                                                  />
                                                  <div className="flex gap-1">
                                                    <button onClick={handleClientTaskSave} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200 cursor-pointer" title="Salvar">
                                                      <Save className="w-3 h-3" />
                                                    </button>
                                                    <button onClick={() => setEditingTaskId(null)} className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200 cursor-pointer" title="Cancelar">
                                                      <X className="w-3 h-3" />
                                                    </button>
                                                  </div>
                                               </div>
                                            </div>
                                          ) : (
                                            // VIEW MODE
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center flex-1 min-w-0 select-none">
                                                   <div
                                                     className={`flex-shrink-0 w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors cursor-pointer ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'}`}
                                                     onClick={() => void handleClientTaskToggle(task)}
                                                   >
                                                      {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
                                                   </div>

                                                   <div className="flex-1 min-w-0" onDoubleClick={() => {
                                                     setEditingTaskId(task.id)
                                                     setEditingTaskText(task.text)
                                                     setEditingTaskDate(task.due_date || '')
                                                   }}>
                                                      <p className={`text-sm truncate ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                                         {task.text}
                                                      </p>
                                                      {task.due_date && (
                                                        <span className={`text-[10px] flex items-center mt-0.5 ${new Date(task.due_date) < new Date() && !task.completed ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                                          <Calendar className="w-3 h-3 mr-1" />
                                                          {new Date(task.due_date + 'T12:00:00').toLocaleDateString('pt-BR').slice(0, 5)}
                                                        </span>
                                                      )}
                                                   </div>
                                                </div>

                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <button
                                                     type="button"
                                                     onClick={() => {
                                                       setEditingTaskId(task.id)
                                                       setEditingTaskText(task.text)
                                                       setEditingTaskDate(task.due_date || '')
                                                     }}
                                                     className="text-gray-400 hover:text-blue-500 p-1.5 rounded-full hover:bg-blue-50 cursor-pointer"
                                                     title="Editar"
                                                  >
                                                     <Edit2 className="w-3.5 h-3.5" />
                                                  </button>
                                                  <button
                                                     type="button"
                                                     onClick={() => void handleClientTaskDelete(task.id)}
                                                     className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 cursor-pointer"
                                                     title="Excluir"
                                                  >
                                                     <Trash2 className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                            </div>
                                          )}
                                       </li>
                                    ))}
                                 </ul>
                              )}
                           </div>

                           {/* Progress Bar */}
                           {data.tasks.filter(t => t.client_id === selectedClient.id).length > 0 && (
                              <div className="h-1.5 bg-gray-100 w-full">
                                 <div
                                    className="h-full bg-green-500 transition-all duration-500 ease-out"
                                    style={{ width: `${getProgress(selectedClient.id)}%` }}
                                 />
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Form Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh] text-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-plena-orange" />
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </h2>
              <button type="button" onClick={() => { setIsClientModalOpen(false); setEditingClient(null); }} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleClientFormSave} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome Completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={editingClient?.name || ''}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-plena-orange outline-none text-black text-sm"
                      placeholder="Nome do Cliente ou Empresa"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Telefone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="phone"
                      defaultValue={editingClient?.phone || ''}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-plena-orange outline-none text-black text-sm"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">CPF / CNPJ</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="document"
                      defaultValue={editingClient?.document || ''}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-plena-orange outline-none text-black text-sm"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingClient?.email || ''}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-plena-orange outline-none text-black text-sm"
                      placeholder="cliente@email.com"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Endereço</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      defaultValue={editingClient?.address || ''}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-plena-orange outline-none text-black text-sm"
                      placeholder="Rua, Número, Bairro"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 mt-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center">
                    <StickyNote className="w-4 h-4 mr-1 text-yellow-500" />
                    Anotações (Post-it)
                  </label>
                  <textarea
                    name="notes"
                    defaultValue={editingClient?.notes || ''}
                    className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-gray-800 min-h-[120px] font-mono text-sm shadow-sm"
                    placeholder="Escreva informações importantes sobre este cliente aqui..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button type="button" className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl font-bold cursor-pointer transition-colors" onClick={() => { setIsClientModalOpen(false); setEditingClient(null); }}>Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-plena-orange hover:bg-orange-600 text-white rounded-xl font-bold cursor-pointer transition-colors flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingClient ? 'Salvar Alterações' : 'Criar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Report Modal */}
      {isDetailedReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 print:bg-white print:p-0">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:max-h-none print:w-full text-gray-800 animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 print:hidden">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Relatório Detalhado</h2>
                <p className="text-sm text-gray-500">
                  Período: {new Date(closingStartDate + 'T12:00:00').toLocaleDateString('pt-BR')} a {new Date(closingEndDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-2 font-bold text-sm"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailedReportOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-8 print:p-0 print:space-y-6 flex-1">
              {/* Financial Summary */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Resumo Financeiro</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-xs text-green-700 mb-1 font-semibold uppercase">Total Entradas</p>
                    <p className="text-xl font-bold text-green-800 font-mono">{formatCurrency(closingStats.income)}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <p className="text-xs text-red-700 mb-1 font-semibold uppercase">Total Saídas</p>
                    <p className="text-xl font-bold text-red-800 font-mono">{formatCurrency(closingStats.expense)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-xs text-gray-700 mb-1 font-semibold uppercase">Saldo</p>
                    <p className={`text-xl font-bold font-mono ${closingStats.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                      {formatCurrency(closingStats.balance)}
                    </p>
                  </div>
                </div>
              </section>

              {/* Services Realizados */}
              {serviceQuantities.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Serviços Realizados por Tipo</h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 font-semibold text-gray-700">Serviço</th>
                          <th className="px-6 py-3 font-semibold text-gray-700 text-right">Quantidade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {serviceQuantities.map(svc => (
                          <tr key={svc.id}>
                            <td className="px-6 py-3 text-gray-900">{svc.name}</td>
                            <td className="px-6 py-3 text-right font-mono font-bold text-blue-600">{svc.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Detalhamento de Transações */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Detalhamento de Transações (Entradas/Saídas)</h3>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-gray-700">Data</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">Categoria</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">Descrição</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">Método</th>
                        <th className="px-6 py-3 font-semibold text-gray-700 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {reportTransactions.sort((a, b) => (b.transaction_date || '').localeCompare(a.transaction_date || '')).map(t => {
                        const isIncome = t.type === 'income';
                        const cat = data.categories.find(c => c.id === t.category_id);
                        return (
                          <tr key={t.id} className="hover:bg-gray-50/30">
                            <td className="px-6 py-3 text-gray-600 whitespace-nowrap">{new Date((t.transaction_date || getTodayLocal()) + 'T12:00:00').toLocaleDateString('pt-BR')}</td>
                            <td className="px-6 py-3 text-gray-900 font-medium">{cat?.name || '---'}</td>
                            <td className="px-6 py-3 text-gray-600">{t.description || '-'}</td>
                            <td className="px-6 py-3 text-gray-500 capitalize whitespace-nowrap">
                              {PAYMENT_METHOD_LABELS[t.payment_method as keyof typeof PAYMENT_METHOD_LABELS] || t.payment_method || '-'}
                            </td>
                            <td className={`px-6 py-3 text-right font-semibold whitespace-nowrap ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                              {isIncome ? '+' : '-'}{formatCurrency(toNumber(t.amount))}
                            </td>
                          </tr>
                        );
                      })}
                      {reportTransactions.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            Nenhuma transação no período.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="text-center text-xs text-gray-400 pt-4 print:pt-2">
                Relatório gerado em {new Date().toLocaleString('pt-BR')} pelo Sistema Plena
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
