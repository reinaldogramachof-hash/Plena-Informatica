import {
  irpfItems,
  meiItems,
  type ChecklistAudience,
  type ChecklistItem,
} from './checklist-catalog'
import type { ChecklistSession } from './checklist-session'

export type ChecklistGroup = {
  category: string
  items: ChecklistItem[]
}

function itemMatches(
  item: ChecklistItem,
  answers: Record<string, boolean | string>,
  scenarioId: string | null,
): boolean {
  if (
    item.scenarioIds &&
    (!scenarioId || !item.scenarioIds.includes(scenarioId))
  ) {
    return false
  }

  if (!item.requiredWhen || item.requiredWhen.length === 0) return true

  return item.requiredWhen.every((rule) => {
    const answer = answers[rule.questionId]
    return answer === rule.equals
  })
}

function groupByCategory(items: ChecklistItem[]): ChecklistGroup[] {
  const map = new Map<string, ChecklistItem[]>()
  for (const item of items) {
    const existing = map.get(item.category)
    if (existing) {
      existing.push(item)
    } else {
      map.set(item.category, [item])
    }
  }
  return Array.from(map.entries()).map(([category, groupItems]) => ({
    category,
    items: groupItems,
  }))
}

export function buildChecklist(session: ChecklistSession): ChecklistGroup[] {
  const audience: ChecklistAudience | null = session.audience
  if (!audience) return []
  if (audience === 'mei' && !session.scenarioId) return []

  const source = audience === 'mei' ? meiItems : irpfItems

  const filtered = source.filter((item) =>
    itemMatches(
      item,
      session.answers as Record<string, boolean | string>,
      session.scenarioId,
    ),
  )

  // Remove duplicidades por id
  const seen = new Set<string>()
  const unique = filtered.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })

  return groupByCategory(unique)
}
