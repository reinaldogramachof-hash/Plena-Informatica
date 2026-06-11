import { describe, expect, it } from 'vitest'

import {
  irpfItems,
  irpfQuestions,
  meiItems,
  meiQuestions,
  scenarios,
  type ChecklistItem,
  type ChecklistQuestion,
} from './checklist-catalog'

describe('checklist-catalog', () => {
  it('possui os dois públicos (mei e irpf) nas perguntas', () => {
    const meiAudiences = meiQuestions.map((q) => q.audience)
    const irpfAudiences = irpfQuestions.map((q) => q.audience)

    expect(meiAudiences.every((a) => a === 'mei')).toBe(true)
    expect(irpfAudiences.every((a) => a === 'irpf')).toBe(true)
  })

  it('possui os dois públicos (mei e irpf) nos itens', () => {
    const meiAudiences = meiItems.map((i) => i.audience)
    const irpfAudiences = irpfItems.map((i) => i.audience)

    expect(meiAudiences.every((a) => a === 'mei')).toBe(true)
    expect(irpfAudiences.every((a) => a === 'irpf')).toBe(true)
  })

  it('possui todos os 6 cenários MEI definidos', () => {
    const meiScenarios = scenarios.filter((s) => s.audience === 'mei')
    expect(meiScenarios).toHaveLength(6)

    const labels = meiScenarios.map((s) => s.label)
    expect(labels).toContain('Abertura de MEI')
    expect(labels).toContain('Alteração cadastral')
    expect(labels).toContain('Declaração Anual do MEI')
    expect(labels).toContain('Regularização de pendências')
    expect(labels).toContain('Emissão ou organização do DAS')
    expect(labels).toContain('Nota fiscal e organização documental')
  })

  it('IDs de perguntas são únicos', () => {
    const allIds = [...meiQuestions, ...irpfQuestions].map((q) => q.id)
    const unique = new Set(allIds)
    expect(unique.size).toBe(allIds.length)
  })

  it('IDs de itens são únicos', () => {
    const allIds = [...meiItems, ...irpfItems].map((i) => i.id)
    const unique = new Set(allIds)
    expect(unique.size).toBe(allIds.length)
  })

  it('IDs de cenários são únicos', () => {
    const allIds = scenarios.map((s) => s.id)
    const unique = new Set(allIds)
    expect(unique.size).toBe(allIds.length)
  })

  it('perguntas do tipo single-choice possuem opções válidas', () => {
    const singleChoice = [...meiQuestions, ...irpfQuestions].filter(
      (q): q is ChecklistQuestion => q.type === 'single-choice',
    )
    for (const q of singleChoice) {
      expect(q.options).toBeDefined()
      expect(Array.isArray(q.options)).toBe(true)
      expect(q.options!.length).toBeGreaterThan(0)
      for (const opt of q.options!) {
        expect(typeof opt.value).toBe('string')
        expect(typeof opt.label).toBe('string')
      }
    }
  })

  it('todos os itens possuem categoria preenchida', () => {
    const allItems: ChecklistItem[] = [...meiItems, ...irpfItems]
    for (const item of allItems) {
      expect(item.category).toBeTruthy()
    }
  })

  it('não contém pedido de senha, token ou credencial nas labels dos itens', () => {
    const sensitiveTerms = ['senha', 'token', 'credencial', 'código de acesso']
    const allItems = [...meiItems, ...irpfItems]
    for (const item of allItems) {
      for (const term of sensitiveTerms) {
        // atenção pode mencionar senha com aviso, mas título/descrição não devem solicitar
        expect(
          item.title.toLowerCase(),
          `Item "${item.id}" solicita dado sensível "${term}" no título`,
        ).not.toContain(term)
      }
    }
  })

  it('não contém pedido de senha nas labels das perguntas', () => {
    const allQuestions = [...meiQuestions, ...irpfQuestions]
    for (const q of allQuestions) {
      expect(q.label.toLowerCase()).not.toContain('senha')
      expect(q.label.toLowerCase()).not.toContain('token')
    }
  })
})
