import { getSupabaseClient } from '../supabase-client'
import type { Transaction } from './transaction-schema'

export interface TransactionRecord extends Transaction {
  id: string
  created_at: string
  user_id: string
}

interface DbRow {
  id: string
  service_date: string
  category: string
  service_name: string
  amount: number
  payment_method: string
  notes: string | null
  created_at: string
  user_id: string
}

function rowToRecord(row: DbRow): TransactionRecord {
  return {
    id: row.id,
    serviceDate: row.service_date,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    category: row.category as any,
    serviceName: row.service_name,
    amount: row.amount,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paymentMethod: row.payment_method as any,
    notes: row.notes ?? undefined,
    created_at: row.created_at,
    user_id: row.user_id,
  }
}

export async function getTransactions(): Promise<TransactionRecord[]> {
  const supabase = getSupabaseClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('transactions')
    .select('*')
    .order('service_date', { ascending: false })
    .order('created_at', { ascending: false }) as { data: DbRow[] | null; error: unknown }

  if (error) {
    console.error('Error fetching transactions:', error)
    throw new Error('Falha ao carregar atendimentos.')
  }

  return (data || []).map(rowToRecord)
}

export async function addTransaction(
  transaction: Transaction,
): Promise<TransactionRecord> {
  const supabase = getSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Usuário não autenticado.')
  }

  const amountNumber = transaction.amount

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('transactions')
    .insert({
      service_date: transaction.serviceDate,
      category: transaction.category,
      service_name: transaction.serviceName,
      amount: amountNumber,
      payment_method: transaction.paymentMethod,
      notes: transaction.notes || null,
      user_id: session.user.id,
    })
    .select()
    .single() as { data: DbRow | null; error: unknown }

  if (error) {
    console.error('Error adding transaction:', error)
    throw new Error('Falha ao registrar atendimento.')
  }

  return rowToRecord(data!)
}

export async function deleteTransaction(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('transactions').delete().eq('id', id) as { error: unknown }
  if (error) {
    console.error('Error deleting transaction:', error)
    throw new Error('Falha ao excluir atendimento.')
  }
}
