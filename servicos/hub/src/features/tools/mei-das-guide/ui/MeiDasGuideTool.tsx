import { useState } from 'react'

import { getDasInfo } from '../domain/das-values'
import type { ActivityType } from '../domain/das-values'

import './mei-das-guide.css'

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

const PORTAL_URL = 'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor'
const PGMEI_URL  = 'https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app'

export function MeiDasGuideTool() {
  const [activity, setActivity]       = useState<ActivityType | null>(null)
  const [paidMonths, setPaidMonths]   = useState<Set<number>>(new Set())

  function toggleMonth(index: number) {
    setPaidMonths((prev) => {
      const next = new Set(prev)
      if (next.has(index)) { next.delete(index) } else { next.add(index) }
      return next
    })
  }

  function handlePrint() {
    window.print()
  }

  const dasInfo = activity ? getDasInfo(activity) : null
  const totalPaid = paidMonths.size

  return (
    <section className="mdg-tool" aria-labelledby="mdg-title">
      <div className="mdg-intro">
        <h2 id="mdg-title">Guia DAS MEI</h2>
        <p className="mdg-subtitle">
          Entenda os valores mensais do DAS e organize suas guias.
        </p>
      </div>

      {/* Aviso editorial obrigatorio */}
      <div className="mdg-editorial-notice" role="note">
        <p>
          <strong>Atencao:</strong> Este guia e apenas orientativo. Os valores do DAS sao
          reajustados anualmente pela Receita Federal. Confirme os valores vigentes no{' '}
          <a
            href={PORTAL_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Portal do Empreendedor (gov.br)
          </a>{' '}
          antes de efetuar qualquer pagamento.
        </p>
      </div>

      {/* Atividade principal */}
      <fieldset className="mdg-fieldset" id="mdg-activity-group">
        <legend className="mdg-legend">
          Qual e a sua atividade principal?
        </legend>
        <div className="mdg-activity-grid">
          {(
            [
              { value: 'commerce',  label: 'Comercio' },
              { value: 'services',  label: 'Servicos' },
              { value: 'both',      label: 'Comercio e Servicos' },
              { value: 'transport', label: 'Transporte de passageiros' },
            ] as { value: ActivityType; label: string }[]
          ).map((opt) => (
            <label
              className={[
                'mdg-activity-btn',
                activity === opt.value ? 'mdg-activity-btn--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={opt.value}
            >
              <input
                checked={activity === opt.value}
                name="mdg-activity"
                onChange={() => setActivity(opt.value)}
                type="radio"
                value={opt.value}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Tabela DAS */}
      {dasInfo && (
        <div className="mdg-das-section">
          <h3 className="mdg-section-title">Componentes do DAS</h3>
          <table className="mdg-table">
            <thead>
              <tr>
                <th>Componente</th>
                <th>Valor fixo</th>
                <th>Observacao</th>
              </tr>
            </thead>
            <tbody>
              {dasInfo.components.map((row) => (
                <tr key={row.component}>
                  <td className="mdg-td-component">{row.component}</td>
                  <td className="mdg-td-value">{formatCurrency(row.value)}</td>
                  <td className="mdg-td-note">{row.note}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="mdg-table-total">
                <td><strong>Total</strong></td>
                <td><strong>{formatCurrency(dasInfo.total)}</strong></td>
                <td className="mdg-td-note">
                  Referencia: {dasInfo.year} — {dasInfo.sourceLabel}.{' '}
                  <a
                    href={dasInfo.sourceUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Ver fonte oficial
                  </a>
                </td>
              </tr>
            </tfoot>
          </table>
          <p className="mdg-das-warning">
            Os valores acima sao os vigentes para {dasInfo.year}, conferidos em{' '}
            {dasInfo.checkedAt}. Podem ser alterados em exercicios futuros.
          </p>
        </div>
      )}

      {/* Orientacoes sobre o DAS */}
      <div className="mdg-info-section">
        <h3 className="mdg-section-title">Sobre o DAS</h3>
        <div className="mdg-info-card">
          <p>
            O <strong>DAS</strong> (Documento de Arrecadacao do Simples Nacional) e o
            boleto mensal do MEI. Ele unifica o INSS e os impostos municipais e/ou
            estaduais em um unico pagamento.
          </p>
          <ul className="mdg-info-list">
            <li>
              <strong>Vencimento:</strong> Todo dia 20 de cada mes
            </li>
            <li>
              <strong>Como pagar:</strong> Acesse o PGMEI no Portal do Empreendedor
            </li>
            <li>
              <strong>Emissao do boleto:</strong>{' '}
              <a
                href={PGMEI_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                PGMEI — Simples Nacional
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Situacao das guias */}
      <div className="mdg-months-section">
        <h3 className="mdg-section-title">Situacao das guias</h3>
        <p className="mdg-months-hint">
          Marque os meses em que voce pagou o DAS:
        </p>
        <div className="mdg-months-grid" role="group" aria-label="Meses do ano">
          {MONTHS.map((month, i) => (
            <label
              className={[
                'mdg-month-item',
                paidMonths.has(i) ? 'mdg-month-item--paid' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={month}
            >
              <input
                aria-label={month}
                checked={paidMonths.has(i)}
                onChange={() => toggleMonth(i)}
                type="checkbox"
              />
              <span className="mdg-month-name">{month}</span>
            </label>
          ))}
        </div>
        <p className="mdg-months-counter" aria-live="polite">
          {totalPaid} de 12 meses marcados
        </p>

        <div className="mdg-months-actions">
          <button
            className="mdg-btn mdg-btn--secondary"
            onClick={handlePrint}
            type="button"
          >
            Imprimir organizacao
          </button>
        </div>
      </div>

      {/* Aviso de privacidade de sessao */}
      <p className="mdg-session-notice">
        Suas marcacoes ficam somente neste navegador e sao apagadas ao fechar a aba.
      </p>
    </section>
  )
}
