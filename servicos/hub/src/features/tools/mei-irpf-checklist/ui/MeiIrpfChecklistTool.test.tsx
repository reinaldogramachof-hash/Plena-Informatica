import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MeiIrpfChecklistTool } from './MeiIrpfChecklistTool'

vi.mock('../domain/create-checklist-pdf', () => ({
  createChecklistPdf: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
}))

describe('MeiIrpfChecklistTool', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })
  it('exibe os 3 avisos obrigatórios na tela inicial', () => {
    render(<MeiIrpfChecklistTool />)

    expect(
      screen.getByText(/não substitui orientação contábil, fiscal ou jurídica/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/não informe senhas, códigos de acesso, tokens/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/permanecem somente neste navegador/i),
    ).toBeInTheDocument()
  })

  it('exibe os botões de escolha MEI e IRPF na etapa 1', () => {
    render(<MeiIrpfChecklistTool />)

    expect(screen.getByRole('button', { name: /MEI/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /IRPF/i })).toBeInTheDocument()
  })

  it('seleciona MEI e avança para escolha de cenário', () => {
    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /MEI/i }))

    expect(screen.getByText(/Abertura de MEI/i)).toBeInTheDocument()
    expect(screen.getByText(/Declaração Anual do MEI/i)).toBeInTheDocument()
  })

  it('seleciona IRPF e avança para perguntas', () => {
    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /IRPF/i }))

    expect(
      screen.getByText(/rendimentos de emprego ou aposentadoria/i),
    ).toBeInTheDocument()
  })

  it('seleciona cenário MEI e avança para perguntas', () => {
    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /MEI/i }))
    fireEvent.click(screen.getByText(/Abertura de MEI/i))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))

    expect(screen.getByText(/conta GOV\.br/i)).toBeInTheDocument()
  })

  it('mantém o avanço bloqueado até selecionar um cenário MEI', () => {
    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /MEI/i }))

    expect(
      screen.getByRole('button', { name: /Continuar/i }),
    ).toBeDisabled()
  })

  it('permite voltar entre etapas', () => {
    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /MEI/i }))
    fireEvent.click(screen.getByRole('button', { name: /Voltar/i }))

    // Voltou para etapa 1
    expect(screen.getByRole('button', { name: /MEI/i })).toBeInTheDocument()
  })

  it('mostra resultado agrupado após responder perguntas MEI', () => {
    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /MEI/i }))
    fireEvent.click(screen.getByText(/Abertura de MEI/i))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))

    // Deve mostrar o checklist com agrupamento por categoria
    expect(screen.getByText(/Identificação pessoal/i)).toBeInTheDocument()
  })

  it('permite marcar itens do checklist', () => {
    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /MEI/i }))
    fireEvent.click(screen.getByText(/Abertura de MEI/i))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThan(0)

    fireEvent.click(checkboxes[0])
    expect(checkboxes[0]).toBeChecked()

    fireEvent.click(checkboxes[0])
    expect(checkboxes[0]).not.toBeChecked()
  })

  it('atualiza o progresso ao marcar itens', () => {
    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /MEI/i }))
    fireEvent.click(screen.getByText(/Abertura de MEI/i))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))

    const progressEl = screen.getByRole('status')
    expect(progressEl).toBeInTheDocument()
    expect(progressEl.textContent).toMatch(/0 de \d+ itens/i)

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    expect(screen.getByRole('status').textContent).toMatch(/1 de \d+ itens/i)
  })

  it('reinicia o fluxo ao clicar em Reiniciar se o usuário confirmar', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /MEI/i }))
    fireEvent.click(screen.getByText(/Abertura de MEI/i))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))

    fireEvent.click(screen.getByRole('button', { name: /Reiniciar/i }))

    expect(confirmSpy).toHaveBeenCalled()
    // Voltou para etapa 1
    expect(screen.getByRole('button', { name: /MEI/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /IRPF/i })).toBeInTheDocument()
    confirmSpy.mockRestore()
  })

  it('não reinicia o fluxo ao clicar em Reiniciar se o usuário cancelar', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /MEI/i }))
    fireEvent.click(screen.getByText(/Abertura de MEI/i))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))

    fireEvent.click(screen.getByRole('button', { name: /Reiniciar/i }))

    expect(confirmSpy).toHaveBeenCalled()
    // Continua no resultado
    expect(screen.getByText(/Seu checklist personalizado/i)).toBeInTheDocument()
    confirmSpy.mockRestore()
  })

  it('chama window.print() ao clicar em Imprimir Checklist', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => undefined)

    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /MEI/i }))
    fireEvent.click(screen.getByText(/Abertura de MEI/i))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))

    fireEvent.click(
      screen.getByRole('button', { name: /Imprimir Checklist/i }),
    )
    expect(printSpy).toHaveBeenCalledTimes(1)

    printSpy.mockRestore()
  })

  it('baixa PDF com sucesso ao clicar em Baixar PDF', async () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url')
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)

    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /MEI/i }))
    fireEvent.click(screen.getByText(/Abertura de MEI/i))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))

    const downloadBtn = screen.getByRole('button', { name: /Baixar PDF/i })
    fireEvent.click(downloadBtn)

    await vi.waitFor(() => {
      expect(createObjectURLSpy).toHaveBeenCalled()
    })
    expect(revokeObjectURLSpy).toHaveBeenCalled()

    createObjectURLSpy.mockRestore()
    revokeObjectURLSpy.mockRestore()
  })

  it('não solicita dados pessoais sensíveis (CPF, CNPJ, senha, token)', () => {
    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /MEI/i }))
    fireEvent.click(screen.getByText(/Abertura de MEI/i))
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))

    // Não deve haver inputs de text/password solicitando dados sensíveis
    const inputs = screen.queryAllByRole('textbox')
    for (const input of inputs) {
      const label = input.getAttribute('aria-label') ?? ''
      expect(label.toLowerCase()).not.toContain('cpf')
      expect(label.toLowerCase()).not.toContain('cnpj')
      expect(label.toLowerCase()).not.toContain('senha')
      expect(label.toLowerCase()).not.toContain('token')
    }

    const passwordInputs = document.querySelectorAll('input[type="password"]')
    expect(passwordInputs.length).toBe(0)
  })

  it('exibe indicador de etapas', () => {
    render(<MeiIrpfChecklistTool />)

    // O indicador de etapas deve estar presente
    const stepIndicator = document.querySelector('[aria-current="step"]')
    expect(stepIndicator).toBeTruthy()
  })

  it('exibe perguntas condicionais de IRPF e gera checklist personalizado', () => {
    render(<MeiIrpfChecklistTool />)

    fireEvent.click(screen.getByRole('button', { name: /IRPF/i }))

    // Responde "Sim" para dependentes
    const dependentesLabel = screen.getByText(/possui dependentes/i)
    const fieldset = dependentesLabel.closest('fieldset')
    expect(fieldset).toBeTruthy()
    const simButton = within(fieldset!).getByRole('button', { name: /Sim/i })
    fireEvent.click(simButton)

    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))

    // No resultado deve aparecer a categoria Dependentes como título de grupo
    expect(screen.getByRole('heading', { name: /Dependentes/i })).toBeInTheDocument()
  })
})
