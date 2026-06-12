import { describe, expect, it } from 'vitest'

import { buildChecklist } from './build-checklist'
import {
  createSession,
  setAnswer,
  setAudience,
  setScenario,
} from './checklist-session'

describe('build-checklist', () => {
  it('gera checklist básico de MEI sem respostas condicionais', () => {
    let session = createSession()
    session = setAudience(session, 'mei')
    session = setScenario(session, 'mei-abertura')

    const groups = buildChecklist(session)

    expect(groups.length).toBeGreaterThan(0)
    const allItems = groups.flatMap((g) => g.items)
    expect(allItems.every((i) => i.audience === 'mei')).toBe(true)
  })

  it('exige um cenário para gerar checklist MEI', () => {
    let session = createSession()
    session = setAudience(session, 'mei')

    expect(buildChecklist(session)).toEqual([])
  })

  it('gera itens diferentes para abertura, DAS e notas fiscais', () => {
    let opening = setAudience(createSession(), 'mei')
    opening = setScenario(opening, 'mei-abertura')

    let das = setAudience(createSession(), 'mei')
    das = setScenario(das, 'mei-das')

    let invoices = setAudience(createSession(), 'mei')
    invoices = setScenario(invoices, 'mei-notas')

    const openingIds = buildChecklist(opening).flatMap((group) =>
      group.items.map((item) => item.id),
    )
    const dasIds = buildChecklist(das).flatMap((group) =>
      group.items.map((item) => item.id),
    )
    const invoiceIds = buildChecklist(invoices).flatMap((group) =>
      group.items.map((item) => item.id),
    )

    expect(openingIds).toContain('mei-cnae')
    expect(openingIds).not.toContain('mei-das-pagos')
    expect(dasIds).toContain('mei-das-pagos')
    expect(dasIds).not.toContain('mei-cnae')
    expect(invoiceIds).toContain('mei-habilitacao-nfe')
    expect(invoiceIds).not.toContain('mei-das-pagos')
  })

  it('inclui itens de faturamento quando teve faturamento = true', () => {
    let session = createSession()
    session = setAudience(session, 'mei')
    session = setScenario(session, 'mei-declaracao')
    session = setAnswer(session, 'mei-q-faturamento', true)

    const groups = buildChecklist(session)
    const allItems = groups.flatMap((g) => g.items)
    const ids = allItems.map((i) => i.id)

    expect(ids).toContain('mei-relatorio-receitas')
    expect(ids).toContain('mei-comprovante-receitas')
  })

  it('não inclui itens de faturamento quando teve faturamento = false', () => {
    let session = createSession()
    session = setAudience(session, 'mei')
    session = setScenario(session, 'mei-declaracao')
    session = setAnswer(session, 'mei-q-faturamento', false)

    const groups = buildChecklist(session)
    const allItems = groups.flatMap((g) => g.items)
    const ids = allItems.map((i) => i.id)

    expect(ids).not.toContain('mei-relatorio-receitas')
  })

  it('inclui itens de empregado somente quando possui empregado = true', () => {
    let session = createSession()
    session = setAudience(session, 'mei')
    session = setScenario(session, 'mei-declaracao')
    session = setAnswer(session, 'mei-q-empregado', true)

    const groups = buildChecklist(session)
    const allItems = groups.flatMap((g) => g.items)
    const ids = allItems.map((i) => i.id)

    expect(ids).toContain('mei-empregado-carteira')
    expect(ids).toContain('mei-empregado-guias')
  })

  it('não inclui itens de empregado quando possui empregado = false', () => {
    let session = createSession()
    session = setAudience(session, 'mei')
    session = setScenario(session, 'mei-declaracao')
    session = setAnswer(session, 'mei-q-empregado', false)

    const groups = buildChecklist(session)
    const allItems = groups.flatMap((g) => g.items)
    const ids = allItems.map((i) => i.id)

    expect(ids).not.toContain('mei-empregado-carteira')
  })

  it('gera checklist básico de IRPF', () => {
    let session = createSession()
    session = setAudience(session, 'irpf')

    const groups = buildChecklist(session)

    expect(groups.length).toBeGreaterThan(0)
    const allItems = groups.flatMap((g) => g.items)
    expect(allItems.every((i) => i.audience === 'irpf')).toBe(true)
  })

  it('inclui dependentes somente quando informado = true', () => {
    let session = createSession()
    session = setAudience(session, 'irpf')
    session = setAnswer(session, 'irpf-q-dependentes', true)

    const groups = buildChecklist(session)
    const ids = groups.flatMap((g) => g.items).map((i) => i.id)

    expect(ids).toContain('irpf-dependentes-cpf')
    expect(ids).toContain('irpf-dependentes-rendimentos')
  })

  it('não inclui dependentes quando não informado', () => {
    let session = createSession()
    session = setAudience(session, 'irpf')
    session = setAnswer(session, 'irpf-q-dependentes', false)

    const groups = buildChecklist(session)
    const ids = groups.flatMap((g) => g.items).map((i) => i.id)

    expect(ids).not.toContain('irpf-dependentes-cpf')
  })

  it('inclui saúde condicionalmente', () => {
    let session = createSession()
    session = setAudience(session, 'irpf')
    session = setAnswer(session, 'irpf-q-saude', true)

    const ids = buildChecklist(session).flatMap((g) => g.items).map((i) => i.id)
    expect(ids).toContain('irpf-recibos-medicos')
  })

  it('inclui educação condicionalmente', () => {
    let session = createSession()
    session = setAudience(session, 'irpf')
    session = setAnswer(session, 'irpf-q-educacao', true)

    const ids = buildChecklist(session).flatMap((g) => g.items).map((i) => i.id)
    expect(ids).toContain('irpf-recibos-educacao')
  })

  it('inclui investimentos condicionalmente', () => {
    let session = createSession()
    session = setAudience(session, 'irpf')
    session = setAnswer(session, 'irpf-q-investimentos', true)

    const ids = buildChecklist(session).flatMap((g) => g.items).map((i) => i.id)
    expect(ids).toContain('irpf-extratos-bancarios')
  })

  it('inclui bens condicionalmente (imóvel)', () => {
    let session = createSession()
    session = setAudience(session, 'irpf')
    session = setAnswer(session, 'irpf-q-imovel', true)

    const ids = buildChecklist(session).flatMap((g) => g.items).map((i) => i.id)
    expect(ids).toContain('irpf-bens-imovel')
  })

  it('inclui criptoativos condicionalmente', () => {
    let session = createSession()
    session = setAudience(session, 'irpf')
    session = setAnswer(session, 'irpf-q-bolsa', true)

    const ids = buildChecklist(session).flatMap((g) => g.items).map((i) => i.id)
    expect(ids).toContain('irpf-bolsa')
  })

  it('remove duplicidades de itens', () => {
    let session = createSession()
    session = setAudience(session, 'mei')
    session = setScenario(session, 'mei-abertura')

    const groups = buildChecklist(session)
    const allIds = groups.flatMap((g) => g.items).map((i) => i.id)
    const unique = new Set(allIds)
    expect(unique.size).toBe(allIds.length)
  })

  it('mantém ordem estável por categoria', () => {
    let session1 = createSession()
    session1 = setAudience(session1, 'mei')
    session1 = setScenario(session1, 'mei-declaracao')
    session1 = setAnswer(session1, 'mei-q-faturamento', true)

    let session2 = createSession()
    session2 = setAudience(session2, 'mei')
    session2 = setScenario(session2, 'mei-declaracao')
    session2 = setAnswer(session2, 'mei-q-faturamento', true)

    const groups1 = buildChecklist(session1).map((g) => g.category)
    const groups2 = buildChecklist(session2).map((g) => g.category)

    expect(groups1).toEqual(groups2)
  })

  it('retorna lista vazia quando não há público definido', () => {
    const session = createSession()
    expect(buildChecklist(session)).toEqual([])
  })
})
