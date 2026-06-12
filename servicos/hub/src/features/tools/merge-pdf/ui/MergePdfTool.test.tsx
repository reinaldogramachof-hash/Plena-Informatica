import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MergePdfTool } from './MergePdfTool'

// Mock read-pdf-metadata to avoid pdf-lib dynamic import in tests
vi.mock('../domain/read-pdf-metadata', () => ({
  readPageCount: vi.fn().mockResolvedValue(1),
}))

describe('MergePdfTool', () => {
  it('renders the component with title and local processing notice', () => {
    render(<MergePdfTool />)

    expect(
      screen.getByRole('heading', { name: 'Unificador de PDFs' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Processamento 100% local/)).toBeInTheDocument()
    expect(
      screen.getByText(/nenhum arquivo sai do seu dispositivo/),
    ).toBeInTheDocument()
  })

  it('has the "Unificar PDFs" button disabled initially (no files)', () => {
    render(<MergePdfTool />)

    const button = screen.getByRole('button', { name: 'Unificar PDFs' })
    expect(button).toBeDisabled()
  })

  it('shows error with role="alert" for invalid file type', () => {
    render(<MergePdfTool />)

    const input = screen.getByLabelText(/Adicionar arquivos PDF/)
    const txtFile = new File(['content'], 'doc.txt', { type: 'text/plain' })

    fireEvent.change(input, { target: { files: [txtFile] } })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Apenas arquivos PDF são aceitos',
    )
  })

  it('shows error for empty PDF file', () => {
    render(<MergePdfTool />)

    const input = screen.getByLabelText(/Adicionar arquivos PDF/)
    const emptyFile = new File([], 'empty.pdf', { type: 'application/pdf' })

    fireEvent.change(input, { target: { files: [emptyFile] } })

    expect(screen.getByRole('alert')).toHaveTextContent('está vazio')
  })

  it('renders page count label area in the DOM when a file is added', () => {
    render(<MergePdfTool />)

    const input = screen.getByLabelText(/Adicionar arquivos PDF/)
    const pdfFile = new File(['pdf-content'], 'document.pdf', {
      type: 'application/pdf',
    })

    fireEvent.change(input, { target: { files: [pdfFile] } })

    // The file meta area should be present (shows "carregando..." initially)
    expect(screen.getByText(/carregando\.\.\./)).toBeInTheDocument()
  })

  it('shows local processing notice', () => {
    render(<MergePdfTool />)

    const banner = screen.getByText(/Processamento 100% local/)
    expect(banner).toBeInTheDocument()
  })
})
