import { useState, useEffect, useCallback, useMemo } from 'react'

export function jsonReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Set) {
    return { _type: 'Set', value: Array.from(value) }
  }
  return value
}

export function jsonReviver(_key: string, value: unknown): unknown {
  if (value && typeof value === 'object' && (value as Record<string, unknown>)._type === 'Set' && Array.isArray((value as Record<string, unknown>).value)) {
    return new Set((value as Record<string, unknown>).value as unknown[])
  }
  return value
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (value: T) => string
    deserialize?: (stored: string) => T
  }
): [T, (value: T | ((val: T) => T)) => void] {
  const serialize = useMemo(() => options?.serialize ?? ((val: T) => JSON.stringify(val, jsonReplacer)), [options?.serialize])
  const deserialize = useMemo(() => options?.deserialize ?? ((stored: string) => JSON.parse(stored, jsonReviver) as T), [options?.deserialize])

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? deserialize(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  // Sincroniza com localStorage sempre que storedValue ou key mudar
  // Usamos useEffect para evitar operações de E/S síncronas bloqueantes durante a renderização
  useEffect(() => {
    try {
      window.localStorage.setItem(key, serialize(storedValue))
    } catch (error) {
      console.error(error)
    }
  }, [key, storedValue, serialize])

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prevValue) => {
      return value instanceof Function ? value(prevValue) : value
    })
  }, [])

  return [storedValue, setValue]
}
