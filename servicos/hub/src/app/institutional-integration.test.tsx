import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import App from '../App'

describe('integracao institucional do QR Code', () => {
  beforeEach(() => {
    window.location.hash = '#/ferramentas/qr-code'
  })

  it('mantem navegacao, retorno ao catalogo e rodape na pagina dedicada', () => {
    render(<App />)

    expect(
      screen.getByRole('banner', { name: 'Navegação Plena' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar para ferramentas' }),
    ).toHaveAttribute('href', '../../servicos.html#ferramentas')
    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      'Plena Informática',
    )
    expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument()
    expect(screen.getByText('Disponível')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Gerador de QR Code' }),
    ).toBeInTheDocument()
  })

  it('ativa somente o CTA do QR Code na pagina principal', () => {
    const servicesHtml = readFileSync(
      resolve(process.cwd(), '..', 'servicos.html'),
      'utf8',
    )

    expect(servicesHtml).toContain(
      'href="ferramentas/qr-code/"',
    )
    expect(servicesHtml).toContain('aria-label="Usar Gerador de QR Code"')
  })

  it('abre a ferramenta diretamente no caminho publico sem hash adicional', () => {
    window.location.hash = ''

    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Gerador de QR Code' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar para ferramentas' }),
    ).toBeInTheDocument()
  })
})
