import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DeclarationBuilderTool } from './DeclarationBuilderTool'

describe('DeclarationBuilderTool', () => {
  it('shows five safe-use templates and organizes the form into sections', () => {
    render(<DeclarationBuilderTool />)

    expect(screen.getAllByRole('button', { name: /Usar modelo/ })).toHaveLength(5)
    expect(
      screen.getByRole('button', {
        name: 'Usar modelo Declaração de residência',
      }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByText('Indicado para')).toHaveLength(5)
    expect(screen.getAllByText('Não indicado para')).toHaveLength(5)
    expect(
      screen.getByRole('group', { name: 'Identificação' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: 'Informações da declaração' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('group', { name: 'Finalização' }),
    ).toBeInTheDocument()
  })

  it('shows the work and income controls when selecting that model', () => {
    render(<DeclarationBuilderTool />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Usar modelo Declaração de trabalho e renda',
      }),
    )

    expect(screen.getByLabelText('Natureza da atividade')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Período de referência da renda'),
    ).toBeInTheDocument()
  })

  it('warns that the minor authorization cannot be used for travel', () => {
    render(<DeclarationBuilderTool />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Usar modelo Autorização particular para atividade de menor',
      }),
    )

    expect(
      screen.getAllByText(/não deve ser usada para viagens/i).length,
    ).toBeGreaterThan(0)
  })

  it('explains why download is blocked until required fields are complete', () => {
    render(<DeclarationBuilderTool />)

    expect(screen.getByRole('button', { name: 'Baixar PDF' })).toBeDisabled()
    expect(
      screen.getByText(/preencha os campos obrigatórios para liberar/i),
    ).toBeInTheDocument()
  })

  it('generates and downloads a complete declaration', async () => {
    const generatePdf = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
    const createObjectURL = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:declaration')
    const revokeObjectURL = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => undefined)
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined)

    render(<DeclarationBuilderTool generatePdf={generatePdf} />)

    fireEvent.change(screen.getByLabelText('Nome completo'), {
      target: { value: 'Ana Silva' },
    })
    fireEvent.change(screen.getByLabelText('CPF'), {
      target: { value: '123.456.789-00' },
    })
    fireEvent.change(screen.getByLabelText('Endereço completo'), {
      target: { value: 'Rua Exemplo, 100' },
    })
    fireEvent.change(screen.getByLabelText('Cidade'), {
      target: { value: 'São José dos Campos' },
    })
    fireEvent.change(screen.getByLabelText('Data da assinatura'), {
      target: { value: '2026-06-10' },
    })

    const downloadButton = screen.getByRole('button', { name: 'Baixar PDF' })
    expect(downloadButton).toBeEnabled()
    fireEvent.click(downloadButton)

    await waitFor(() => {
      expect(generatePdf).toHaveBeenCalledTimes(1)
      expect(click).toHaveBeenCalled()
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:declaration')
    })

    click.mockRestore()
    createObjectURL.mockRestore()
    revokeObjectURL.mockRestore()
  })
})
