import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LabelGeneratorTool } from './LabelGeneratorTool'

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

  it('textarea de conteúdo está presente', () => {
    render(<LabelGeneratorTool />)
    expect(
      screen.getByRole('textbox', {
        name: /Conteúdo das etiquetas, uma por linha/i,
      }),
    ).toBeDefined()
  })

  it('botão "Gerar PDF de etiquetas" está desabilitado sem conteúdo', () => {
    render(<LabelGeneratorTool />)
    const btn = screen.getByRole('button', { name: /Gerar PDF de etiquetas/i })
    expect(btn).toBeDefined()
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('digitar texto na textarea conta as etiquetas corretamente', () => {
    render(<LabelGeneratorTool />)
    const textarea = screen.getByRole('textbox', {
      name: /Conteúdo das etiquetas, uma por linha/i,
    })
    fireEvent.change(textarea, {
      target: { value: 'Etiqueta 1\nEtiqueta 2\nEtiqueta 3' },
    })
    expect(screen.getByText(/3 etiquetas/i)).toBeDefined()
  })

  it('select de layout está presente com as 3 opções', () => {
    render(<LabelGeneratorTool />)
    const select = screen.getByRole('combobox', { name: /Layout da folha/i })
    expect(select).toBeDefined()
    const options = (select as HTMLSelectElement).options
    expect(options.length).toBe(3)
    expect(options[0]!.value).toBe('2x6')
    expect(options[1]!.value).toBe('3x9')
    expect(options[2]!.value).toBe('4x13')
  })

  it('prévia .lg-preview está presente no DOM', () => {
    const { container } = render(<LabelGeneratorTool />)
    const preview = container.querySelector('.lg-preview')
    expect(preview).toBeTruthy()
  })
})
