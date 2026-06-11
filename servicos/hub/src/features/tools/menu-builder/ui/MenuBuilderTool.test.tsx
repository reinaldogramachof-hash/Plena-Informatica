import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MenuBuilderTool } from './MenuBuilderTool'

describe('MenuBuilderTool', () => {
  it('renderiza o heading "Gerador de Cardápio"', () => {
    render(<MenuBuilderTool />)
    expect(
      screen.getByRole('heading', { name: /Gerador de Cardápio/i }),
    ).toBeDefined()
  })

  it('exibe o banner de privacidade', () => {
    render(<MenuBuilderTool />)
    expect(
      screen.getByText(/Processamento 100% local/i),
    ).toBeDefined()
  })

  it('botão "Gerar cardápio em PDF" está presente e desabilitado inicialmente', () => {
    render(<MenuBuilderTool />)
    const btn = screen.getByRole('button', {
      name: /Gerar cardápio em PDF/i,
    })
    expect(btn).toBeDefined()
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('clicar em "Adicionar categoria" exibe input de nome de categoria', () => {
    render(<MenuBuilderTool />)
    const addBtn = screen.getByRole('button', { name: /Adicionar categoria/i })
    fireEvent.click(addBtn)
    expect(
      screen.getByRole('textbox', { name: /Nome da categoria 1/i }),
    ).toBeDefined()
  })

  it('campo "Nome do estabelecimento *" está presente no DOM', () => {
    render(<MenuBuilderTool />)
    expect(
      screen.getByRole('textbox', { name: /Nome do estabelecimento/i }),
    ).toBeDefined()
  })

  it('exibe aviso sobre impressão na Plena', () => {
    render(<MenuBuilderTool />)
    expect(
      screen.getByText(/Para impressão e plastificação profissional/i),
    ).toBeDefined()
  })
})
