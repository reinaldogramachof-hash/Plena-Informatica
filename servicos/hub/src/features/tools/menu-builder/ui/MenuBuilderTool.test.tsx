import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { MenuBuilderTool } from './MenuBuilderTool'
import type { MenuData, MenuOptions } from '../domain/menu-data'

// ── Mocks globais ─────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url')
  vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
})

const FAKE_PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46])  // %PDF

const mockGeneratePdf = vi.fn().mockResolvedValue(FAKE_PDF) as any

// ── Helpers ───────────────────────────────────────────────────────────────────

function addCategoryWithItem(catName = 'Pratos', itemName = 'Frango') {
  fireEvent.click(screen.getByRole('button', { name: /Adicionar categoria/i }))
  fireEvent.change(
    screen.getByRole('textbox', { name: /Nome da categoria 1/i }),
    { target: { value: catName } },
  )
  fireEvent.click(screen.getByRole('button', { name: /Adicionar item/i }))
  fireEvent.change(
    screen.getByRole('textbox', { name: /Nome do item 1/i }),
    { target: { value: itemName } },
  )
}

function fillEstablishment(name = 'Restaurante Teste') {
  fireEvent.change(
    screen.getByRole('textbox', { name: /Nome do estabelecimento/i }),
    { target: { value: name } },
  )
}

// ── Regressao ─────────────────────────────────────────────────────────────────

describe('MenuBuilderTool — regressao', () => {
  it('renderiza o heading "Gerador de Cardapio"', () => {
    render(<MenuBuilderTool />)
    expect(
      screen.getByRole('heading', { name: /Gerador de Card/i }),
    ).toBeDefined()
  })

  it('exibe o banner de privacidade', () => {
    render(<MenuBuilderTool />)
    expect(screen.getByText(/Processamento 100% local/i)).toBeDefined()
  })

  it('botao "Gerar cardapio em PDF" presente e desabilitado inicialmente', () => {
    render(<MenuBuilderTool />)
    const btn = screen.getByRole('button', { name: /Gerar card/i })
    expect(btn).toBeDefined()
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('clicar em "Adicionar categoria" exibe input de nome', () => {
    render(<MenuBuilderTool />)
    fireEvent.click(screen.getByRole('button', { name: /Adicionar categoria/i }))
    expect(
      screen.getByRole('textbox', { name: /Nome da categoria 1/i }),
    ).toBeDefined()
  })

  it('campo "Nome do estabelecimento *" esta presente', () => {
    render(<MenuBuilderTool />)
    expect(
      screen.getByRole('textbox', { name: /Nome do estabelecimento/i }),
    ).toBeDefined()
  })

  it('exibe aviso sobre impressao na Plena', () => {
    render(<MenuBuilderTool />)
    expect(
      screen.getByText(/Para impressao e plastificacao profissional/i),
    ).toBeDefined()
  })
})

// ── Condicao de habilitar botao ───────────────────────────────────────────────

describe('MenuBuilderTool — habilitacao do botao', () => {
  it('permanece desabilitado com estabelecimento mas sem item nomeado', () => {
    render(<MenuBuilderTool generatePdf={mockGeneratePdf} />)
    fillEstablishment()
    // Adiciona categoria mas sem item
    fireEvent.click(screen.getByRole('button', { name: /Adicionar categoria/i }))
    const btn = screen.getByRole('button', { name: /Gerar card/i })
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })

  it('habilita apos estabelecimento + categoria + item nomeado', () => {
    render(<MenuBuilderTool generatePdf={mockGeneratePdf} />)
    fillEstablishment()
    addCategoryWithItem()
    const btn = screen.getByRole('button', { name: /Gerar card/i })
    expect((btn as HTMLButtonElement).disabled).toBe(false)
  })

  it('permanece desabilitado com item adicionado mas sem nome', () => {
    render(<MenuBuilderTool generatePdf={mockGeneratePdf} />)
    fillEstablishment()
    fireEvent.click(screen.getByRole('button', { name: /Adicionar categoria/i }))
    fireEvent.click(screen.getByRole('button', { name: /Adicionar item/i }))
    // Item sem nome
    const btn = screen.getByRole('button', { name: /Gerar card/i })
    expect((btn as HTMLButtonElement).disabled).toBe(true)
  })
})

// ── Download ──────────────────────────────────────────────────────────────────

describe('MenuBuilderTool — download', () => {
  it('chama generatePdf com dados e opcoes corretos', async () => {
    const mockPdf = vi.fn().mockResolvedValue(FAKE_PDF) as any
    render(<MenuBuilderTool generatePdf={mockPdf} />)
    fillEstablishment('Boteco da Vila')
    addCategoryWithItem('Bebidas', 'Suco')
    fireEvent.click(screen.getByRole('button', { name: /Gerar card/i }))

    await waitFor(() => {
      expect(mockPdf).toHaveBeenCalledWith(
        expect.objectContaining({ establishment: 'Boteco da Vila' }),
        expect.objectContaining({ pageSize: 'a4', columns: 1 }),
      )
    })
  })

  it('aciona createObjectURL e revokeObjectURL apos gerar PDF', async () => {
    render(<MenuBuilderTool generatePdf={mockGeneratePdf} />)
    fillEstablishment()
    addCategoryWithItem()
    fireEvent.click(screen.getByRole('button', { name: /Gerar card/i }))

    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalled()
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url')
    })
  })

  it('exibe erro acessivel quando generatePdf lanca excecao', async () => {
    const mockErr = vi.fn().mockRejectedValue(new Error('Falha no gerador')) as any
    render(<MenuBuilderTool generatePdf={mockErr} />)
    fillEstablishment()
    addCategoryWithItem()
    fireEvent.click(screen.getByRole('button', { name: /Gerar card/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined()
      expect(screen.getByText(/Falha no gerador/i)).toBeDefined()
    })
  })

  it('passa pageSize half quando selecionado', async () => {
    const mockPdf = vi.fn().mockResolvedValue(FAKE_PDF) as any
    render(<MenuBuilderTool generatePdf={mockPdf} />)
    fillEstablishment()
    addCategoryWithItem()
    fireEvent.click(screen.getByDisplayValue('half'))
    fireEvent.click(screen.getByRole('button', { name: /Gerar card/i }))

    await waitFor(() => {
      expect(mockPdf).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ pageSize: 'half' }),
      )
    })
  })

  it('passa columns 2 quando selecionado', async () => {
    const mockPdf = vi.fn().mockResolvedValue(FAKE_PDF) as any
    render(<MenuBuilderTool generatePdf={mockPdf} />)
    fillEstablishment()
    addCategoryWithItem()
    fireEvent.click(screen.getByDisplayValue('2'))
    fireEvent.click(screen.getByRole('button', { name: /Gerar card/i }))

    await waitFor(() => {
      expect(mockPdf).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ columns: 2 }),
      )
    })
  })
})
