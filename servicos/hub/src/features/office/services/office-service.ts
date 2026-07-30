import { getSupabaseClient } from '../../../admin/supabase-client'
import type { Tables, TablesInsert } from '../../../lib/supabase/database.types'
import type {
  OfficeCashClosingInput,
  OfficeCategoryInput,
  OfficeClientInput,
  OfficeServiceItemInput,
  OfficeServiceRecordInput,
  OfficeTransactionInput,
} from '../domain/office-schema'

export type OfficeClient = Tables<'clients'>
export type ClientTask = Tables<'client_tasks'>
export type OfficeCategory = Tables<'office_categories'>
export type OfficeTransaction = Tables<'office_transactions'>
export type OfficeServiceItem = Tables<'office_service_items'>
export type OfficeServiceRecord = Tables<'office_service_records'>
export type OfficeCashClosing = Tables<'office_cash_closings'>

export type OfficeData = {
  clients: OfficeClient[]
  tasks: ClientTask[]
  categories: OfficeCategory[]
  transactions: OfficeTransaction[]
  serviceItems: OfficeServiceItem[]
  serviceRecords: OfficeServiceRecord[]
  cashClosings: OfficeCashClosing[]
}

type CashControlJson = {
  clients?: Array<Record<string, unknown>>
  transactions?: Array<Record<string, unknown>>
  serviceItems?: Array<Record<string, unknown>>
  serviceRecords?: Array<Record<string, unknown>>
  services?: Array<Record<string, unknown>>
}

function nullIfBlank(value: string | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

async function getUserId() {
  const supabase = getSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user.id ?? null
}

function mapTransactionInput(
  input: OfficeTransactionInput,
  userId: string | null,
): TablesInsert<'office_transactions'> {
  return {
    type: input.type,
    amount: input.amount,
    quantity: input.quantity === '' ? null : input.quantity ?? null,
    description: input.description,
    category_id: nullIfBlank(input.categoryId),
    client_id: nullIfBlank(input.clientId),
    tags: input.tags?.split(',').map((tag) => tag.trim()).filter(Boolean) ?? [],
    transaction_date: input.transactionDate,
    payment_method: input.paymentMethod,
    created_by: userId,
  }
}

export async function listOfficeData(): Promise<OfficeData> {
  const supabase = getSupabaseClient()
  const [
    clients,
    tasks,
    categories,
    transactions,
    serviceItems,
    serviceRecords,
    cashClosings,
  ] = await Promise.all([
    supabase.from('clients').select('*').order('name', { ascending: true }),
    supabase.from('client_tasks').select('*').order('created_at', { ascending: false }),
    supabase.from('office_categories').select('*').order('name', { ascending: true }),
    supabase.from('office_transactions').select('*').order('transaction_date', { ascending: false }).order('created_at', { ascending: false }),
    supabase.from('office_service_items').select('*').order('name', { ascending: true }),
    supabase.from('office_service_records').select('*').order('record_date', { ascending: false }).order('created_at', { ascending: false }),
    supabase.from('office_cash_closings').select('*').order('closing_date', { ascending: false }),
  ])

  const firstError = [
    clients.error,
    tasks.error,
    categories.error,
    transactions.error,
    serviceItems.error,
    serviceRecords.error,
    cashClosings.error,
  ].find(Boolean)

  if (firstError) throw new Error('Falha ao carregar dados do escritorio.')

  return {
    clients: clients.data ?? [],
    tasks: tasks.data ?? [],
    categories: categories.data ?? [],
    transactions: transactions.data ?? [],
    serviceItems: serviceItems.data ?? [],
    serviceRecords: serviceRecords.data ?? [],
    cashClosings: cashClosings.data ?? [],
  }
}

export async function createOfficeClient(input: OfficeClientInput) {
  const supabase = getSupabaseClient()
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('clients')
    .insert({
      name: input.name,
      phone: nullIfBlank(input.phone),
      email: nullIfBlank(input.email),
      document: nullIfBlank(input.document),
      address: nullIfBlank(input.address),
      notes: nullIfBlank(input.notes),
      origin: 'escritorio',
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw new Error('Falha ao salvar cliente.')
  return data
}

export async function createClientTask(clientId: string, text: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('client_tasks')
    .insert({ client_id: clientId, text })
    .select()
    .single()

  if (error) throw new Error('Falha ao criar tarefa.')
  return data
}

export async function toggleClientTask(taskId: string, completed: boolean) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('client_tasks')
    .update({ completed })
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw new Error('Falha ao atualizar tarefa.')
  return data
}

export async function createOfficeCategory(input: OfficeCategoryInput) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('office_categories')
    .insert({ name: input.name, type: input.type, color: nullIfBlank(input.color) })
    .select()
    .single()

  if (error) throw new Error('Falha ao salvar categoria.')
  return data
}

export async function createOfficeTransaction(input: OfficeTransactionInput) {
  const supabase = getSupabaseClient()
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('office_transactions')
    .insert(mapTransactionInput(input, userId))
    .select()
    .single()

  if (error) throw new Error('Falha ao salvar transacao.')
  return data
}

export async function deleteOfficeTransaction(id: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from('office_transactions').delete().eq('id', id)
  if (error) throw new Error('Falha ao excluir transacao.')
}

export async function createOfficeServiceItem(input: OfficeServiceItemInput) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('office_service_items')
    .insert({ name: input.name, default_price: input.defaultPrice })
    .select()
    .single()

  if (error) throw new Error('Falha ao salvar servico.')
  return data
}

