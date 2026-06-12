import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { getToolBySlug } from './tool-registry'
import { ToolPageLayout } from './ToolPageLayout'

describe('ToolPageLayout', () => {
  it('shows shared navigation, status, privacy and workspace content', () => {
    const tool = getToolBySlug('qr-code')
    expect(tool).toBeDefined()

    render(
      <ToolPageLayout tool={tool!}>
        <div>Conteúdo da ferramenta</div>
      </ToolPageLayout>,
    )

    expect(
      screen.getByRole('link', { name: 'Voltar para ferramentas' }),
    ).toHaveAttribute('href', '../../servicos.html#ferramentas')
    expect(screen.getByText('Disponível')).toBeInTheDocument()
    expect(screen.getByText('Sem cadastro e sem armazenamento')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo da ferramenta')).toBeInTheDocument()
  })

  it('shows professional help as a secondary action when configured', () => {
    const tool = getToolBySlug('resume-builder')
    expect(tool).toBeDefined()

    render(
      <ToolPageLayout tool={tool!}>
        <div>Editor</div>
      </ToolPageLayout>,
    )

    expect(
      screen.getByRole('link', { name: 'Solicitar currículo com a Plena' }),
    ).toHaveAttribute('href', expect.stringContaining('api.whatsapp.com'))
    expect(screen.getByText('R$ 15,00')).toBeInTheDocument()
  })
})
