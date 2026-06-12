import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { BusinessCardCreatorTool } from './BusinessCardCreatorTool'
import type { CardData, CardStyle } from '../domain/business-card-data'

// ── Mocks globais ─────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url')
  vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
})

const FAKE_BYTES = new Uint8Array([1, 2, 3, 4])

const mockGeneratePdf = vi.fn().mockResolvedValue(FAKE_BYTES) as unknown as (data: CardData, style: CardStyle) => Promise<Uint8Array>
const mockGeneratePng = vi.fn().mockResolvedValue(FAKE_BYTES) as unknown as (data: CardData, style: CardStyle) => Promise<Uint8Array>

// ── Testes herdados (regressão) ───────────────────────────────────────────────

describe('BusinessCardCreatorTool — regressão', () => {
  it('renderiza o heading "Gerador de Cartão de Visitas"', () => {
    render(<BusinessCardCreatorTool />)
    expect(
      screen.getByRole('heading', { name: /Gerador de Cartão de Visitas/i }),
    ).toBeDefined()
  })

  it('exibe o banner de privacidade', () => {
    render(<BusinessCardCreatorTool />)
    expect(screen.getByText(/Processamento 100% local/i)).toBeDefined()
  })

  it('botão "Baixar como PDF" está desabilitado sem nome', () => {
    render(<BusinessCardCreatorTool />)
    const btn = screen.getByRole('button', { name: /Baixar como PDF/i })
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('botão "Baixar como PNG" está desabilitado sem nome', () => {
    render(<BusinessCardCreatorTool />)
    const btn = screen.getByRole('button', { name: /Baixar como PNG/i })
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('prévia do cartão está presente no DOM', () => {
    const { container } = render(<BusinessCardCreatorTool />)
    expect(container.querySelector('.bcc-card-preview')).toBeTruthy()
  })

  it('preencher nome exibe o nome na prévia', () => {
    render(<BusinessCardCreatorTool />)
    const input = screen.getByRole('textbox', { name: /Nome completo/i })
    fireEvent.change(input, { target: { value: 'Maria Silva' } })
    expect(screen.getByText('Maria Silva')).toBeDefined()
  })

  it('três opções de estilo disponíveis (Clássico, Moderno, Colorido)', () => {
    render(<BusinessCardCreatorTool />)
    expect(screen.getByText('Clássico')).toBeDefined()
    expect(screen.getByText('Moderno')).toBeDefined()
    expect(screen.getByText('Colorido')).toBeDefined()
    expect(screen.getAllByRole('radio').length).toBeGreaterThanOrEqual(3)
  })

  it('botão "Imprimir prévia" está presente', () => {
    render(<BusinessCardCreatorTool />)
    expect(
      screen.getByRole('button', { name: /Imprimir prévia/i }),
    ).toBeDefined()
  })
})

// ── Download PDF ──────────────────────────────────────────────────────────────

describe('BusinessCardCreatorTool — download PDF', () => {
  it('habilita o botão após informar nome', () => {
    render(<BusinessCardCreatorTool generatePdf={mockGeneratePdf} />)
    const input = screen.getByRole('textbox', { name: /Nome completo/i })
    fireEvent.change(input, { target: { value: 'Ana Silva' } })
    const btn = screen.getByRole('button', { name: /Baixar como PDF/i })
    expect((btn as HTMLButtonElement).disabled).toBe(false)
  })

  it('chama generatePdf com os dados e estilo corretos', async () => {
    const mockPdf = vi.fn().mockResolvedValue(FAKE_BYTES) as unknown as (data: CardData, style: CardStyle) => Promise<Uint8Array>
    render(<BusinessCardCreatorTool generatePdf={mockPdf} />)

    fireEvent.change(
      screen.getByRole('textbox', { name: /Nome completo/i }),
      { target: { value: 'Ana Silva' } },
    )
    fireEvent.click(screen.getByRole('button', { name: /Baixar como PDF/i }))

    await waitFor(() => {
      expect(mockPdf).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: 'Ana Silva' }),
        'classic',
      )
    })
  })

  it('aciona createObjectURL e revokeObjectURL ao baixar PDF', async () => {
    render(<BusinessCardCreatorTool generatePdf={mockGeneratePdf} />)
    fireEvent.change(
      screen.getByRole('textbox', { name: /Nome completo/i }),
      { target: { value: 'Ana Silva' } },
    )
    fireEvent.click(screen.getByRole('button', { name: /Baixar como PDF/i }))

    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalled()
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url')
    })
  })

  it('exibe mensagem de erro acessível quando generatePdf lança exceção', async () => {
    const mockPdfError = vi.fn().mockRejectedValue(new Error('Falha simulada')) as unknown as (data: CardData, style: CardStyle) => Promise<Uint8Array>
    render(<BusinessCardCreatorTool generatePdf={mockPdfError} />)

    fireEvent.change(
      screen.getByRole('textbox', { name: /Nome completo/i }),
      { target: { value: 'Ana Silva' } },
    )
    fireEvent.click(screen.getByRole('button', { name: /Baixar como PDF/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined()
      expect(screen.getByText(/Falha simulada/i)).toBeDefined()
    })
  })
})

// ── Download PNG ──────────────────────────────────────────────────────────────

describe('BusinessCardCreatorTool — download PNG', () => {
  it('habilita o botão PNG após informar nome', () => {
    render(<BusinessCardCreatorTool generatePng={mockGeneratePng} />)
    const input = screen.getByRole('textbox', { name: /Nome completo/i })
    fireEvent.change(input, { target: { value: 'Carlos' } })
    const btn = screen.getByRole('button', { name: /Baixar como PNG/i })
    expect((btn as HTMLButtonElement).disabled).toBe(false)
  })

  it('chama generatePng com os dados e estilo corretos', async () => {
    const mockPng = vi.fn().mockResolvedValue(FAKE_BYTES) as unknown as (data: CardData, style: CardStyle) => Promise<Uint8Array>
    render(<BusinessCardCreatorTool generatePng={mockPng} />)

    fireEvent.change(
      screen.getByRole('textbox', { name: /Nome completo/i }),
      { target: { value: 'Carlos' } },
    )
    // Muda para estilo modern
    fireEvent.click(screen.getByDisplayValue('modern'))
    fireEvent.click(screen.getByRole('button', { name: /Baixar como PNG/i }))

    await waitFor(() => {
      expect(mockPng).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: 'Carlos' }),
        'modern',
      )
    })
  })

  it('aciona createObjectURL e revokeObjectURL ao baixar PNG', async () => {
    render(<BusinessCardCreatorTool generatePng={mockGeneratePng} />)
    fireEvent.change(
      screen.getByRole('textbox', { name: /Nome completo/i }),
      { target: { value: 'Carlos' } },
    )
    fireEvent.click(screen.getByRole('button', { name: /Baixar como PNG/i }))

    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalled()
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url')
    })
  })

  it('exibe mensagem de erro acessível quando generatePng lança exceção', async () => {
    const mockPngError = vi.fn().mockRejectedValue(new Error('PNG falhou')) as unknown as (data: CardData, style: CardStyle) => Promise<Uint8Array>
    render(<BusinessCardCreatorTool generatePng={mockPngError} />)

    fireEvent.change(
      screen.getByRole('textbox', { name: /Nome completo/i }),
      { target: { value: 'Carlos' } },
    )
    fireEvent.click(screen.getByRole('button', { name: /Baixar como PNG/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined()
      expect(screen.getByText(/PNG falhou/i)).toBeDefined()
    })
  })
})
