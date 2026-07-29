import { beforeEach, describe, expect, it, vi } from 'vitest'

const createClient = vi.fn()
const getSession = vi.fn()
const onAuthStateChange = vi.fn()
const signInWithPassword = vi.fn()
const signOut = vi.fn()
const from = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient,
}))

async function loadModule() {
  vi.resetModules()
  return import('./supabase-client')
}

function mockProfilesQuery(result: { data: { role: string; areas?: string[] } | null; error: Error | null }) {
  const maybeSingle = vi.fn().mockResolvedValue(result)
  const eq = vi.fn().mockReturnValue({ maybeSingle })
  const select = vi.fn().mockReturnValue({ eq })

  from.mockImplementation((table: string) => {
    if (table !== 'profiles') {
      throw new Error(`Tabela inesperada: ${table}`)
    }

    return { select }
  })
}

beforeEach(() => {
  createClient.mockReset()
  getSession.mockReset()
  onAuthStateChange.mockReset()
  signInWithPassword.mockReset()
  signOut.mockReset()
  from.mockReset()

  createClient.mockReturnValue({
    auth: {
      getSession,
      onAuthStateChange,
      signInWithPassword,
      signOut,
    },
    from,
  })
})

describe('supabase-client', () => {
  it('getAdminSession lê o role real da tabela profiles', async () => {
    getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'user-1',
            email: 'admin@plena.com',
          },
        },
      },
    })
    mockProfilesQuery({ data: { role: 'admin' }, error: null })

    const { getAdminSession } = await loadModule()

    await expect(getAdminSession()).resolves.toEqual({
      userId: 'user-1',
      email: 'admin@plena.com',
      role: 'admin',
      areas: [],
    })
  })

  it('getAdminSession retorna null quando o perfil não existe', async () => {
    getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'user-1',
            email: 'admin@plena.com',
          },
        },
      },
    })
    mockProfilesQuery({ data: null, error: null })

    const { getAdminSession } = await loadModule()

    await expect(getAdminSession()).resolves.toBeNull()
  })

  it('getAdminSession retorna null quando a leitura de profiles falha', async () => {
    getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'user-1',
            email: 'admin@plena.com',
          },
        },
      },
    })
    mockProfilesQuery({ data: null, error: new Error('network') })

    const { getAdminSession } = await loadModule()

    await expect(getAdminSession()).resolves.toBeNull()
  })

  it('onAdminAuthStateChange resolve role do banco para sessão autenticada', async () => {
    let authCallback:
      | ((event: string, session: { user: { id: string; email: string } } | null) => void)
      | undefined

    onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })
    mockProfilesQuery({ data: { role: 'manager' }, error: null })

    const { onAdminAuthStateChange } = await loadModule()
    const listener = vi.fn()

    onAdminAuthStateChange(listener)
    authCallback?.('SIGNED_IN', {
      user: {
        id: 'user-2',
        email: 'manager@plena.com',
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(listener).toHaveBeenCalledWith({
      userId: 'user-2',
      email: 'manager@plena.com',
      role: 'manager',
      areas: [],
    })
  })

  it('onAdminAuthStateChange trata sessão sem profile como inválida', async () => {
    let authCallback:
      | ((event: string, session: { user: { id: string; email: string } } | null) => void)
      | undefined

    onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    })
    mockProfilesQuery({ data: null, error: null })

    const { onAdminAuthStateChange } = await loadModule()
    const listener = vi.fn()

    onAdminAuthStateChange(listener)
    authCallback?.('SIGNED_IN', {
      user: {
        id: 'user-2',
        email: 'manager@plena.com',
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(listener).toHaveBeenCalledWith(null)
  })
})
