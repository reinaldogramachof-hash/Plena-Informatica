import { useState } from 'react'

import {
  calculatePrintCost,
  parseSafeNum,
  PLENA_PRICE_BLACK,
  PLENA_PRICE_COLOR,
  PLENA_PRICES_UPDATED_AT,
} from '../domain/print-cost'

import { createPrintCostPdf } from '../domain/create-print-cost-pdf'

import './print-cost-estimator.css'

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })
}

function triggerDownload(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function PrintCostEstimatorTool() {
  // Volume mensal
  const [pagesBlack, setPagesBlack]       = useState('')
  const [pagesColor, setPagesColor]       = useState('')

  // Custo da impressora
  const [cartridgeCost, setCartridgeCost]           = useState('')
  const [cartridgeYield, setCartridgeYield]         = useState('')
  const [paperResmaCost, setPaperResmaCost]         = useState('')
  const [paperResmaSheets, setPaperResmaSheets]     = useState('')
  const [maintenanceCost, setMaintenanceCost]       = useState('')

  // Accordeon
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  function handlePrint() {
    window.print()
  }

  const [year, month, day] = PLENA_PRICES_UPDATED_AT.split('-')
  const formattedDate = `${day}/${month}/${year}`

  const inputData = {
    pagesBlack:      parseSafeNum(pagesBlack),
    pagesColor:      parseSafeNum(pagesColor),
    cartridgeCost:   parseSafeNum(cartridgeCost),
    cartridgeYield:  parseSafeNum(cartridgeYield),
    paperResmaCost:  parseSafeNum(paperResmaCost),
    paperResmaSheets: parseSafeNum(paperResmaSheets),
    maintenanceCost: parseSafeNum(maintenanceCost),
  }
  const result = calculatePrintCost(inputData)
  const rawValues = [
    pagesBlack,
    pagesColor,
    cartridgeCost,
    cartridgeYield,
    paperResmaCost,
    paperResmaSheets,
    maintenanceCost,
  ]
  const hasNegativeValue = rawValues.some((value) => {
    const parsed = Number(value.replace(',', '.'))
    return Number.isFinite(parsed) && parsed < 0
  })
  const hasVolume = inputData.pagesBlack + inputData.pagesColor > 0
  const canGenerate = hasVolume && !hasNegativeValue

  async function handleDownloadPdf() {
    if (isProcessing || !canGenerate) return
    setError('')
    setIsProcessing(true)
    try {
      const bytes = await createPrintCostPdf(inputData, result)
      triggerDownload(bytes, 'plena-comparativo-impressao.pdf')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao gerar o PDF.')
    } finally {
      setIsProcessing(false)
    }
  }



  const verdictText = {
    economy: `Você economizaria ${formatCurrency(result.difference)} por mês indo à Plena.`,
    extra:   `Sua impressora própria é ${formatCurrency(result.difference)} mais barata por mês.`,
    tie:     'Os custos são praticamente iguais.',
  }[result.verdict]

  return (
    <section className="pce-tool" aria-labelledby="pce-title">
      <div className="pce-intro">
        <h2 id="pce-title">Calculadora de Impressão</h2>
        <p className="pce-subtitle">
          Compare o custo de imprimir em casa com o custo de terceirizar na Plena.
        </p>
      </div>

      <p className="pce-privacy-notice">
        Processamento 100% local — nenhum arquivo ou dado sai do seu dispositivo.
      </p>

      {/* Volume mensal */}
      <fieldset className="pce-fieldset">
        <legend className="pce-legend">Seu volume mensal</legend>
        <div className="pce-fields pce-fields--grid">
          <label className="pce-label">
            Páginas em preto por mês
            <input
              aria-label="Páginas em preto por mês"
              className="pce-input"
              min="0"
              onChange={(e) => setPagesBlack(e.target.value)}
              placeholder="0"
              type="number"
              value={pagesBlack}
            />
          </label>
          <label className="pce-label">
            Páginas coloridas por mês
            <input
              aria-label="Páginas coloridas por mês"
              className="pce-input"
              min="0"
              onChange={(e) => setPagesColor(e.target.value)}
              placeholder="0"
              type="number"
              value={pagesColor}
            />
          </label>
        </div>
      </fieldset>

      {/* Custo da impressora (accordeon) */}
      <div className="pce-details-wrapper">
        <button
          aria-controls="pce-printer-details"
          aria-expanded={detailsOpen ? 'true' : 'false'}
          className="pce-details-toggle"
          onClick={() => setDetailsOpen((o) => !o)}
          type="button"
        >
          <span>Custo estimado da sua impressora</span>
          <span className="pce-details-chevron" aria-hidden="true">
            {detailsOpen ? '▲' : '▼'}
          </span>
        </button>
        {detailsOpen && (
          <div className="pce-details-panel" id="pce-printer-details">
            <div className="pce-fields pce-fields--grid">
              <label className="pce-label">
                Custo do cartucho / toner (R$)
                <input
                  aria-label="Custo do cartucho / toner em reais"
                  className="pce-input"
                  min="0"
                  onChange={(e) => setCartridgeCost(e.target.value)}
                  placeholder="0,00"
                  step="0.01"
                  type="number"
                  value={cartridgeCost}
                />
              </label>
              <label className="pce-label">
                Rendimento do cartucho (páginas)
                <input
                  aria-label="Rendimento do cartucho em páginas"
                  className="pce-input"
                  min="0"
                  onChange={(e) => setCartridgeYield(e.target.value)}
                  placeholder="0"
                  type="number"
                  value={cartridgeYield}
                />
              </label>
              <label className="pce-label">
                Papel por resma (R$)
                <input
                  aria-label="Custo do papel por resma em reais"
                  className="pce-input"
                  min="0"
                  onChange={(e) => setPaperResmaCost(e.target.value)}
                  placeholder="0,00"
                  step="0.01"
                  type="number"
                  value={paperResmaCost}
                />
              </label>
              <label className="pce-label">
                Folhas por resma
                <input
                  aria-label="Quantidade de folhas por resma"
                  className="pce-input"
                  min="0"
                  onChange={(e) => setPaperResmaSheets(e.target.value)}
                  placeholder="500"
                  type="number"
                  value={paperResmaSheets}
                />
              </label>
              <label className="pce-label">
                Manutenção mensal estimada (R$)
                <input
                  aria-label="Custo de manutenção mensal estimado em reais"
                  className="pce-input"
                  min="0"
                  onChange={(e) => setMaintenanceCost(e.target.value)}
                  placeholder="0,00"
                  step="0.01"
                  type="number"
                  value={maintenanceCost}
                />
              </label>
            </div>
            <p className="pce-detail-hint">
              Preencha com os valores reais do seu equipamento para uma comparação precisa.
            </p>
          </div>
        )}
      </div>

      {/* Resultado */}
      <div className="pce-result" aria-label="Resultado da comparação">
        <div className="pce-result-cards">
          <div className="pce-result-card pce-result-card--own">
            <p className="pce-result-card-title">Impressora própria</p>
            <p className="pce-result-card-per-page">
              <span className="pce-result-label">Por página:</span>
              <span className="pce-result-value">
                {formatCurrency(result.ownCostPerPage)}
              </span>
            </p>
            <p className="pce-result-card-monthly">
              <span className="pce-result-label">Total mensal:</span>
              <strong className="pce-result-value pce-result-value--big">
                {formatCurrency(result.ownCostMonthly)}
              </strong>
            </p>
          </div>

          <div className="pce-result-divider" aria-hidden="true">
            <span className="pce-result-vs">VS</span>
          </div>

          <div className="pce-result-card pce-result-card--plena">
            <p className="pce-result-card-title">Na Plena</p>
            <p className="pce-result-card-per-page">
              <span className="pce-result-label">Por página (média):</span>
              <span className="pce-result-value">
                {formatCurrency(result.plenaCostPerPage)}
              </span>
            </p>
            <p className="pce-result-card-monthly">
              <span className="pce-result-label">Total mensal:</span>
              <strong className="pce-result-value pce-result-value--big">
                {formatCurrency(result.plenaCostMonthly)}
              </strong>
            </p>
            <p className="pce-result-plena-rates">
              Preto: {formatCurrency(PLENA_PRICE_BLACK)}/pág.
              {' · '}
              Colorido: {formatCurrency(PLENA_PRICE_COLOR)}/pág.
            </p>
            <p className="pce-result-plena-updated">
              Preços conferidos em {formattedDate}
            </p>
          </div>
        </div>

        <div className="pce-result-difference">
          <span className="pce-result-diff-label">Diferença entre os cenários:</span>
          <span className="pce-result-diff-value">{formatCurrency(result.difference)}</span>
        </div>

        {canGenerate && verdictText && (
          <p
            className={`pce-result-verdict pce-result-verdict--${result.verdict}`}
            aria-label="Conclusão da comparação"
          >
            {verdictText}
          </p>
        )}

        <p className="pce-result-disclaimer">
          Cálculo baseado nos valores informados e nos preços da Plena conferidos em {formattedDate}.
          Não inclui energia elétrica, depreciação, acabamento, encadernação, papel especial nem entrega.
          Confirme os preços atuais diretamente na Plena antes de tomar decisões.
        </p>
      </div>

      {/* Acoes */}
      <div className="pce-actions">
        <button
          className="pce-btn pce-btn--primary"
          disabled={isProcessing || !canGenerate}
          onClick={handleDownloadPdf}
          type="button"
        >
          {isProcessing ? 'Gerando PDF...' : 'Baixar comparativo PDF'}
        </button>
        <button
          className="pce-btn pce-btn--secondary"
          onClick={handlePrint}
          type="button"
        >
          Imprimir tela
        </button>
      </div>

      {!hasVolume && !hasNegativeValue && (
        <p className="pce-detail-hint">Informe ao menos uma página para gerar o comparativo.</p>
      )}

      {hasNegativeValue && (
        <p className="pce-error" role="alert">
          Use apenas valores iguais ou maiores que zero.
        </p>
      )}

      {error && (
        <p className="pce-error" role="alert">
          {error}
        </p>
      )}

      {/* Aviso editorial */}
      <p className="pce-editorial-notice">
        Esta calculadora é apenas orientativa e não representa proposta comercial.
      </p>
    </section>
  )
}
