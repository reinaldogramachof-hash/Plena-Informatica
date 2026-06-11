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

interface ToolCardProps {
  tool: ToolManifest
}

export function ToolCard({ tool }: ToolCardProps) {
  const presentation = getToolPresentation(tool.slug)

  if (!presentation) {
    return null
  }

  const professionalService = presentation.professionalServiceId
    ? professionalServices[presentation.professionalServiceId]
    : undefined

  return (
    <article
      className={`tool-card${presentation.featured ? ' tool-card--featured' : ''}`}
    >
      <div className="tool-card__top">
        <span className={`tool-status tool-status--${tool.status}`}>
          {presentation.popularityLabel ?? statusLabel[tool.status]}
        </span>
        <span className="tool-card__category">{tool.category}</span>
      </div>

      <div className="tool-card__body">
        <h3>{tool.name}</h3>
        <p>{tool.shortDescription}</p>
        <ul className="tool-benefits">
          {presentation.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </div>

      <div className="tool-card__footer">
        <dl className="tool-card__meta">
          <div>
            <dt>Resultado</dt>
            <dd>{presentation.resultLabel}</dd>
          </div>
          <div>
            <dt>Tempo</dt>
            <dd>{presentation.estimatedTime}</dd>
          </div>
        </dl>
        <p className="tool-card__privacy">{presentation.privacyLabel}</p>
        {tool.status === 'available' ? (
          <a
            className="tool-card__primary"
            href={`#/ferramentas/${tool.slug}`}
          >
            {presentation.primaryActionLabel}
          </a>
        ) : (
          <button
            className="tool-card__primary"
            type="button"
            disabled
          >
            {presentation.primaryActionLabel}
          </button>
        )}
        {professionalService ? (
          <a
            className="tool-card__professional"
            href={buildWhatsappUrl(professionalService.actionLabel)}
            target="_blank"
            rel="noreferrer"
            aria-label={professionalService.actionLabel}
          >
            <span>{professionalService.actionLabel}</span>
            <strong>{professionalService.priceLabel}</strong>
          </a>
        ) : null}
      </div>
    </article>
  )
}
