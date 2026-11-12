import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

import { InstitutionalShell } from './InstitutionalShell'

it('apresenta a navegação e a identidade institucional com acentuação correta', () => {
  render(<InstitutionalShell><main>Ferramenta</main></InstitutionalShell>)

  expect(screen.getByRole('banner', { name: 'Navegação Plena' })).toBeInTheDocument()
  expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: 'Plena Informática' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('href', '../../index.html')
  expect(screen.getByRole('contentinfo')).toHaveTextContent('Agilidade, segurança e excelência em São José dos Campos.')
})
