import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import App from '../App'
import { redirectToPublicCatalog } from './catalog-redirect-target'

function readServicesHtml() {
  return readFileSync(resolve(process.cwd(), '..', 'servicos.html'), 'utf8')
}

function readServicesScript() {
  return readFileSync(resolve(process.cwd(), '..', 'script.js'), 'utf8')
}

describe('integracao institucional das ferramentas digitais', () => {
  beforeEach(() => {
    window.location.hash = '#/ferramentas/qr-code'
  })

  it('mantem navegacao, retorno ao catalogo e rodape na pagina dedicada', async () => {
    render(<App />)

    expect(
      await screen.findByRole('banner', { name: /Navega/i }, { timeout: 10000 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar para ferramentas' }),
    ).toHaveAttribute('href', '../../servicos.html#ferramentas')
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Plena')
    expect(
      screen.getAllByRole('link').some((link) => link.getAttribute('href') === '../../index.html'),
    ).toBe(true)
    expect(screen.getByText(/Dispon/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Gerador de QR Code' }),
    ).toBeInTheDocument()
  }, 15000)

  it('usa a pagina de Servicos Digitais como entrada publica do QR Code', () => {
    const servicesHtml = readServicesHtml()

    expect(servicesHtml).toContain('href="hub-app/#/ferramentas/qr-code"')
    expect(servicesHtml).toContain('aria-label="Usar Gerador de QR Code"')
  })

  it('monta o redirecionamento de /catalogo para a pagina publica real', () => {
    const fakeLocation = {
      href: 'http://localhost:3000/#/catalogo',
      origin: 'http://localhost:3000',
    }

    const target = redirectToPublicCatalog(fakeLocation)

    expect(target).toBe('http://localhost:3000/servicos/servicos.html')
    expect(fakeLocation.href).toBe('http://localhost:3000/servicos/servicos.html')
  })

  it.each([
    ['#/ferramentas/resume-builder', /Criador de Curr/i, /Baixar curr/i],
    ['#/ferramentas/merge-pdf', 'Unificador de PDFs', 'Unificar PDFs'],
    ['#/ferramentas/declaration-builder', /Gerador de Declara/i, 'Baixar PDF'],
    ['#/ferramentas/mei-irpf-checklist', 'Checklist MEI e IRPF', /Microempreendedor Individual/i],
  ])('abre %s no shell institucional', async (hash, heading, actionName) => {
    window.location.hash = hash

    render(<App />)

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: heading,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Voltar para ferramentas' }),
    ).toHaveAttribute('href', '../../servicos.html#ferramentas')
    expect(
      screen.getByRole('button', { name: actionName }),
    ).toBeInTheDocument()
  })

  it('mantem os CTAs publicos das ferramentas disponiveis na pagina de Servicos Digitais', () => {
    const servicesHtml = readServicesHtml()

    expect(servicesHtml).toContain('href="hub-app/#/ferramentas/resume-builder"')
    expect(servicesHtml).toContain('aria-label="Usar Criador de Curriculo"')
    expect(servicesHtml).toContain('href="hub-app/#/ferramentas/declaration-builder"')
    expect(servicesHtml).toContain('aria-label="Usar Gerador de Declaracoes"')
    expect(servicesHtml).toContain('href="hub-app/#/ferramentas/mei-irpf-checklist"')
    expect(servicesHtml).toContain('aria-label="Iniciar Checklist MEI e IRPF"')
  })

  it('padroniza busca, filtros e metadados dos onze cards', () => {
    const servicesHtml = readServicesHtml()
    const servicesScript = readServicesScript()

    expect(servicesHtml).toContain('id="tool-search"')
    expect(servicesHtml).toContain('data-filter="all"')
    expect(servicesHtml.match(/data-tool="/g)).toHaveLength(11)
    expect(servicesScript).toContain("'resume-builder'")
    expect(servicesScript).toContain('tool-professional')
    expect(servicesScript).toContain('updateTools')
  })

  it('aplica o layout compartilhado a uma ferramenta em construcao sem liberar CTA publico', async () => {
    window.location.hash = '#/ferramentas/menu-builder'

    render(<App />)

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Gerador de Card/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Em constru/i)).toBeInTheDocument()
    expect(screen.getByText('Processamento 100% local')).toBeInTheDocument()
    expect(readServicesHtml()).toContain('aria-label="Gerador de Card')
    expect(readServicesHtml()).not.toContain('href="hub-app/#/ferramentas/menu-builder"')
  })
})
