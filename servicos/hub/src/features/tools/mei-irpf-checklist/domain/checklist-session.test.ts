import { describe, expect, it } from 'vitest'

import {
  createSession,
  resetSession,
  setAnswer,
  setAudience,
  setScenario,
  toggleChecked,
} from './checklist-session'

describe('checklist-session', () => {
  it('cria sessão vazia', () => {
    const session = createSession()
    expect(session.audience).toBeNull()
    expect(session.scenarioId).toBeNull()
    expect(session.answers).toEqual({})
    expect(session.checked.size).toBe(0)
  })

  it('define o público e limpa dados anteriores', () => {
    let session = createSession()
    session = setAnswer(session, 'mei-q-govbr', true)
    session = setAudience(session, 'mei')

    expect(session.audience).toBe('mei')
    expect(session.answers).toEqual({})
  })

  it('define o cenário e limpa respostas', () => {
    let session = createSession()
    session = setAudience(session, 'mei')
    session = setAnswer(session, 'mei-q-govbr', true)
    session = setScenario(session, 'mei-abertura')

    expect(session.scenarioId).toBe('mei-abertura')
    expect(session.answers).toEqual({})
  })

  it('registra resposta para uma pergunta', () => {
    let session = createSession()
    session = setAudience(session, 'mei')
    session = setAnswer(session, 'mei-q-faturamento', true)

    expect(session.answers['mei-q-faturamento']).toBe(true)
  })

  it('marca e desmarca item do checklist', () => {
    let session = createSession()
    session = toggleChecked(session, 'mei-rg')
    expect(session.checked.has('mei-rg')).toBe(true)

    session = toggleChecked(session, 'mei-rg')
    expect(session.checked.has('mei-rg')).toBe(false)
  })

  it('reiniciar limpa respostas e marcações', () => {
    let session = createSession()
    session = setAudience(session, 'irpf')
    session = setAnswer(session, 'irpf-q-emprego', true)
    toggleChecked(session, 'irpf-rg')

    session = resetSession()

    expect(session.audience).toBeNull()
    expect(session.answers).toEqual({})
    expect(session.checked.size).toBe(0)
  })
})
