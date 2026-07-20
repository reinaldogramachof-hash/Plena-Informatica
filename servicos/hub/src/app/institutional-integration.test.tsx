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

  it('abre o Criador de Curriculo no shell institucional', () => {
    window.location.hash = '#/ferramentas/resume-builder'

    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Criador de Curriculo',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar para ferramentas' }),
    ).toHaveAttribute('href', '../../servicos.html#ferramentas')
    expect(
      screen.getByRole('button', { name: 'Baixar currículo em PDF' }),
    ).toBeInTheDocument()
  })

  // TODO: ativar quando a ferramenta mudar para status `available` no ROADMAP
  it.skip('ativa o CTA do Criador de Curriculo na pagina principal', () => {
    const servicesHtml = readFileSync(
      resolve(process.cwd(), '..', 'servicos.html'),
      'utf8',
    )

    expect(servicesHtml).toContain(
      'href="ferramentas/qr-code/#/ferramentas/resume-builder"',
    )
    expect(servicesHtml).toContain(
      'aria-label="Usar Criador de Curriculo"',
    )
  })

  it('abre o Unificador de PDFs no shell institucional', () => {
    window.location.hash = '#/ferramentas/merge-pdf'

    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Unificador de PDFs',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Unificar PDFs' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar para ferramentas' }),
    ).toHaveAttribute('href', '../../servicos.html#ferramentas')
  })

  it('abre o Gerador de Declaracoes no shell institucional', () => {
    window.location.hash = '#/ferramentas/declaration-builder'

    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Gerador de Declarações',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Baixar PDF' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar para ferramentas' }),
    ).toHaveAttribute('href', '../../servicos.html#ferramentas')
  })

  // TODO: ativar quando a ferramenta mudar para status `available` no ROADMAP
  it.skip('ativa o CTA do Gerador de Declaracoes na pagina principal', () => {
    const servicesHtml = readFileSync(
      resolve(process.cwd(), '..', 'servicos.html'),
      'utf8',
    )

    expect(servicesHtml).toContain(
      'href="ferramentas/qr-code/#/ferramentas/declaration-builder"',
    )
    expect(servicesHtml).toContain(
      'aria-label="Usar Gerador de Declaracoes"',
    )
  })

  it('abre o Checklist MEI e IRPF no shell institucional', () => {
    window.location.hash = '#/ferramentas/mei-irpf-checklist'

    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Checklist MEI e IRPF',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Checklist MEI e IRPF',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Microempreendedor Individual/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar para ferramentas' }),
    ).toHaveAttribute('href', '../../servicos.html#ferramentas')
  })

  it('ativa o CTA do Checklist MEI e IRPF na pagina principal', () => {
    const servicesHtml = readFileSync(
      resolve(process.cwd(), '..', 'servicos.html'),
      'utf8',
    )

    expect(servicesHtml).toContain(
      'href="ferramentas/qr-code/#/ferramentas/mei-irpf-checklist"',
    )
    expect(servicesHtml).toContain(
      'aria-label="Iniciar Checklist MEI e IRPF"',
    )
  })

  // TODO: ativar quando a ferramenta mudar para status `available` no ROADMAP
  it.skip('mantem ferramentas em construcao indisponiveis na vitrine', () => {
    const servicesHtml = readFileSync(
      resolve(process.cwd(), '..', 'servicos.html'),
      'utf8',
    )

    expect(servicesHtml).toContain('data-tool="menu-builder"')
    expect(servicesHtml).toContain(
      'href="ferramentas/qr-code/#/ferramentas/menu-builder"',
    )
  })

  it('padroniza busca, filtros e metadados dos onze cards', () => {
    const servicesHtml = readFileSync(
      resolve(process.cwd(), '..', 'servicos.html'),
      'utf8',
    )
    const servicesScript = readFileSync(
      resolve(process.cwd(), '..', 'script.js'),
      'utf8',
    )

    expect(servicesHtml).toContain('id="tool-search"')
    expect(servicesHtml).toContain('data-filter="all"')
    expect(servicesHtml.match(/data-tool="/g)).toHaveLength(11)
    expect(servicesScript).toContain("'resume-builder'")
    expect(servicesScript).toContain('tool-professional')
    expect(servicesScript).toContain('updateTools')
  })

  it('aplica o layout compartilhado a uma ferramenta em construcao', () => {
    window.location.hash = '#/ferramentas/menu-builder'

    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Gerador de Cardápio',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Em construção')).toBeInTheDocument()
    expect(screen.getByText('Processamento 100% local')).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: 'Consultar impressão de cardápio',
      }),
    ).toBeInTheDocument()
  })
})
