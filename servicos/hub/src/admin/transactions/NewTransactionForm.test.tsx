import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { NewTransactionForm } from './NewTransactionForm'
import { SERVICE_CATEGORIES } from './transaction-schema'

describe('NewTransactionForm', () => {
  it('renderiza todos os campos obrigatórios com labels corretos', () => {
    render(<NewTransactionForm />)
    expect(screen.getByLabelText(/Data do atendimento/i)).toBeDefined()
    expect(screen.getByLabelText(/Categoria/i)).toBeDefined()
    expect(screen.getByLabelText(/Serviço realizado/i)).toBeDefined()
    expect(screen.getByLabelText(/Valor cobrado/i)).toBeDefined()
    expect(screen.getByText(/Forma de pagamento/i)).toBeDefined()
  })

  it('data padrão é a data de hoje no formato YYYY-MM-DD', () => {
    render(<NewTransactionForm />)
    const today = new Date().toISOString().split('T')[0]!
    const dateInput = screen.getByLabelText(/Data do atendimento/i) as HTMLInputElement
    expect(dateInput.value).toBe(today)
  })

  it('erro ao submeter sem preencher nenhum campo → role="alert" visível', async () => {
    render(<NewTransactionForm />)
    // limpa a data para forçar erro
    const dateInput = screen.getByLabelText(/Data do atendimento/i)
    fireEvent.change(dateInput, { target: { value: '' } })
    fireEvent.submit(screen.getByRole('form', { name: /Registrar atendimento/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined()
    })
  })

  it('select de categoria tem as 10 opções definidas em SERVICE_CATEGORIES', () => {
    render(<NewTransactionForm />)
    const select = screen.getByLabelText(/Categoria/i) as HTMLSelectElement
    // +1 para o placeholder "Selecione..."
    expect(select.options.length).toBe(SERVICE_CATEGORIES.length + 1)
    SERVICE_CATEGORIES.forEach((cat) => {
      expect(screen.getByRole('option', { name: cat })).toBeDefined()
    })
  })

  it('radios de pagamento: Dinheiro / Pix / Cartão / Outro presentes', () => {
    render(<NewTransactionForm />)
    expect(screen.getByLabelText('Dinheiro')).toBeDefined()
    expect(screen.getByLabelText('Pix')).toBeDefined()
    expect(screen.getByLabelText('Cartão')).toBeDefined()
    expect(screen.getByLabelText('Outro')).toBeDefined()
  })

  it('onSubmit chamado com Transaction correto ao preencher dados válidos', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<NewTransactionForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Categoria/i), {
      target: { value: 'MEI' },
    })
    fireEvent.change(screen.getByLabelText(/Serviço realizado/i), {
      target: { value: 'Abertura MEI' },
    })
    fireEvent.change(screen.getByLabelText(/Valor cobrado/i), {
      target: { value: '50' },
    })
    fireEvent.click(screen.getByLabelText('Dinheiro'))
    fireEvent.submit(screen.getByRole('form', { name: /Registrar atendimento/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
      const arg = onSubmit.mock.calls[0][0] as Record<string, unknown>
      expect(arg.serviceName).toBe('Abertura MEI')
      expect(arg.category).toBe('MEI')
      expect(arg.amount).toBe(50)
      expect(arg.paymentMethod).toBe('dinheiro')
    })
  })

  it('botão "Registrar atendimento" com disabled=true quando isSubmitting=true', () => {
    render(<NewTransactionForm isSubmitting />)
    const btn = screen.getByRole('button', { name: /Salvando.../i })
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('botão "Cancelar" chama onCancel', () => {
    const onCancel = vi.fn()
    render(<NewTransactionForm onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
