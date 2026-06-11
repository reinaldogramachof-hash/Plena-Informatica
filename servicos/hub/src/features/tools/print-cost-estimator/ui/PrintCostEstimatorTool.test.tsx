import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PrintCostEstimatorTool } from './PrintCostEstimatorTool'

describe('PrintCostEstimatorTool', () => {
  it('renderiza o heading "Calculadora de Impressão"', () => {
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

  it('inputs de páginas em preto e colorido estão presentes', () => {
    render(<PrintCostEstimatorTool />)
    expect(
      screen.getByRole('spinbutton', { name: /Páginas em preto por mês/i }),
    ).toBeDefined()
    expect(
      screen.getByRole('spinbutton', { name: /Páginas coloridas por mês/i }),
    ).toBeDefined()
  })

  it('seção de resultado .pce-result está presente no DOM', () => {
    const { container } = render(<PrintCostEstimatorTool />)
    const result = container.querySelector('.pce-result')
    expect(result).toBeTruthy()
  })

  it('aviso editorial está presente', () => {
    render(<PrintCostEstimatorTool />)
    expect(
      screen.getByText(/Esta calculadora é apenas orientativa/i),
    ).toBeDefined()
  })

  it('botão "Imprimir comparativo" está presente', () => {
    render(<PrintCostEstimatorTool />)
    expect(
      screen.getByRole('button', { name: /Imprimir comparativo/i }),
    ).toBeDefined()
  })
})