export async function createOfficeServiceRecord(input: OfficeServiceRecordInput) {
  const supabase = getSupabaseClient()
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('office_service_records')
    .insert({
      service_item_id: nullIfBlank(input.serviceItemId),
      name: input.name,
      quantity: input.quantity,
      client_id: nullIfBlank(input.clientId),
      record_date: input.recordDate,
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw new Error('Falha ao registrar servico.')
  return data
}

export async function createOfficeCashClosing(input: OfficeCashClosingInput) {
  const supabase = getSupabaseClient()
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('office_cash_closings')
    .insert({
      closing_date: input.closingDate,
      total_income: input.totalIncome,
      total_expense: input.totalExpense,
      balance: input.balance,
      notes: nullIfBlank(input.notes),
      closed_by: userId,
    })
    .select()
    .single()

  if (error) throw new Error('Falha ao fechar caixa.')
  return data
}

function readString(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function readNumber(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'number') return value
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value.replace(',', '.'))
      if (!Number.isNaN(parsed)) return parsed
    }
  }
  return 0
}

export async function importCashControlJson(payload: CashControlJson) {
  const supabase = getSupabaseClient()
  const userId = await getUserId()
  const clientRows = (payload.clients ?? []).map((client) => ({
    name: readString(client, ['name', 'nome', 'clientName']) || 'Cliente importado',
    phone: nullIfBlank(readString(client, ['phone', 'telefone', 'whatsapp'])),
    email: nullIfBlank(readString(client, ['email'])),
    document: nullIfBlank(readString(client, ['document', 'documento', 'cpf', 'cnpj'])),
    address: nullIfBlank(readString(client, ['address', 'endereco'])),
    notes: nullIfBlank(readString(client, ['notes', 'notas', 'observacoes'])),
    origin: 'escritorio',
    created_by: userId,
  }))

  const serviceItemRows = (payload.serviceItems ?? payload.services ?? []).map((service) => ({
    name: readString(service, ['name', 'nome', 'title', 'titulo']) || 'Servico importado',
    default_price: readNumber(service, ['defaultPrice', 'price', 'preco', 'valor']),
  }))

  const transactionRows = (payload.transactions ?? []).map((transaction) => ({
    type: readString(transaction, ['type', 'tipo']) === 'expense' ? 'expense' : 'income',
    amount: readNumber(transaction, ['amount', 'valor', 'total']),
    quantity: readNumber(transaction, ['quantity', 'quantidade']) || null,
    description: readString(transaction, ['description', 'descricao', 'serviceName', 'servico']) || 'Transacao importada',
    tags: [],
    transaction_date: readString(transaction, ['transactionDate', 'date', 'data']) || new Date().toISOString().slice(0, 10),
    payment_method: readString(transaction, ['paymentMethod', 'pagamento']) || 'other',
    created_by: userId,
  }))

  const recordRows = (payload.serviceRecords ?? []).map((record) => ({
    name: readString(record, ['name', 'nome', 'serviceName', 'servico']) || 'Servico importado',
    quantity: readNumber(record, ['quantity', 'quantidade']) || 1,
    record_date: readString(record, ['recordDate', 'date', 'data']) || new Date().toISOString().slice(0, 10),
    created_by: userId,
  }))

  const inserted = {
    clients: 0,
    serviceItems: 0,
    transactions: 0,
    serviceRecords: 0,
  }

  if (clientRows.length) {
    const { error } = await supabase.from('clients').insert(clientRows)
    if (error) throw new Error('Falha ao importar clientes.')
    inserted.clients = clientRows.length
  }

  if (serviceItemRows.length) {
    const { error } = await supabase.from('office_service_items').insert(serviceItemRows)
    if (error) throw new Error('Falha ao importar catalogo de servicos.')
    inserted.serviceItems = serviceItemRows.length
  }

  if (transactionRows.length) {
    const { error } = await supabase.from('office_transactions').insert(transactionRows)
    if (error) throw new Error('Falha ao importar transacoes.')
    inserted.transactions = transactionRows.length
  }

  if (recordRows.length) {
    const { error } = await supabase.from('office_service_records').insert(recordRows)
    if (error) throw new Error('Falha ao importar registros de servico.')
    inserted.serviceRecords = recordRows.length
  }

  return inserted
}

export async function updateOfficeServiceItem(id: string, name: string, defaultPrice: number) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('office_service_items')
    .update({ name, default_price: defaultPrice })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error('Falha ao atualizar serviço no catálogo.')
  return data
}

export async function deleteOfficeServiceItem(id: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('office_service_items')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Falha ao deletar serviço do catálogo.')
}

export async function updateOfficeServiceRecord(id: string, quantity: number) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('office_service_records')
    .update({ quantity })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error('Falha ao atualizar quantidade do serviço.')
  return data
}

export async function deleteOfficeServiceRecord(id: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('office_service_records')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Falha ao deletar registro de serviço.')
}

export async function updateOfficeClient(id: string, input: OfficeClientInput) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('clients')
    .update({
      name: input.name,
      phone: nullIfBlank(input.phone),
      email: nullIfBlank(input.email),
      document: nullIfBlank(input.document),
      address: nullIfBlank(input.address),
      notes: nullIfBlank(input.notes),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error('Falha ao atualizar cliente.')
  return data
}

export async function deleteOfficeClient(id: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Falha ao excluir cliente.')
}

export async function deleteClientTask(id: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('client_tasks')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Falha ao excluir tarefa.')
}

export async function updateClientTask(id: string, text: string, dueDate: string | null) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('client_tasks')
    .update({ text, due_date: nullIfBlank(dueDate || undefined) })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error('Falha ao atualizar tarefa.')
  return data
}
