import type { ReactNode } from 'react'

import type { ToolManifest } from '../features/tools/types'
import {
  getToolPresentation,
  professionalServices,
} from './tool-presentation'
import { buildWhatsappUrl } from './whatsapp'

const statusLabel = {
  planned: 'Em breve',
  building: 'Em construção',
  available: 'Disponível',
} as const

interface ToolPageLayoutProps {
  tool: ToolManifest
  children: ReactNode
}

export function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const presentation = getToolPresentation(tool.slug)

  if (!presentation) {
    return null
  }

  const professionalService = presentation.professionalServiceId
    ? professionalServices[presentation.professionalServiceId]
    : undefined

  return (
    <main className={`tool-page tool-page--${tool.slug}`}>
      <header className="tool-page__header">
        <a className="back-link" href="../../servicos.html#ferramentas">
          Voltar para ferramentas
        </a>
        <div className="tool-page__status-row">
          <span className={`tool-page__status tool-page__status--${tool.status}`}>
            {statusLabel[tool.status]}
          </span>
          <span>{presentation.resultLabel}</span>
          <span>{presentation.estimatedTime}</span>
        </div>
        <h1>{tool.name}</h1>
        <p>{tool.shortDescription}</p>
        <ul className="tool-page__benefits" aria-label="Benefícios">
          {presentation.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
        <p className="tool-page__privacy">{presentation.privacyLabel}</p>
      </header>

      <section className="tool-workspace" aria-label={`Área de ${tool.name}`}>
        {children}
      </section>

      {professionalService ? (
        <aside className="professional-service">
          <div>
            <span>Atendimento profissional opcional</span>
            <h2>{professionalService.name}</h2>
            <p>{professionalService.contextLabel}</p>
          </div>
          <div className="professional-service__action">
            <strong>{professionalService.priceLabel}</strong>
            <a
              href={buildWhatsappUrl(professionalService.actionLabel)}
              target="_blank"
              rel="noreferrer"
            >
              {professionalService.actionLabel}
            </a>
          </div>
        </aside>
      ) : null}
    </main>
  )
}
