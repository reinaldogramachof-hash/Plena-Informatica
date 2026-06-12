import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../../../lib/use-local-storage'

import {
  irpfQuestions,
  meiQuestions,
  scenarios,
  type ChecklistAudience,
  type ChecklistQuestion,
} from '../domain/checklist-catalog'
import { buildChecklist } from '../domain/build-checklist'
import { createChecklistPdf } from '../domain/create-checklist-pdf'
import {
  createSession,
  resetSession,
  setAnswer,
  setAudience,
  setScenario,
  toggleChecked,
  type ChecklistSession,
} from '../domain/checklist-session'

import './mei-irpf-checklist.css'

type Step = 'audience' | 'scenario' | 'questions' | 'result'

const STEP_LABELS: Record<Step, string> = {
  audience: 'Tema',
  scenario: 'Situação',
  questions: 'Perguntas',
  result: 'Checklist',
}

const STEP_ORDER: Step[] = ['audience', 'scenario', 'questions', 'result']

function stepIndex(step: Step): number {
  return STEP_ORDER.indexOf(step)
}

const WARNINGS = [
  'Este checklist ajuda a organizar documentos e não substitui orientação contábil, fiscal ou jurídica.',
  'Não informe senhas, códigos de acesso, tokens ou credenciais governamentais.',
  'Os dados selecionados permanecem somente neste navegador.',
]

