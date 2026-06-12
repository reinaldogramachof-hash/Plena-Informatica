import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LabelGeneratorTool } from './LabelGeneratorTool'

// ── mocks de URL ──────────────────────────────────────────────────────────────
beforeEach(() => {
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn().mockReturnValue('blob:test-url'),
    revokeObjectURL: vi.fn(),
  })
})
afterEach(() => {
  vi.unstubAllGlobals()
})

// ── helper ────────────────────────────────────────────────────────────────────
function fillTextarea(value: string) {
  const textarea = screen.getByRole('textbox', {
    name: /Conteudo das etiquetas, uma por linha/i,
  })
  fireEvent.change(textarea, { target: { value } })
}

// ── testes de regressao ───────────────────────────────────────────────────────
describe('LabelGeneratorTool', () => {
  it('renderiza o heading "Gerador de Etiquetas"', () => {
    render(<LabelGeneratorTool />)
    expect(
      screen.getByRole('heading', { name: /Gerador de Etiquetas/i }),
    ).toBeDefined()
  })

  it('exibe o banner de privacidade', () => {
    render(<LabelGeneratorTool />)
    expect(
      screen.getByText(/Processamento 100% local/i),
    ).toBeDefined()
  })

  it('textarea de conteudo esta presente', () => {
    render(<LabelGeneratorTool />)
    expect(
      screen.getByRole('textbox', {
        name: /Conteudo das etiquetas, uma por linha/i,
      }),
    ).toBeDefined()
  })

  it('botao "Gerar PDF de etiquetas" esta desabilitado sem conteudo', () => {
    render(<LabelGeneratorTool />)
    const btn = screen.getByRole('button', { name: /Gerar PDF de etiquetas/i })
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('digitar texto na textarea conta as etiquetas corretamente', () => {
    render(<LabelGeneratorTool />)
    fillTextarea('Etiqueta 1\nEtiqueta 2\nEtiqueta 3')
    expect(screen.getByText(/3 etiquetas/i)).toBeDefined()
  })

  it('select de layout esta presente com as 3 opcoes', () => {
    render(<LabelGeneratorTool />)
    const select = screen.getByRole('combobox', { name: /Layout da folha/i })
    const options = (select as HTMLSelectElement).options
    expect(options.length).toBe(3)
    expect(options[0]!.value).toBe('2x6')
    expect(options[1]!.value).toBe('3x9')
    expect(options[2]!.value).toBe('4x13')
  })

  it('previa .lg-preview esta presente no DOM', () => {
    const { container } = render(<LabelGeneratorTool />)
    const preview = container.querySelector('.lg-preview')
    expect(preview).toBeTruthy()
  })

  // ── testes novos ─────────────────────────────────────────────────────────────
  it('botao e habilitado apos digitar ao menos uma etiqueta', () => {
    render(<LabelGeneratorTool />)
    fillTextarea('Maria')
    const btn = screen.getByRole('button', { name: /Gerar PDF de etiquetas/i })
    expect((btn as HTMLButtonElement).disabled).toBe(false)
  })

  it('chama generatePdf com labels, layout e withBorder corretos', async () => {
    const spy = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5]))
    render(<LabelGeneratorTool generatePdf={spy} />)
    fillTextarea('Joao\nMaria')
    fireEvent.click(screen.getByRole('button', { name: /Gerar PDF de etiquetas/i }))
    await vi.waitFor(() => expect(spy).toHaveBeenCalledOnce())
    expect(spy).toHaveBeenCalledWith(['Joao', 'Maria'], '2x6', false)
  })

  it('aciona createObjectURL apos gerar o PDF', async () => {
    const spy = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5]))
    render(<LabelGeneratorTool generatePdf={spy} />)
    fillTextarea('Teste')
    fireEvent.click(screen.getByRole('button', { name: /Gerar PDF de etiquetas/i }))
    await vi.waitFor(() => expect(URL.createObjectURL).toHaveBeenCalledOnce())
  })

  it('aciona revokeObjectURL apos download', async () => {
    const spy = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5]))
    render(<LabelGeneratorTool generatePdf={spy} />)
    fillTextarea('Teste')
    fireEvent.click(screen.getByRole('button', { name: /Gerar PDF de etiquetas/i }))
    await vi.waitFor(() => expect(URL.revokeObjectURL).toHaveBeenCalledOnce())
  })

  it('exibe mensagem de erro acessivel quando generatePdf lanca excecao', async () => {
    const spy = vi.fn().mockRejectedValue(new Error('Falha no PDF'))
    render(<LabelGeneratorTool generatePdf={spy} />)
    fillTextarea('Teste')
    fireEvent.click(screen.getByRole('button', { name: /Gerar PDF de etiquetas/i }))
    await vi.waitFor(() => screen.getByRole('alert'))
    expect(screen.getByRole('alert').textContent).toContain('Falha no PDF')
  })

  it('passa withBorder=true quando checkbox esta marcado', async () => {
    const spy = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5]))
    render(<LabelGeneratorTool generatePdf={spy} />)
    const checkbox = screen.getByRole('checkbox', { name: /Borda nas etiquetas/i })
    fireEvent.click(checkbox)
    fillTextarea('Teste')
    fireEvent.click(screen.getByRole('button', { name: /Gerar PDF de etiquetas/i }))
    await vi.waitFor(() => expect(spy).toHaveBeenCalledOnce())
    expect(spy).toHaveBeenCalledWith(['Teste'], '2x6', true)
  })

  it('passa layout 3x9 quando selecionado', async () => {
    const spy = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5]))
    render(<LabelGeneratorTool generatePdf={spy} />)
    const select = screen.getByRole('combobox', { name: /Layout da folha/i })
    fireEvent.change(select, { target: { value: '3x9' } })
    fillTextarea('Teste')
    fireEvent.click(screen.getByRole('button', { name: /Gerar PDF de etiquetas/i }))
    await vi.waitFor(() => expect(spy).toHaveBeenCalledOnce())
    expect(spy).toHaveBeenCalledWith(['Teste'], '3x9', false)
  })
})
