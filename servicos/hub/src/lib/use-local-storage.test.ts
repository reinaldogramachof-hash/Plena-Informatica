import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLocalStorage } from './use-local-storage'

describe('useLocalStorage', () => {
  const key = 'test-key'

  beforeEach(() => {
    window.localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('retorna o valor inicial se localStorage estiver vazio', () => {
    const { result } = renderHook(() => useLocalStorage(key, 'initial-value'))
    expect(result.current[0]).toBe('initial-value')
  })

  it('retorna o valor salvo no localStorage se ja existir', () => {
    window.localStorage.setItem(key, JSON.stringify('saved-value'))
    const { result } = renderHook(() => useLocalStorage(key, 'initial-value'))
    expect(result.current[0]).toBe('saved-value')
  })

  it('atualiza o valor e grava no localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(key, 'initial-value'))

    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(JSON.parse(window.localStorage.getItem(key) || '')).toBe('new-value')
  })

  it('suporta serializar e deserializar Set', () => {
    const initialSet = new Set(['item1', 'item2'])
    const { result } = renderHook(() => useLocalStorage(key, initialSet))

    expect(result.current[0]).toBeInstanceOf(Set)
    expect(result.current[0].has('item1')).toBe(true)

    act(() => {
      result.current[1](new Set(['item3']))
    })

    expect(result.current[0].has('item3')).toBe(true)
    expect(result.current[0].has('item1')).toBe(false)

    // Verifica formato no localStorage (deve conter a meta _type: 'Set')
    const raw = window.localStorage.getItem(key)
    expect(raw).toContain('_type')
    expect(raw).toContain('Set')
    expect(raw).toContain('item3')
  })
})
