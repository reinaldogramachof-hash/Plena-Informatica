import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ImagesToPdfTool } from './ImagesToPdfTool'

describe('ImagesToPdfTool', () => {
  it('renders the tool with title and local processing notice', () => {
    render(<ImagesToPdfTool />)

    expect(
      screen.getByRole('heading', { name: 'Imagens para PDF' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Processamento 100% local/)).toBeInTheDocument()
    expect(
      screen.getByText(/nenhum arquivo sai do seu dispositivo/),
    ).toBeInTheDocument()
  })

  it('has the generate button disabled when no images are selected', () => {
    render(<ImagesToPdfTool />)

    const button = screen.getByRole('button', { name: 'Gerar PDF' })
    expect(button).toBeDisabled()
  })

  it('shows an error for an invalid file type', () => {
    render(<ImagesToPdfTool />)

    const input = screen.getByLabelText(/Adicionar imagens/)
    const gifFile = new File(['gif'], 'animation.gif', { type: 'image/gif' })

    fireEvent.change(input, { target: { files: [gifFile] } })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Apenas imagens JPEG e PNG são aceitas',
    )
  })

  it('shows an error when too many files are added', () => {
    render(<ImagesToPdfTool />)

    const input = screen.getByLabelText(/Adicionar imagens/)

    // Create 21 files (1 over limit)
    const files = Array.from({ length: 21 }, (_, i) =>
      new File(['x'], `img${i}.jpg`, { type: 'image/jpeg' }),
    )

    fireEvent.change(input, { target: { files } })

    expect(screen.getByRole('alert')).toHaveTextContent(
      /Máximo de 20 imagens/,
    )
  })

  it('renders orientation and margin selects', () => {
    render(<ImagesToPdfTool />)

    expect(screen.getByLabelText('Orientação')).toBeInTheDocument()
    expect(screen.getByLabelText('Margem')).toBeInTheDocument()
  })
})