export function MeiIrpfChecklistTool() {
  interface ChecklistStateData {
    step: Step
    session: ChecklistSession
  }

  const [checklistState, setChecklistState] = useLocalStorage<ChecklistStateData>(
    'plena-hub-checklist-v1',
    {
      step: 'audience',
      session: createSession(),
    }
  )

  const step = checklistState.step
  const session = checklistState.session

  const setStep = (newStep: Step | ((prev: Step) => Step)) => {
    setChecklistState((prev) => ({
      ...prev,
      step: newStep instanceof Function ? newStep(prev.step) : newStep,
    }))
  }

  const setSession = (newSession: ChecklistSession | ((prev: ChecklistSession) => ChecklistSession)) => {
    setChecklistState((prev) => ({
      ...prev,
      session: newSession instanceof Function ? newSession(prev.session) : newSession,
    }))
  }

  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const groups = useMemo(() => {
    if (step === 'result') {
      return buildChecklist(session)
    }
    return []
  }, [step, session])

  function handleSelectAudience(audience: ChecklistAudience) {
    setSession((s) => setAudience(s, audience))
    // Avança automaticamente para o próximo passo
    if (audience === 'irpf') {
      setStep('questions')
    } else {
      setStep('scenario')
    }
  }

  function handleSelectScenario(scenarioId: string) {
    setSession((s) => setScenario(s, scenarioId))
  }

  function handleAnswer(questionId: string, value: boolean | string) {
    setSession((s) => setAnswer(s, questionId, value))
  }

  function handleToggleChecked(itemId: string) {
    setSession((s) => toggleChecked(s, itemId))
  }

  function handleContinue() {
    if (step === 'audience') {
      if (!session.audience) return
      // Se for IRPF não há seleção de cenário, pula direto para perguntas
      if (session.audience === 'irpf') {
        setStep('questions')
      } else {
        setStep('scenario')
      }
      return
    }
    if (step === 'scenario') {
      if (!session.scenarioId) return
      setStep('questions')
      return
    }
    if (step === 'questions') {
      setStep('result')
      return
    }
  }

  function handleBack() {
    if (step === 'result') {
      setStep('questions')
      return
    }
    if (step === 'questions') {
      if (session.audience === 'irpf') {
        setStep('audience')
      } else {
        setStep('scenario')
      }
      return
    }
    if (step === 'scenario') {
      setStep('audience')
      return
    }
  }

  function handleReset() {
    const confirmed = window.confirm(
      'Deseja realmente reiniciar o checklist? Todo o seu progresso será perdido.',
    )
    if (!confirmed) return
    setSession(resetSession())
    setStep('audience')
  }

  function handlePrint() {
    window.print()
  }

  async function handleDownloadPdf() {
    if (!session.audience) return
    setDownloadError(null)
    setIsDownloading(true)
    try {
      const pdfBytes = await createChecklistPdf(groups, session, session.audience)
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const filename =
        session.audience === 'mei' ? 'plena-checklist-mei.pdf' : 'plena-checklist-irpf.pdf'
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      setDownloadError('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.')
    } finally {
      setIsDownloading(false)
    }
  }

  const currentStepIdx = stepIndex(step)

  const questions: ChecklistQuestion[] =
    session.audience === 'mei' ? meiQuestions : irpfQuestions

  const meiScenarios = scenarios.filter((s) => s.audience === 'mei')

  const totalItems = groups.reduce((acc, g) => acc + g.items.length, 0)
  const checkedCount = groups.reduce(
    (acc, g) => acc + g.items.filter((i) => session.checked.has(i.id)).length,
    0,
  )
  return (
    <section className="mic-tool" aria-labelledby="mic-tool-title">
      <div className="mic-header">
        <h2 id="mic-tool-title">Checklist MEI e IRPF</h2>
        <p>Monte sua lista personalizada de documentos e providências.</p>
      </div>

      <div className="mic-warnings" aria-label="Avisos importantes">
        {WARNINGS.map((w) => (
          <p className="mic-warning" key={w}>
            {w}
          </p>
        ))}
      </div>

      {/* Indicador de etapas */}
      <ol className="mic-steps" aria-label="Etapas">
        {STEP_ORDER.map((s, idx) => {
          const isActive = s === step
          const isDone = idx < currentStepIdx
          return (
            <li
              key={s}
              className={[
                'mic-step',
                isActive ? 'mic-step--active' : '',
                isDone ? 'mic-step--done' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span
                className="mic-step__dot"
                aria-current={isActive ? 'step' : undefined}
              >
                {isDone ? '✓' : idx + 1}
              </span>
              <span>{STEP_LABELS[s]}</span>
              {idx < STEP_ORDER.length - 1 && (
                <span className="mic-step__sep" aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>

      {/* ---- Etapa 1: escolha de público ---- */}
      {step === 'audience' && (
        <div className="mic-stage">
          <h3 className="mic-stage__title">Qual é o seu tema?</h3>
          <div className="mic-audience-grid">
            <button
              className={[
                'mic-audience-btn',
                session.audience === 'mei' ? 'mic-audience-btn--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleSelectAudience('mei')}
              type="button"
            >
              <span>MEI</span>
              <span className="mic-audience-btn__label">
                Microempreendedor Individual
              </span>
            </button>
            <button
              className={[
                'mic-audience-btn',
                session.audience === 'irpf' ? 'mic-audience-btn--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleSelectAudience('irpf')}
              type="button"
            >
              <span>IRPF</span>
              <span className="mic-audience-btn__label">
                Declaração do Imposto de Renda
              </span>
            </button>
          </div>
          <nav className="mic-nav">
            <button
              className="mic-btn mic-btn--primary"
              disabled={!session.audience}
              onClick={handleContinue}
              type="button"
            >
              Continuar
            </button>
          </nav>
        </div>
      )}

      {/* ---- Etapa 2: escolha de cenário (MEI) ---- */}
      {step === 'scenario' && (
        <div className="mic-stage">
          <h3 className="mic-stage__title">
            Qual é a sua necessidade hoje?
          </h3>
          <div className="mic-scenarios">
            {meiScenarios.map((sc) => (
              <button
                className={[
                  'mic-scenario-btn',
                  session.scenarioId === sc.id
                    ? 'mic-scenario-btn--selected'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={sc.id}
                onClick={() => handleSelectScenario(sc.id)}
                type="button"
              >
                <span className="mic-scenario-btn__title">{sc.label}</span>
                <span className="mic-scenario-btn__desc">{sc.description}</span>
              </button>
            ))}
          </div>
          <nav className="mic-nav">
            <button
              className="mic-btn mic-btn--secondary"
              onClick={handleBack}
              type="button"
            >
              Voltar
            </button>
            <button
              className="mic-btn mic-btn--primary"
              disabled={!session.scenarioId}
              onClick={handleContinue}
              type="button"
            >
              Continuar
            </button>
          </nav>
        </div>
      )}

      {/* ---- Etapa 3: perguntas ---- */}
      {step === 'questions' && (
        <div className="mic-stage">
          <h3 className="mic-stage__title">
            Responda para personalizar seu checklist
          </h3>
          <div className="mic-questions">
            {questions.map((q) => {
              const answer = session.answers[q.id]
              return (
                <fieldset className="mic-question" key={q.id}>
                  <legend>{q.label}</legend>
                  {q.description && (
                    <p className="mic-question__desc">{q.description}</p>
                  )}
                  <div className="mic-question__options">
                    {q.type === 'boolean' && (
                      <>
                        <button
                          className={[
                            'mic-option-btn',
                            answer === true ? 'mic-option-btn--selected' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => handleAnswer(q.id, true)}
                          type="button"
                        >
                          Sim
                        </button>
                        <button
                          className={[
                            'mic-option-btn',
                            answer === false
                              ? 'mic-option-btn--selected'
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => handleAnswer(q.id, false)}
                          type="button"
                        >
                          Não
                        </button>
                      </>
                    )}
                    {q.type === 'single-choice' &&
                      q.options?.map((opt) => (
                        <button
                          className={[
                            'mic-option-btn',
                            answer === opt.value
                              ? 'mic-option-btn--selected'
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          key={opt.value}
                          onClick={() => handleAnswer(q.id, opt.value)}
                          type="button"
                        >
                          {opt.label}
                        </button>
                      ))}
                  </div>
                </fieldset>
              )
            })}
          </div>
          <nav className="mic-nav">
            <button
              className="mic-btn mic-btn--secondary"
              onClick={handleBack}
              type="button"
            >
              Voltar
            </button>
            <button
              className="mic-btn mic-btn--primary"
              onClick={handleContinue}
              type="button"
            >
              Continuar
            </button>
          </nav>
        </div>
      )}

      {/* ---- Etapa 4: resultado ---- */}
      {step === 'result' && (
        <div className="mic-stage mic-result">
          <h3 className="mic-result__title">Seu checklist personalizado</h3>

          <div className="mic-progress">
            <progress
              className="mic-progress__bar"
              aria-hidden="true"
              max={totalItems}
              value={checkedCount}
            />
            <p className="mic-progress__label" role="status">
              {checkedCount} de {totalItems} itens separados
            </p>
          </div>

          {groups.map((group) => (
            <div className="mic-group" key={group.category}>
              <h4 className="mic-group__title">{group.category}</h4>
              <ul className="mic-items">
                {group.items.map((item) => {
                  const isChecked = session.checked.has(item.id)
                  return (
                    <li
                      className={[
                        'mic-item',
                        isChecked ? 'mic-item--checked' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      key={item.id}
                    >
                      <input
                        checked={isChecked}
                        className="mic-item__checkbox"
                        id={`mic-chk-${item.id}`}
                        onChange={() => handleToggleChecked(item.id)}
                        type="checkbox"
                        aria-label={item.title}
                      />
                      <label
                        className="mic-item__body"
                        htmlFor={`mic-chk-${item.id}`}
                      >
                        <span className="mic-item__title">{item.title}</span>
                        <span className="mic-item__desc">{item.description}</span>
                        {item.attention && (
                          <span className="mic-item__attention">
                            {item.attention}
                          </span>
                        )}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          {/* Avisos impressos junto com o checklist */}
          <div className="mic-print-warnings" aria-hidden="true">
            {WARNINGS.map((w) => (
              <p className="mic-print-warning" key={w}>
                {w}
              </p>
            ))}
          </div>

          {downloadError && (
            <div className="mic-error-msg" role="alert" style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.875rem' }}>
              {downloadError}
            </div>
          )}

          <nav className="mic-nav">
            <button
              className="mic-btn mic-btn--secondary"
              onClick={handleBack}
              type="button"
            >
              Voltar
            </button>
            <button
              className="mic-btn mic-btn--ghost"
              onClick={handlePrint}
              type="button"
            >
              Imprimir Checklist
            </button>
            <button
              className="mic-btn mic-btn--primary"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              type="button"
            >
              {isDownloading ? 'Gerando PDF...' : 'Baixar PDF'}
            </button>
            <span className="mic-spacer" />
            <button
              className="mic-btn mic-btn--danger"
              onClick={handleReset}
              type="button"
            >
              Reiniciar
            </button>
          </nav>
        </div>
      )}
    </section>
  )
}
