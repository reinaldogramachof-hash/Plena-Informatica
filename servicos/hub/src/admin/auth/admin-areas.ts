import type { AdminSession } from '../supabase-client'

export type AdminArea = 'escritorio' | 'digital'

export const ADMIN_AREAS: Record<AdminArea, { title: string; description: string; path: string }> = {
  escritorio: {
    title: 'Plena Gestão Escritório',
    description: 'Caixa, clientes, serviços, fechamentos e rotina presencial.',
    path: '/escritorio',
  },
  digital: {
    title: 'Plena Gestão Digital',
    description: 'Propostas comerciais e próximos módulos digitais.',
    path: '/digital/propostas',
  },
}

export function getAvailableAreas(session: AdminSession | null): AdminArea[] {
  if (!session) return []
  if (session.role === 'admin') return ['escritorio', 'digital']

  const knownAreas = new Set<AdminArea>(['escritorio', 'digital'])
  return session.areas.filter((area): area is AdminArea => knownAreas.has(area as AdminArea))
}

export function getDefaultAreaPath(session: AdminSession | null) {
  const areas = getAvailableAreas(session)
  if (areas.length !== 1) return '/portais'
  return ADMIN_AREAS[areas[0]].path
}

export function canAccessArea(session: AdminSession | null, area: AdminArea) {
  return getAvailableAreas(session).includes(area)
}
