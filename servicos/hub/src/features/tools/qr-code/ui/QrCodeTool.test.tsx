import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { QrCodeTool } from './QrCodeTool'

describe('QrCodeTool', () => {
  it('shows the six supported modes and the local-processing notice', () => {
    render(<QrCodeTool />)

    expect(screen.getByRole('button', { name: 'Link' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Texto' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'WhatsApp' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Telefone' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Wi-Fi' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pix' })).toBeInTheDocument()
    expect(
      screen.getByText('Nada é enviado para a Plena ou para o Supabase.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Escolha o tipo de conteúdo, preencha os dados e baixe a imagem em PNG.',
      ),
    ).toBeInTheDocument()
  })

  it('generates a preview and exposes the PNG download', async () => {
    const generateImage = vi
      .fn()
      .mockResolvedValue('data:image/png;base64,preview')

    render(<QrCodeTool generateImage={generateImage} />)

    fireEvent.change(screen.getByLabelText('Link'), {
      target: { value: 'https://plenainformatica.com.br' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Gerar QR Code' }))

    expect(
      await screen.findByRole('img', { name: 'Prévia do QR Code' }),
    ).toHaveAttribute('src', 'data:image/png;base64,preview')
    expect(generateImage).toHaveBeenCalledWith(
      'https://plenainformatica.com.br/',
    )
    expect(
      screen.getByRole('link', { name: 'Baixar PNG' }),
    ).toHaveAttribute('download', 'plena-qr-code.png')
  })

  it('shows validation errors without calling the image generator', async () => {
    const generateImage = vi.fn()

    render(<QrCodeTool generateImage={generateImage} />)

    fireEvent.change(screen.getByLabelText('Link'), {
      target: { value: 'javascript:alert(1)' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Gerar QR Code' }))

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent('Informe um link iniciado por http:// ou https://')
    expect(generateImage).not.toHaveBeenCalled()
  })

  it('gera QR Code de Pix por chave preenchendo o formulario', async () => {
    const generateImage = vi.fn().mockResolvedValue('data:image/png;base64,pix')
    render(<QrCodeTool generateImage={generateImage} />)

    // Clica na aba Pix
    fireEvent.click(screen.getByRole('button', { name: 'Pix' }))

    // Seleciona a aba secundária "Gerar por Chave"
    fireEvent.click(screen.getByLabelText('Gerar por Chave'))

    // Preenche Chave Pix, Recebedor, Cidade, Valor
    fireEvent.change(screen.getByLabelText('Chave Pix *'), {
      target: { value: '12345678909' },
    })
    fireEvent.change(screen.getByLabelText('Nome do Recebedor *'), {
      target: { value: 'Plena Informatica' },
    })
    fireEvent.change(screen.getByLabelText('Cidade *'), {
      target: { value: 'Salvador' },
    })
    fireEvent.change(screen.getByLabelText('Valor da Transação (opcional)'), {
      target: { value: '10,50' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Gerar QR Code' }))

    await waitFor(() => {
      expect(generateImage).toHaveBeenCalled()
    })
  })
})
