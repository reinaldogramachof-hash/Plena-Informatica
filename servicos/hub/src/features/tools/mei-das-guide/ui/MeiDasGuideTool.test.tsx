import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MeiDasGuideTool } from './MeiDasGuideTool'
import { INSS_MEI, ISS_MEI } from '../domain/das-values'

// ── testes de regressao ───────────────────────────────────────────────────────
describe('MeiDasGuideTool', () => {
  it('renderiza o heading "Guia DAS MEI"', () => {
    render(<MeiDasGuideTool />)
    expect(
      screen.getByRole('heading', { name: /Guia DAS MEI/i }),
    ).toBeDefined()
  })

  it('aviso editorial obrigatorio esta presente no DOM', () => {
    render(<MeiDasGuideTool />)
    expect(
      screen.getByText(/Este guia e apenas orientativo/i),
    ).toBeDefined()
  })

  it('radio de atividade com as 5 opcoes esta presente', () => {
    render(<MeiDasGuideTool />)
    expect(screen.getByText('Comercio')).toBeDefined()
    expect(screen.getByText('Servicos')).toBeDefined()
    expect(screen.getByText('Comercio e Servicos')).toBeDefined()
    expect(screen.getByText('Transporte de passageiros')).toBeDefined()
    expect(screen.getByText('Transporte autônomo de cargas')).toBeDefined()
    const radios = screen.getAllByRole('radio')
    expect(radios.length).toBeGreaterThanOrEqual(5)
  })

  it('12 checkboxes de meses estao presentes', () => {
    render(<MeiDasGuideTool />)
    const meses = [
      'Janeiro', 'Fevereiro', 'Marco', 'Abril',
      'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ]
    meses.forEach((mes) => {
      expect(screen.getByRole('checkbox', { name: mes })).toBeDefined()
    })
  })

  it('botao "Imprimir organizacao" esta presente', () => {
    render(<MeiDasGuideTool />)
    expect(
      screen.getByRole('button', { name: /Imprimir organização/i }),
    ).toBeDefined()
  })

  it('aviso de privacidade sobre sessao local esta presente', () => {
    render(<MeiDasGuideTool />)
    expect(
      screen.getByText(/Suas marcacoes ficam somente neste navegador/i),
    ).toBeDefined()
  })

  it('clicar em um mes o marca como pago', () => {
    render(<MeiDasGuideTool />)
    const janeiroCheckbox = screen.getByRole('checkbox', { name: 'Janeiro' })
    fireEvent.click(janeiroCheckbox)
    expect(screen.getByText(/1 de 12 meses marcados/i)).toBeDefined()
  })

  // ── testes novos ──────────────────────────────────────────────────────────────
  it('nao exibe tabela DAS antes de selecionar atividade', () => {
    const { container } = render(<MeiDasGuideTool />)
    expect(container.querySelector('.mdg-das-section')).toBeNull()
  })

  it('selecionar "Comercio" exibe componente INSS com valor real', () => {
    render(<MeiDasGuideTool />)
    const radio = screen.getByRole('radio', { name: /Comercio$/i })
    fireEvent.click(radio)
    expect(screen.getAllByText(/INSS/i).length).toBeGreaterThan(0)
    // Valor deve conter a parte numerica do INSS_MEI (81,05)
    expect(screen.getByText(/81/)).toBeDefined()
  })

  it('selecionar "Comercio" exibe ICMS e nao exibe ISS', () => {
    render(<MeiDasGuideTool />)
    fireEvent.click(screen.getByRole('radio', { name: /Comercio$/i }))
    expect(screen.getByText(/ICMS/i)).toBeDefined()
    expect(screen.queryByText(/\bISS\b/i)).toBeNull()
  })

  it('selecionar "Servicos" exibe ISS e nao exibe ICMS', () => {
    render(<MeiDasGuideTool />)
    fireEvent.click(screen.getByRole('radio', { name: /^Servicos$/i }))
    expect(screen.getByText(/\bISS\b/i)).toBeDefined()
    expect(screen.queryByText(/ICMS/i)).toBeNull()
  })

  it('selecionar "Comercio e Servicos" exibe INSS, ICMS e ISS', () => {
    render(<MeiDasGuideTool />)
    fireEvent.click(screen.getByRole('radio', { name: /Comercio e Servicos/i }))
    expect(screen.getAllByText(/INSS/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/ICMS/i)).toBeDefined()
    expect(screen.getByText(/\bISS\b/i)).toBeDefined()
  })

  it('nenhuma atividade exibe componente CPP', () => {
    const { rerender } = render(<MeiDasGuideTool />)
    for (const name of [/Comercio$/i, /^Servicos$/i, /Comercio e Servicos/i, /Transporte de passageiros/i, /Transporte autônomo de cargas/i]) {
      rerender(<MeiDasGuideTool />)
      const radio = screen.getByRole('radio', { name })
      fireEvent.click(radio)
      expect(screen.queryByText(/CPP/i)).toBeNull()
    }
  })

  it('placeholder {valor} nao aparece em nenhuma atividade', () => {
    const { rerender } = render(<MeiDasGuideTool />)
    for (const name of [/Comercio$/i, /^Servicos$/i, /Comercio e Servicos/i, /Transporte de passageiros/i, /Transporte autônomo de cargas/i]) {
      rerender(<MeiDasGuideTool />)
      fireEvent.click(screen.getByRole('radio', { name }))
      expect(screen.queryByText(/\{valor\}/i)).toBeNull()
    }
  })

  it('link do Portal do Empreendedor e navegavel com rel=noopener', () => {
    render(<MeiDasGuideTool />)
    const link = screen.getByRole('link', { name: /Portal do Empreendedor/i })
    expect(link.getAttribute('href')).toContain('gov.br')
    expect(link.getAttribute('rel')).toContain('noopener')
    expect(link.getAttribute('target')).toBe('_blank')
  })

  it('tabela exibe total correto para "Servicos" (INSS + ISS)', () => {
    render(<MeiDasGuideTool />)
    fireEvent.click(screen.getByRole('radio', { name: /^Servicos$/i }))
    const expectedTotal = (INSS_MEI + ISS_MEI).toLocaleString('pt-BR', {
      style: 'currency', currency: 'BRL', minimumFractionDigits: 2,
    })
    const normalizedExpected = expectedTotal.replace(/\u00a0/g, ' ').replace(/\u202f/g, ' ')
    expect(screen.getAllByText(normalizedExpected).length).toBeGreaterThan(0)
  })

  it('nao existe checkbox "Tenho empregado registrado"', () => {
    render(<MeiDasGuideTool />)
    expect(
      screen.queryByRole('checkbox', { name: /empregado/i }),
    ).toBeNull()
  })

  it('exibe fonte oficial na tabela apos selecionar atividade', () => {
    render(<MeiDasGuideTool />)
    fireEvent.click(screen.getByRole('radio', { name: /Comercio$/i }))
    expect(screen.getByRole('link', { name: /Ver fonte oficial/i })).toBeDefined()
  })

  it('selecionar "Transporte autônomo de cargas" exibe aviso e valores corretos', () => {
    render(<MeiDasGuideTool />)
    fireEvent.click(screen.getByRole('radio', { name: /Transporte autônomo de cargas/i }))
    expect(screen.getByText(/Atenção \(MEI Caminhoneiro\):/i)).toBeInTheDocument()
    expect(screen.getAllByText(/INSS/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/194,52/).length).toBe(2)

    const expectedTotal = (194.52 + 5.00).toLocaleString('pt-BR', {
      style: 'currency', currency: 'BRL', minimumFractionDigits: 2,
    })
    const normalizedExpected = expectedTotal.replace(/\u00a0/g, ' ').replace(/\u202f/g, ' ')
    expect(screen.getAllByText(normalizedExpected).length).toBeGreaterThan(0)
  })

})
