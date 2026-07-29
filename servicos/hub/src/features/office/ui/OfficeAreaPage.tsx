import { useEffect, useMemo, useState } from 'react'

import {
  PAYMENT_METHOD_LABELS,
  officeCashClosingSchema,
  officeCategorySchema,
  officeClientSchema,
  officeServiceItemSchema,
  officeServiceRecordSchema,
  officeTransactionSchema,
  type OfficeCashClosingInput,
  type OfficeCategoryInput,
  type OfficeClientInput,
  type OfficeServiceItemInput,
  type OfficeServiceRecordInput,
  type OfficeTransactionInput,
} from '../domain/office-schema'
import {
  createClientTask,
  createOfficeCashClosing,
  createOfficeCategory,
  createOfficeClient,
  createOfficeServiceItem,
  createOfficeServiceRecord,
  createOfficeTransaction,
  deleteOfficeTransaction,
  importCashControlJson,
  listOfficeData,
  toggleClientTask,
  type OfficeData,
} from '../services/office-service'
import './office.css'

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

const today = new Date().toISOString().slice(0, 10)
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function formatMoney(value: number) {
  return money.format(value)
}

function toNumber(value: number | string | null) {
  return typeof value === 'number' ? value : Number(value ?? 0)
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

  async function loadData() {
    setIsLoading(true)
    setError('')
    try {
      setData(await listOfficeData())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel carregar o escritorio.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  const summary = useMemo(() => {
    const currentMonth = today.slice(0, 7)
    const monthTransactions = data.transactions.filter((item) => item.transaction_date.startsWith(currentMonth))
    const income = monthTransactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + toNumber(item.amount), 0)
    const expense = monthTransactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + toNumber(item.amount), 0)
    const todayTransactions = data.transactions.filter((item) => item.transaction_date === today)
    const todayIncome = todayTransactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + toNumber(item.amount), 0)
    const openTasks = data.tasks.filter((task) => !task.completed).length

    return {
      income,
      expense,
      balance: income - expense,
      todayIncome,
      todayCount: todayTransactions.length,
      openTasks,
    }
  }, [data])

  function showSuccess(text: string) {
    setMessage(text)
    setError('')
  }

  async function submitClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const parsed = officeClientSchema.safeParse(getFormData<OfficeClientInput>(form))
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados invalidos.')
      return
    }
    await createOfficeClient(parsed.data)
    form.reset()
    showSuccess('Cliente salvo.')
    await loadData()
  }

  async function submitTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const parsed = officeTransactionSchema.safeParse(getFormData<OfficeTransactionInput>(form))
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados invalidos.')
      return
    }
    await createOfficeTransaction(parsed.data)
    form.reset()
    showSuccess('Transacao salva.')
    await loadData()
  }

  async function submitCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const parsed = officeCategorySchema.safeParse(getFormData<OfficeCategoryInput>(form))
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados invalidos.')
      return
    }
    await createOfficeCategory(parsed.data)
    form.reset()
    showSuccess('Categoria salva.')
    await loadData()
  }

  async function submitServiceItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const parsed = officeServiceItemSchema.safeParse(getFormData<OfficeServiceItemInput>(form))
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados invalidos.')
      return
    }
    await createOfficeServiceItem(parsed.data)
    form.reset()
    showSuccess('Servico salvo.')
    await loadData()
  }

  async function submitServiceRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const parsed = officeServiceRecordSchema.safeParse(getFormData<OfficeServiceRecordInput>(form))
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados invalidos.')
      return
    }
    await createOfficeServiceRecord(parsed.data)
    form.reset()
    showSuccess('Registro de servico salvo.')
    await loadData()
  }

  async function submitClosing(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const parsed = officeCashClosingSchema.safeParse(getFormData<OfficeCashClosingInput>(form))
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados invalidos.')
      return
    }
    await createOfficeCashClosing(parsed.data)
    form.reset()
    showSuccess('Fechamento salvo.')
    await loadData()
  }

  async function submitImport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const input = form.elements.namedItem('jsonFile') as HTMLInputElement | null
    const file = input?.files?.[0]
    if (!file) {
      setError('Selecione o JSON exportado pelo Cash Control.')
      return
    }
    const payload = JSON.parse(await file.text()) as Record<string, unknown>
    const result = await importCashControlJson(payload)
    showSuccess(`Importacao concluida: ${result.clients} clientes, ${result.transactions} transacoes, ${result.serviceItems} servicos e ${result.serviceRecords} registros.`)
    form.reset()
    await loadData()
  }

  async function submitTask(event: React.FormEvent<HTMLFormElement>, clientId: string) {
    event.preventDefault()
    const form = event.currentTarget
    const text = String(new FormData(form).get('task') ?? '').trim()
    if (!text) return
    await createClientTask(clientId, text)
    form.reset()
    await loadData()
  }

  if (isLoading) {
    return <div className="office-root" aria-live="polite">Carregando gestao escritorio...</div>
  }

  return (
    <div className="office-root">
      <div className="office-hero">
        <div>
          <span>Plena Gestao Escritorio</span>
          <h2>Controle operacional do atendimento presencial</h2>
        </div>
        <strong>{formatMoney(summary.balance)}</strong>
      </div>

      {message && <p className="adm-alert adm-alert--success">{message}</p>}
      {error && <p className="adm-alert adm-alert--error" role="alert">{error}</p>}

      {activeTab === 'dashboard' && (
        <section className="office-panel">
          <div className="office-kpis">
            <div><span>Entradas do mes</span><strong>{formatMoney(summary.income)}</strong></div>
            <div><span>Saidas do mes</span><strong>{formatMoney(summary.expense)}</strong></div>
            <div><span>Hoje</span><strong>{formatMoney(summary.todayIncome)}</strong><small>{summary.todayCount} movimentos</small></div>
            <div><span>Tarefas abertas</span><strong>{summary.openTasks}</strong></div>
          </div>
          <OfficeTransactionTable data={data} onDelete={async (id) => { await deleteOfficeTransaction(id); await loadData() }} />
        </section>
      )}

      {activeTab === 'transactions' && (
        <section className="office-grid">
          <form className="office-form" onSubmit={submitTransaction}>
            <h3>Nova transacao</h3>
            <select name="type" defaultValue="income"><option value="income">Entrada</option><option value="expense">Saida</option></select>
            <input name="description" placeholder="Descricao" />
            <input name="amount" type="number" step="0.01" placeholder="Valor" />
            <input name="quantity" type="number" placeholder="Quantidade" />
            <input name="transactionDate" type="date" defaultValue={today} />
            <select name="paymentMethod" defaultValue="pix">
              {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select name="categoryId" defaultValue="">
              <option value="">Categoria</option>
              {data.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <select name="clientId" defaultValue="">
              <option value="">Cliente</option>
              {data.clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
            </select>
            <input name="tags" placeholder="Tags separadas por virgula" />
            <button className="adm-btn adm-btn--primary" type="submit">Salvar transacao</button>
          </form>
          <OfficeTransactionTable data={data} onDelete={async (id) => { await deleteOfficeTransaction(id); await loadData() }} />
        </section>
      )}

      {activeTab === 'clients' && (
        <section className="office-grid">
          <form className="office-form" onSubmit={submitClient}>
            <h3>Novo cliente</h3>
            <input name="name" placeholder="Nome" />
            <input name="phone" placeholder="Telefone" />
            <input name="email" type="email" placeholder="E-mail" />
            <input name="document" placeholder="Documento" />
            <input name="address" placeholder="Endereco" />
            <textarea name="notes" placeholder="Notas" />
            <button className="adm-btn adm-btn--primary" type="submit">Salvar cliente</button>
          </form>
          <div className="office-list">
            {data.clients.map((client) => (
              <article className="office-card" key={client.id}>
                <h3>{client.name}</h3>
                <p>{client.phone || client.email || 'Sem contato cadastrado'}</p>
                {client.notes && <p>{client.notes}</p>}
                <form onSubmit={(event) => submitTask(event, client.id)}>
                  <input name="task" placeholder="Nova tarefa" />
                  <button type="submit">Adicionar</button>
                </form>
                {data.tasks.filter((task) => task.client_id === client.id).map((task) => (
                  <label className="office-check" key={task.id}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(event) => { void toggleClientTask(task.id, event.target.checked).then(loadData) }}
                    />
                    {task.text}
                  </label>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'services' && (
        <section className="office-grid">
          <div className="office-stack">
            <form className="office-form" onSubmit={submitServiceItem}>
              <h3>Catalogo</h3>
              <input name="name" placeholder="Servico" />
              <input name="defaultPrice" type="number" step="0.01" placeholder="Valor padrao" />
              <button className="adm-btn adm-btn--primary" type="submit">Salvar servico</button>
            </form>
            <form className="office-form" onSubmit={submitServiceRecord}>
              <h3>Registro de servico</h3>
              <select name="serviceItemId" defaultValue="">
                <option value="">Servico avulso</option>
                {data.serviceItems.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              <input name="name" placeholder="Nome do servico" />
              <input name="quantity" type="number" defaultValue="1" />
              <input name="recordDate" type="date" defaultValue={today} />
              <select name="clientId" defaultValue="">
                <option value="">Cliente</option>
                {data.clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select>
              <button className="adm-btn adm-btn--primary" type="submit">Registrar</button>
            </form>
          </div>
          <div className="office-list">
            {data.serviceItems.map((item) => (
              <article className="office-card" key={item.id}>
                <h3>{item.name}</h3>
                <p>{formatMoney(toNumber(item.default_price))}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'closing' && (
        <section className="office-grid">
          <form className="office-form" onSubmit={submitClosing}>
            <h3>Fechar caixa</h3>
            <input name="closingDate" type="date" defaultValue={today} />
            <input name="totalIncome" type="number" step="0.01" defaultValue={summary.income} />
            <input name="totalExpense" type="number" step="0.01" defaultValue={summary.expense} />
            <input name="balance" type="number" step="0.01" defaultValue={summary.balance} />
            <textarea name="notes" placeholder="Observacoes" />
            <button className="adm-btn adm-btn--primary" type="submit">Salvar fechamento</button>
          </form>
          <div className="office-list">
            {data.cashClosings.map((closing) => (
              <article className="office-card" key={closing.id}>
                <h3>{new Date(closing.closing_date + 'T12:00:00').toLocaleDateString('pt-BR')}</h3>
                <p>Saldo: {formatMoney(toNumber(closing.balance))}</p>
                <p>Entradas: {formatMoney(toNumber(closing.total_income))} | Saidas: {formatMoney(toNumber(closing.total_expense))}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'settings' && (
        <section className="office-grid">
          <form className="office-form" onSubmit={submitCategory}>
            <h3>Nova categoria</h3>
            <input name="name" placeholder="Nome" />
            <select name="type" defaultValue="income"><option value="income">Entrada</option><option value="expense">Saida</option></select>
            <input name="color" type="color" defaultValue="#f17a02" />
            <button className="adm-btn adm-btn--primary" type="submit">Salvar categoria</button>
          </form>
          <div className="office-list">
            {data.categories.map((category) => (
              <article className="office-card office-card--row" key={category.id}>
                <span style={{ backgroundColor: category.color ?? '#f17a02' }} />
                <strong>{category.name}</strong>
                <small>{category.type === 'income' ? 'Entrada' : 'Saida'}</small>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'import' && (
        <section className="office-panel">
          <form className="office-form office-form--wide" onSubmit={submitImport}>
            <h3>Importacao unica do Plena Cash Control</h3>
            <p>Use somente o arquivo JSON exportado pelo app antigo, depois de guardar uma copia de backup.</p>
            <input name="jsonFile" type="file" accept="application/json,.json" />
            <button className="adm-btn adm-btn--primary" type="submit">Importar JSON</button>
          </form>
        </section>
      )}
    </div>
  )
}

function OfficeTransactionTable({
  data,
  onDelete,
}: {
  data: OfficeData
  onDelete: (id: string) => Promise<void>
}) {
  const categoryById = new Map(data.categories.map((category) => [category.id, category.name]))
  const clientById = new Map(data.clients.map((client) => [client.id, client.name]))

  return (
    <div className="office-table-wrap">
      <table className="office-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Descricao</th>
            <th>Categoria</th>
            <th>Cliente</th>
            <th>Pagamento</th>
            <th>Valor</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {data.transactions.length === 0 ? (
            <tr><td colSpan={7}>Nenhuma transacao registrada.</td></tr>
          ) : data.transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.transaction_date + 'T12:00:00').toLocaleDateString('pt-BR')}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category_id ? categoryById.get(transaction.category_id) ?? '-' : '-'}</td>
              <td>{transaction.client_id ? clientById.get(transaction.client_id) ?? '-' : '-'}</td>
              <td>{PAYMENT_METHOD_LABELS[transaction.payment_method as keyof typeof PAYMENT_METHOD_LABELS] ?? transaction.payment_method}</td>
              <td className={transaction.type === 'expense' ? 'office-money office-money--out' : 'office-money'}>{formatMoney(toNumber(transaction.amount))}</td>
              <td><button type="button" onClick={() => { void onDelete(transaction.id) }}>Excluir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
