import { useState } from 'react'

import './mei-das-guide.css'

type ActivityType =
  | 'commerce'
  | 'services'
  | 'both'
  | 'transport'

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

interface DasTableRow {
  component: string
  value: string
  note: string
}

function getDasRows(
  activity: ActivityType | null,
  hasEmployee: boolean,
): DasTableRow[] {
  if (!activity) return []
  // Valores ilustrativos — o Codex preencherá com os vigentes
  const rows: DasTableRow[] = [
    {
      component: 'INSS',
      value: '{valor}',
      note: 'Previdência social — obrigatório para todos',
    },
  ]
  if (activity === 'commerce' || activity === 'both') {
    rows.push({
      component: 'ICMS',
      value: '{valor}',
      note: 'Imposto estadual — comércio',
    })
  }
  if (
    activity === 'services' ||
    activity === 'both' ||
    activity === 'transport'
  ) {
    rows.push({
      component: 'ISS',
      value: '{valor}',
      note: 'Imposto municipal — serviços',
    })
  }
  if (hasEmployee) {
    rows.push({
      component: 'CPP (empregado)',
      value: '{valor}',
      note: '3% sobre salário do empregado',
    })
  }
  return rows
}

export function MeiDasGuideTool() {
  const [activity, setActivity] = useState<ActivityType | null>(null)
  const [hasEmployee, setHasEmployee] = useState(false)
  const [paidMonths, setPaidMonths] = useState<Set<number>>(new Set())

  function toggleMonth(index: number) {
    setPaidMonths((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  function handlePrint() {
    window.print()
  }

  const dasRows = getDasRows(activity, hasEmployee)
  const totalPaid = paidMonths.size

  return (
    <section className="mdg-tool" aria-labelledby="mdg-title">
      <div className="mdg-intro">
        <h2 id="mdg-title">Guia DAS MEI</h2>
        <p className="mdg-subtitle">
          Entenda os valores mensais do DAS e organize suas guias.
        </p>
      </div>

      {/* Aviso editorial obrigatório */}
      <div className="mdg-editorial-notice" role="note">
        <p>
          <strong>Atenção:</strong> Este guia é apenas orientativo. Os valores do DAS são
          reajustados anualmente pela Receita Federal. Confirme os valores vigentes no
          Portal do Empreendedor{' '}
          <span className="mdg-url">
            (gov.br/empresas-e-negocios/mei)
          </span>{' '}
          antes de efetuar qualquer pagamento.
        </p>
      </div>

      {/* Atividade principal */}
      <fieldset className="mdg-fieldset" id="mdg-activity-group">
        <legend className="mdg-legend">
          Qual é a sua atividade principal?
        </legend>
        <div className="mdg-activity-grid">
          {(
            [
              { value: 'commerce', label: 'Comércio' },
              { value: 'services', label: 'Serviços' },
              { value: 'both', label: 'Comércio e Serviços' },
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

        <label className="mdg-employee-checkbox">
          <input
            checked={hasEmployee}
            onChange={(e) => setHasEmployee(e.target.checked)}
            type="checkbox"
          />
          Tenho empregado registrado
        </label>
      </fieldset>

      {/* Tabela DAS */}
      {activity && (
        <div className="mdg-das-section">
          <h3 className="mdg-section-title">Componentes do DAS</h3>
          <table className="mdg-table">
            <thead>
              <tr>
                <th>Componente</th>
                <th>Valor fixo</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {dasRows.map((row) => (
                <tr key={row.component}>
                  <td className="mdg-td-component">{row.component}</td>
                  <td className="mdg-td-value">{row.value}</td>
                  <td className="mdg-td-note">{row.note}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="mdg-table-total">
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>—</strong>
                </td>
                <td className="mdg-td-note">
                  Valores ilustrativos. Consulte gov.br para valores vigentes.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Orientações sobre o DAS */}
      <div className="mdg-info-section">
        <h3 className="mdg-section-title">Sobre o DAS</h3>
        <div className="mdg-info-card">
          <p>
            O <strong>DAS</strong> (Documento de Arrecadação do Simples Nacional) é o
            boleto mensal do MEI. Ele unifica o INSS e os impostos municipais e/ou
            estaduais em um único pagamento.
          </p>
          <ul className="mdg-info-list">
            <li>
              <strong>Vencimento:</strong> Todo dia 20 de cada mês
            </li>
            <li>
              <strong>Como pagar:</strong> Acesse o PGMEI no Portal do Empreendedor
            </li>
            <li>
              <strong>Emissão do boleto:</strong>{' '}
              <span className="mdg-url">
                gov.br/empresas-e-negocios/mei → PGMEI
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Situação das guias */}
      <div className="mdg-months-section">
        <h3 className="mdg-section-title">Situação das guias</h3>
        <p className="mdg-months-hint">
          Marque os meses em que você pagou o DAS:
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
            Imprimir organização
          </button>
        </div>
      </div>

      {/* Aviso de privacidade de sessão */}
      <p className="mdg-session-notice">
        Suas marcações ficam somente neste navegador e são apagadas ao fechar a aba.
      </p>
    </section>
  )
}
