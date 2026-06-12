import { useState } from 'react'

import { createLabelsPdf } from '../domain/create-labels-pdf'
import { LABEL_LAYOUTS } from '../domain/label-layouts'
import type { LabelLayout } from '../domain/label-layouts'

import './label-generator.css'

export type { LabelLayout }

export interface LabelGeneratorToolProps {
  generatePdf?: (
    labels: string[],
    layout: LabelLayout,
    withBorder: boolean,
  ) => Promise<Uint8Array>
}

function triggerDownload(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function LabelGeneratorTool({
  generatePdf = createLabelsPdf,
}: LabelGeneratorToolProps) {
  const [content, setContent]           = useState('')
  const [layout, setLayout]             = useState<LabelLayout>('2x6')
  const [withBorder, setWithBorder]     = useState(false)
  const [error, setError]               = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const labels = content
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const labelCount  = labels.length
  const def         = LABEL_LAYOUTS[layout]
  const maxCapacity = def.capacity
  const exceeds     = labelCount > maxCapacity
  const hasContent  = labelCount > 0

  async function handleGenerate() {
    if (!hasContent || isProcessing) return
    setError('')
    setIsProcessing(true)
    try {
      const bytes = await generatePdf(labels, layout, withBorder)
      triggerDownload(bytes, 'plena-etiquetas.pdf')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nao foi possivel gerar o PDF de etiquetas. Tente novamente.',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <section className="lg-tool" aria-labelledby="lg-title">
      <div className="lg-intro">
        <h2 id="lg-title">Gerador de Etiquetas</h2>
        <p className="lg-subtitle">
          Crie etiquetas para impressao em folha A4 padrao.
        </p>
      </div>

      <p className="lg-privacy-notice">
        Processamento 100% local — nenhum arquivo ou dado sai do seu dispositivo.
      </p>

      {/* Formato da folha */}
      <fieldset className="lg-fieldset">
        <legend className="lg-legend">Formato da folha</legend>
        <div className="lg-format-row">
          <label className="lg-label">
            Layout da folha
            <select
              aria-label="Layout da folha"
              className="lg-select"
              onChange={(e) => setLayout(e.target.value as LabelLayout)}
              value={layout}
            >
              <option value="2x6">
                2x6 — 12 etiquetas por pagina (Pimaco 6182)
              </option>
              <option value="3x9">
                3x9 — 27 etiquetas por pagina (Pimaco 6080)
              </option>
              <option value="4x13">
                4x13 — 52 etiquetas por pagina (Pimaco 6080 mini)
              </option>
            </select>
          </label>
          <label className="lg-checkbox-label">
            <input
              checked={withBorder}
              onChange={(e) => setWithBorder(e.target.checked)}
              type="checkbox"
            />
            Borda nas etiquetas
          </label>
        </div>
      </fieldset>

      {/* Conteudo das etiquetas */}
      <fieldset className="lg-fieldset">
        <legend className="lg-legend">Conteudo das etiquetas</legend>
        <div className="lg-content-area">
          <textarea
            aria-label="Conteudo das etiquetas, uma por linha"
            className="lg-textarea"
            onChange={(e) => setContent(e.target.value)}
            placeholder={'Digite uma etiqueta por linha:\nJoao da Silva\nMaria Souza\nEmpresa XPTO Ltda'}
            rows={8}
            value={content}
          />
          <div className="lg-counter-row">
            <span className="lg-counter" aria-live="polite">
              {labelCount} {labelCount === 1 ? 'etiqueta' : 'etiquetas'}
            </span>
            {exceeds && (
              <span
                className="lg-overflow-warning"
                role="alert"
              >
                Atencao: {labelCount} etiquetas excedem o limite de {maxCapacity} do layout selecionado. As extras serao colocadas em paginas adicionais.
              </span>
            )}
          </div>
        </div>
      </fieldset>

      {/* Previa */}
      <div className="lg-preview-section">
        <p className="lg-preview-label">Previa</p>
        <div
          className={['lg-preview', withBorder ? 'lg-preview--border' : ''].filter(Boolean).join(' ')}
          aria-label="Previa das etiquetas"
          style={{ ['--lg-cols' as string]: def.cols } as React.CSSProperties}
        >
          {Array.from({ length: Math.min(labelCount || def.cols, maxCapacity) }).map(
            (_, i) => (
              <div className="lg-preview-cell" key={i}>
                {labels[i] ?? ''}
              </div>
            ),
          )}
        </div>
      </div>

      {/* Acoes */}
      <div className="lg-actions">
        <button
          className="lg-btn lg-btn--primary"
          disabled={!hasContent || isProcessing}
          onClick={handleGenerate}
          type="button"
        >
          {isProcessing ? 'Processando...' : 'Gerar PDF de etiquetas'}
        </button>
      </div>

      <p className="lg-plena-note">
        Para impressao em papel etiqueta, leve o arquivo a Plena (a partir de R$&nbsp;3,50).
      </p>

      {error && (
        <p className="lg-error" role="alert">
          {error}
        </p>
      )}
    </section>
  )
}
