import { useState } from 'react'

import './label-generator.css'

export type LabelLayout = '2x6' | '3x9' | '4x13'

const LAYOUT_CAPACITY: Record<LabelLayout, number> = {
  '2x6': 12,
  '3x9': 27,
  '4x13': 52,
}

const LAYOUT_GRID: Record<LabelLayout, { cols: number; rows: number }> = {
  '2x6': { cols: 2, rows: 6 },
  '3x9': { cols: 3, rows: 9 },
  '4x13': { cols: 4, rows: 13 },
}

export interface LabelGeneratorToolProps {
  generatePdf?: (labels: string[], layout: LabelLayout) => Promise<Uint8Array>
}

export function LabelGeneratorTool({
  generatePdf = async () => new Uint8Array(),
}: LabelGeneratorToolProps) {
  const [content, setContent] = useState('')
  const [layout, setLayout] = useState<LabelLayout>('2x6')
  const [withBorder, setWithBorder] = useState(false)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const labels = content
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const labelCount = labels.length
  const maxCapacity = LAYOUT_CAPACITY[layout]
  const exceeds = labelCount > maxCapacity
  const hasContent = labelCount > 0

  const gridConfig = LAYOUT_GRID[layout]

  async function handleGenerate() {
    if (!hasContent || isProcessing) return
    setError('')
    setIsProcessing(true)
    try {
      await generatePdf(labels, layout)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível gerar o PDF de etiquetas. Tente novamente.',
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
          Crie etiquetas para impressão em folha A4 padrão.
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
                2×6 — 12 etiquetas por página (Pimaco 6182)
              </option>
              <option value="3x9">
                3×9 — 27 etiquetas por página (Pimaco 6080)
              </option>
              <option value="4x13">
                4×13 — 52 etiquetas por página (Pimaco 6080 mini)
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

      {/* Conteúdo das etiquetas */}
      <fieldset className="lg-fieldset">
        <legend className="lg-legend">Conteúdo das etiquetas</legend>
        <div className="lg-content-area">
          <textarea
            aria-label="Conteúdo das etiquetas, uma por linha"
            className="lg-textarea"
            onChange={(e) => setContent(e.target.value)}
            placeholder={'Digite uma etiqueta por linha:\nJoão da Silva\nMaria Souza\nEmpresa XPTO Ltda'}
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
                Atenção: {labelCount} etiquetas excedem o limite de {maxCapacity} do layout selecionado. As extras serão colocadas em páginas adicionais.
              </span>
            )}
          </div>
        </div>
      </fieldset>

      {/* Prévia */}
      <div className="lg-preview-section">
        <p className="lg-preview-label">Prévia</p>
        <div
          className={['lg-preview', withBorder ? 'lg-preview--border' : ''].filter(Boolean).join(' ')}
          aria-label="Prévia das etiquetas"
          style={{ ['--lg-cols' as string]: gridConfig.cols } as React.CSSProperties}
        >
          {Array.from({ length: Math.min(labelCount || gridConfig.cols, maxCapacity) }).map(
            (_, i) => (
              <div className="lg-preview-cell" key={i}>
                {labels[i] ?? ''}
              </div>
            ),
          )}
        </div>
      </div>

      {/* Ações */}
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
        Para impressão em papel etiqueta, leve o arquivo à Plena (a partir de R$&nbsp;3,50).
      </p>

      {error && (
        <p className="lg-error" role="alert">
          {error}
        </p>
      )}
    </section>
  )
}
