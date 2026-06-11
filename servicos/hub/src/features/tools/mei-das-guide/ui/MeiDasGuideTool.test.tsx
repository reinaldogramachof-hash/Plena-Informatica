import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MeiDasGuideTool } from './MeiDasGuideTool'

describe('MeiDasGuideTool', () => {
  it('renderiza o heading "Guia DAS MEI"', () => {
    render(<MeiDasGuideTool />)
    expect(
      screen.getByRole('heading', { name: /Guia DAS MEI/i }),
    ).toBeDefined()
  })

  it('aviso editorial obrigatório está presente no DOM', () => {
    render(<MeiDasGuideTool />)
    expect(
      screen.getByText(/Este guia é apenas orientativo/i),
    ).toBeDefined()
  })

  it('radio de atividade com as 4 opções está presente', () => {
    render(<MeiDasGuideTool />)
    expect(screen.getByText('Comércio')).toBeDefined()
    expect(screen.getByText('Serviços')).toBeDefined()
    expect(screen.getByText('Comércio e Serviços')).toBeDefined()
    expect(screen.getByText('Transporte de passageiros')).toBeDefined()
    const radios = screen.getAllByRole('radio')
    expect(radios.length).toBeGreaterThanOrEqual(4)
  })

  it('checkbox "Tenho empregado registrado" está presente', () => {
    render(<MeiDasGuideTool />)
    expect(
      screen.getByRole('checkbox', { name: /Tenho empregado registrado/i }),
    ).toBeDefined()
  })

  it('12 checkboxes de meses estão presentes', () => {
    render(<MeiDasGuideTool />)
    const meses = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ]
    meses.forEach((mes) => {
      expect(screen.getByRole('checkbox', { name: mes })).toBeDefined()
    })
  })

  it('botão "Imprimir organização" está presente', () => {
    render(<MeiDasGuideTool />)
    expect(
      screen.getByRole('button', { name: /Imprimir organização/i }),
    ).toBeDefined()
  })

  it('aviso de privacidade sobre sessão local está presente', () => {
    render(<MeiDasGuideTool />)
    expect(
      screen.getByText(/Suas marcações ficam somente neste navegador/i),
    ).toBeDefined()
  })

  it('clicar em um mês o marca como pago', () => {
    render(<MeiDasGuideTool />)
    const janeiroCheckbox = screen.getByRole('checkbox', { name: 'Janeiro' })
    fireEvent.click(janeiroCheckbox)
    expect(screen.getByText(/1 de 12 meses marcados/i)).toBeDefined()
  })
})
