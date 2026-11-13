import { useCallback, useEffect, useState } from 'react'
import { readJson, writeJson } from './storage'

interface StoredState<T> {
  key: string
  value: T
}

/**
 * State persisted in localStorage on this device.
 * Switching keys (for example, when signing in/out) loads the new namespace
 * without briefly copying the previous account's state into it.
 */
export function usePersistentState<T>(
  key: string,
  parse: (raw: unknown) => T,
): [T, (update: (previous: T) => T) => void] {
  const [state, setState] = useState<StoredState<T>>(() => ({ key, value: parse(readJson(key)) }))

  if (state.key !== key) {
    setState({ key, value: parse(readJson(key)) })
  }

  useEffect(() => {
    if (state.key === key) writeJson(key, state.value)
  }, [key, state])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) setState({ key, value: parse(readJson(key)) })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
    // parse is expected to be a stable module-level function.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const update = useCallback((updater: (previous: T) => T) => {
    setState((previous) => ({
      key,
      value: updater(previous.key === key ? previous.value : parse(readJson(key))),
    }))
  }, [key, parse])

  return [state.value, update]
}
