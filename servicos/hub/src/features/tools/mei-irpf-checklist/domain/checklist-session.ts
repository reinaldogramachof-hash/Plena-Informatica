import type { ChecklistAnswer, ChecklistAudience } from './checklist-catalog'

export type ChecklistSession = {
  audience: ChecklistAudience | null
  scenarioId: string | null
  answers: Record<string, ChecklistAnswer>
  checked: Set<string>
}

export function createSession(): ChecklistSession {
  return {
    audience: null,
    scenarioId: null,
    answers: {},
    checked: new Set(),
  }
}

export function setAudience(
  session: ChecklistSession,
  audience: ChecklistAudience,
): ChecklistSession {
  return { ...session, audience, scenarioId: null, answers: {}, checked: new Set() }
}

export function setScenario(
  session: ChecklistSession,
  scenarioId: string,
): ChecklistSession {
  return { ...session, scenarioId, answers: {}, checked: new Set() }
}

export function setAnswer(
  session: ChecklistSession,
  questionId: string,
  answer: ChecklistAnswer,
): ChecklistSession {
  return {
    ...session,
    answers: { ...session.answers, [questionId]: answer },
  }
}

export function toggleChecked(
  session: ChecklistSession,
  itemId: string,
): ChecklistSession {
  const next = new Set(session.checked)
  if (next.has(itemId)) {
    next.delete(itemId)
  } else {
    next.add(itemId)
  }
  return { ...session, checked: next }
}

export function resetSession(): ChecklistSession {
  return createSession()
}
