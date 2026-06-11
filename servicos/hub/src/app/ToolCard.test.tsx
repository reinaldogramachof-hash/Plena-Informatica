import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { getToolBySlug } from './tool-registry'
import { ToolCard } from './ToolCard'

describe('ToolCard', () => {
  it('renders benefits and an active primary action for available tools', () => {
    const tool = getToolBySlug('images-to-pdf')
    expect(tool).toBeDefined()

    render(<ToolCard tool={tool!} />)

    expect(screen.getByText('Reordene fotos e documentos')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Transformar imagens em PDF' }),
    ).toHaveAttribute('href', '#/ferramentas/images-to-pdf')
    expect(
      screen.getByRole('link', { name: 'Consultar atendimento Plena' }),
    ).toBeInTheDocument()
  })

  it('keeps building tools visibly unavailable', () => {
    const tool = getToolBySlug('menu-builder')
    expect(tool).toBeDefined()

    render(<ToolCard tool={tool!} />)

    expect(screen.getByText('Em construção')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Criar meu cardápio' }),
    ).toBeDisabled()
  })
})
