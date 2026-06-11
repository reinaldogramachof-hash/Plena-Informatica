import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BusinessCardCreatorTool } from './BusinessCardCreatorTool'

describe('BusinessCardCreatorTool', () => {
  it('renderiza o heading "Gerador de Cartão de Visitas"', () => {
    render(<BusinessCardCreatorTool />)
    expect(
      screen.getByRole('heading', { name: /Gerador de Cartão de Visitas/i }),
    ).toBeDefined()
  })

  it('exibe o banner de privacidade', () => {
    render(<BusinessCardCreatorTool />)
    expect(
      screen.getByText(/Processamento 100% local/i),
    ).toBeDefined()
  })

  it('botão "Baixar como PDF" está desabilitado sem nome', () => {
    render(<BusinessCardCreatorTool />)
    const btn = screen.getByRole('button', { name: /Baixar como PDF/i })
    expect(btn).toBeDefined()
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('prévia do cartão está presente no DOM', () => {
    const { container } = render(<BusinessCardCreatorTool />)
    const preview = container.querySelector('.bcc-card-preview')
    expect(preview).toBeTruthy()
  })

  it('preencher nome exibe o nome na prévia', () => {
    render(<BusinessCardCreatorTool />)
    const input = screen.getByRole('textbox', { name: /Nome completo/i })
    fireEvent.change(input, { target: { value: 'Maria Silva' } })
    expect(screen.getByText('Maria Silva')).toBeDefined()
  })

  it('três opções de estilo disponíveis (Clássico, Moderno, Colorido)', () => {
    render(<BusinessCardCreatorTool />)
    const radios = screen.getAllByRole('radio')
    const styleLabels = ['Clássico', 'Moderno', 'Colorido']
    styleLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeDefined()
    })
    // Ao menos 3 radios de estilo presentes
    expect(radios.length).toBeGreaterThanOrEqual(3)
  })

  it('botão "Imprimir prévia" está presente', () => {
    render(<BusinessCardCreatorTool />)
    expect(
      screen.getByRole('button', { name: /Imprimir prévia/i }),
    ).toBeDefined()
  })
})
