import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ResumeBuilderTool } from './ResumeBuilderTool'
import { RESUME_TEMPLATES } from '../domain/resume-templates'

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText('Nome completo *'), {
    target: { value: 'Ana Silva' },
  })
  fireEvent.change(screen.getByLabelText('E-mail *'), {
    target: { value: 'ana@example.com' },
  })
  fireEvent.change(screen.getByLabelText('Telefone *'), {
    target: { value: '(12) 99999-9999' },
  })
  fireEvent.change(screen.getByLabelText('Título profissional *'), {
    target: { value: 'Assistente administrativa' },
  })
  fireEvent.change(screen.getByLabelText('Resumo profissional'), {
    target: { value: 'Profissional organizada e focada em atendimento.' },
  })
}

describe('ResumeBuilderTool', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('renders the local-processing notice and live preview', () => {
    render(<ResumeBuilderTool />)

    expect(
      screen.getByRole('heading', { name: 'Criador de Currículo' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Seus dados ficam somente neste navegador/)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Nome completo *'), {
      target: { value: 'Ana Silva' },
    })

    expect(
      screen.getByRole('heading', { name: 'Ana Silva' }),
    ).toBeInTheDocument()
  })

  it('adds and removes an experience section', () => {
    render(<ResumeBuilderTool />)

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar experiência' }))

    expect(screen.getByLabelText('Cargo 1')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Remover experiência 1' }))
    expect(screen.queryByLabelText('Cargo 1')).not.toBeInTheDocument()
  })

  it('shows validation errors before generating', async () => {
    render(<ResumeBuilderTool />)

    fireEvent.click(screen.getByRole('button', { name: 'Baixar currículo em PDF' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Informe seu nome completo',
    )
  })

  it('generates and downloads a validated resume', async () => {
    const generatePdf = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
    const createObjectURL = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:resume')
    const revokeObjectURL = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => undefined)
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined)

    render(<ResumeBuilderTool generatePdf={generatePdf} />)
    fillRequiredFields()
    fireEvent.click(screen.getByRole('button', { name: 'Baixar currículo em PDF' }))

    await waitFor(() => expect(generatePdf).toHaveBeenCalledTimes(1))
    expect(click).toHaveBeenCalled()
    expect(createObjectURL).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:resume')

    click.mockRestore()
    createObjectURL.mockRestore()
    revokeObjectURL.mockRestore()
  })

  // New tests (15)

  it('default template is classic-ats (aria-pressed=true on Clássico ATS card)', () => {
    render(<ResumeBuilderTool />)
    const classicCard = screen.getByRole('button', { name: /Clássico ATS/i })
    expect(classicCard).toHaveAttribute('aria-pressed', 'true')
  })

  it('all 5 template names appear in the picker', () => {
    render(<ResumeBuilderTool />)
    for (const template of RESUME_TEMPLATES) {
      const matches = screen.getAllByText(template.name)
      expect(matches.length).toBeGreaterThan(0)
    }
  })

  it('each template card shows its description', () => {
    render(<ResumeBuilderTool />)
    for (const template of RESUME_TEMPLATES) {
      expect(screen.getByText(template.description)).toBeInTheDocument()
    }
  })

  it('creative card shows ATS warning', () => {
    render(<ResumeBuilderTool />)
    const creativeTemplate = RESUME_TEMPLATES.find((t) => t.id === 'creative')!
    expect(screen.getByText(creativeTemplate.atsWarning!)).toBeInTheDocument()
  })

  it('clicking a template card updates aria-pressed', () => {
    render(<ResumeBuilderTool />)
    const executiveCard = screen.getByRole('button', { name: /Executivo/i })
    expect(executiveCard).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(executiveCard)
    expect(executiveCard).toHaveAttribute('aria-pressed', 'true')
  })

  it('selected template applies modifier class on preview', () => {
    render(<ResumeBuilderTool />)
    // Default is classic-ats
    expect(document.querySelector('.resume-preview--classic-ats')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Moderno/i }))
    expect(document.querySelector('.resume-preview--modern')).toBeInTheDocument()
  })

  it('selected template is passed to PDF generator', async () => {
    const generatePdf = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:resume')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    render(<ResumeBuilderTool generatePdf={generatePdf} />)
    fireEvent.click(screen.getByRole('button', { name: /Executivo/i }))
    fillRequiredFields()
    fireEvent.click(screen.getByRole('button', { name: 'Baixar currículo em PDF' }))

    await waitFor(() => expect(generatePdf).toHaveBeenCalledTimes(1))
    expect(generatePdf).toHaveBeenCalledWith(
      expect.anything(),
      'executive',
    )
  })

  it('empty experience means no experience section heading in preview sheet', () => {
    render(<ResumeBuilderTool />)
    // The preview sheet should not show the experience section heading when there are no experiences
    const sheet = document.querySelector('.resume-preview')!
    const h3s = Array.from(sheet.querySelectorAll('h3')).map((h) => h.textContent)
    expect(h3s).not.toContain('Experiência profissional')
  })

  it('first-job template: education heading appears before experience heading in DOM', () => {
    render(<ResumeBuilderTool />)
    fireEvent.click(screen.getByRole('button', { name: /Primeiro Emprego/i }))

    // Add experience
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar experiência' }))
    // Add education
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar formação' }))

    const preview = document.querySelector('.resume-preview--first-job')!
    const headings = Array.from(preview.querySelectorAll('h3')).map((h) => h.textContent)
    const expIdx = headings.indexOf('Experiência profissional')
    const eduIdx = headings.indexOf('Formação')

    expect(eduIdx).toBeGreaterThanOrEqual(0)
    expect(expIdx).toBeGreaterThanOrEqual(0)
    expect(eduIdx).toBeLessThan(expIdx)
  })

  it('required field labels contain *', () => {
    render(<ResumeBuilderTool />)
    expect(screen.getByLabelText('Nome completo *')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail *')).toBeInTheDocument()
    expect(screen.getByLabelText('Telefone *')).toBeInTheDocument()
    expect(screen.getByLabelText('Título profissional *')).toBeInTheDocument()
  })

  it('required progress counter renders', () => {
    render(<ResumeBuilderTool />)
    expect(screen.getByText(/de 5 campos obrigatórios preenchidos/)).toBeInTheDocument()
  })

  it('download with empty name shows role="alert"', async () => {
    render(<ResumeBuilderTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Baixar currículo em PDF' }))
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('shows "Currículo pronto para gerar" when all required fields are filled', async () => {
    render(<ResumeBuilderTool />)
    fillRequiredFields()
    // Add one experience to satisfy the 5th required field (experience OR education > 0)
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar experiência' }))
    expect(await screen.findByText('Currículo pronto para gerar')).toBeInTheDocument()
  })

  it('download filename is plena-curriculo.pdf', async () => {
    const generatePdf = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:resume')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    const setDownload = vi.spyOn(HTMLAnchorElement.prototype, 'download', 'set')

    render(<ResumeBuilderTool generatePdf={generatePdf} />)
    fillRequiredFields()
    fireEvent.click(screen.getByRole('button', { name: 'Baixar currículo em PDF' }))

    await waitFor(() => expect(generatePdf).toHaveBeenCalledTimes(1))
    expect(setDownload).toHaveBeenCalledWith('plena-curriculo.pdf')

    clickSpy.mockRestore()
    setDownload.mockRestore()
  })

  it('text "Currículo" appears in rendered document', () => {
    render(<ResumeBuilderTool />)
    expect(screen.getAllByText(/Currículo/).length).toBeGreaterThan(0)
  })
})
