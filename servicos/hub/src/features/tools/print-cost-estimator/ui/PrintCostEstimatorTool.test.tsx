import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PrintCostEstimatorTool } from './PrintCostEstimatorTool'

// ── testes de regressao ───────────────────────────────────────────────────────
describe('PrintCostEstimatorTool', () => {
  it('renderiza o heading com acentuação correta', () => {
    render(<PrintCostEstimatorTool />)
    expect(
      screen.getByRole('heading', { name: /Calculadora de Impressão/i }),
    ).toBeDefined()
  })

  it('exibe o banner de privacidade', () => {
    render(<PrintCostEstimatorTool />)
    expect(
      screen.getByText(/Processamento 100% local/i),
    ).toBeDefined()
  })

  it('inputs de paginas em preto e colorido estao presentes', () => {
    render(<PrintCostEstimatorTool />)
    expect(
      screen.getByRole('spinbutton', { name: /Páginas em preto por mês/i }),
    ).toBeDefined()
    expect(
      screen.getByRole('spinbutton', { name: /Páginas coloridas por mês/i }),
    ).toBeDefined()
  })

  it('secao de resultado .pce-result esta presente no DOM', () => {
    const { container } = render(<PrintCostEstimatorTool />)
    const result = container.querySelector('.pce-result')
    expect(result).toBeTruthy()
  })

  it('aviso editorial esta presente', () => {
    render(<PrintCostEstimatorTool />)
    expect(
      screen.getByText(/Esta calculadora é apenas orientativa/i),
    ).toBeDefined()
  })

  it('botao "Imprimir tela" esta presente', () => {
    render(<PrintCostEstimatorTool />)
    expect(
      screen.getByRole('button', { name: /Imprimir tela/i }),
    ).toBeDefined()
  })

  // ── testes novos ──────────────────────────────────────────────────────────────
  it('custo Plena e R$ 0,00 quando nao ha paginas', () => {
    const { container } = render(<PrintCostEstimatorTool />)
    const plenaCard = container.querySelector('.pce-result-card--plena')
    expect(plenaCard?.textContent).toContain('R$\xa00,00')
  })

  it('custo Plena aumenta ao digitar paginas em preto', () => {
    render(<PrintCostEstimatorTool />)
    const inputBlack = screen.getByRole('spinbutton', { name: /Páginas em preto por mês/i })
    fireEvent.change(inputBlack, { target: { value: '10' } })
    // 10 paginas pretas × R$ 3,00 = R$ 30,00
    expect(screen.getAllByText(/30,00/i).length).toBeGreaterThan(0)
  })

  it('custo Plena soma preto e colorido separadamente', () => {
    render(<PrintCostEstimatorTool />)
    const inputBlack = screen.getByRole('spinbutton', { name: /Páginas em preto por mês/i })
    const inputColor = screen.getByRole('spinbutton', { name: /Páginas coloridas por mês/i })
    fireEvent.change(inputBlack, { target: { value: '10' } })
    fireEvent.change(inputColor, { target: { value: '5' } })
    // 10×3 + 5×4 = 30 + 20 = R$ 50,00
    expect(screen.getAllByText(/50,00/i).length).toBeGreaterThan(0)
  })

  it('exibe tabela de precos Plena no card', () => {
    render(<PrintCostEstimatorTool />)
    expect(screen.getByText(/Preto:/i)).toBeDefined()
    expect(screen.getByText(/Colorido:/i)).toBeDefined()
  })

  it('exibe conclusao (verdict) apos digitar paginas', () => {
    render(<PrintCostEstimatorTool />)
    const inputBlack = screen.getByRole('spinbutton', { name: /Páginas em preto por mês/i })
    fireEvent.change(inputBlack, { target: { value: '100' } })
    // Com paginas e sem custo proprio, proprio = 0, plena = 300 => economy
    const verdict = screen.getByLabelText(/Conclusão da comparação/i)
    expect(verdict).toBeDefined()
    expect(verdict.textContent).toMatch(/economiz|barata|iguais/i)
  })

  it('disclaimer menciona acabamento e encadernacao', () => {
    render(<PrintCostEstimatorTool />)
    expect(screen.getByText(/acabamento/i)).toBeDefined()
  })

  it('exibe a data de ultima atualizacao de precos no card Plena', () => {
    render(<PrintCostEstimatorTool />)
    expect(screen.getByText(/Preços conferidos em 12\/06\/2026/i)).toBeInTheDocument()
  })

  it('exibe o disclaimer atualizado com a data de precos', () => {
    render(<PrintCostEstimatorTool />)
    expect(
      screen.getByText(/Cálculo baseado nos valores informados e nos preços da Plena conferidos em 12\/06\/2026/i)
    ).toBeInTheDocument()
  })

  it('mantém o download indisponível enquanto nenhum volume foi informado', () => {
    render(<PrintCostEstimatorTool />)

    expect(
      screen.getByRole('button', { name: /Baixar comparativo PDF/i }),
    ).toBeDisabled()
    expect(screen.getByText(/Informe ao menos uma página/i)).toBeInTheDocument()
  })

  it('libera o download quando há ao menos uma página', () => {
    render(<PrintCostEstimatorTool />)

    fireEvent.change(
      screen.getByRole('spinbutton', { name: /Páginas em preto por mês/i }),
      { target: { value: '1' } },
    )

    expect(
      screen.getByRole('button', { name: /Baixar comparativo PDF/i }),
    ).toBeEnabled()
  })

  it('avisa de forma acessível quando um valor negativo é informado', () => {
    render(<PrintCostEstimatorTool />)

    fireEvent.change(
      screen.getByRole('spinbutton', { name: /Páginas em preto por mês/i }),
      { target: { value: '-1' } },
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      /Use apenas valores iguais ou maiores que zero/i,
    )
    expect(
      screen.getByRole('button', { name: /Baixar comparativo PDF/i }),
    ).toBeDisabled()
  })
})
