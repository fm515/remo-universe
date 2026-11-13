import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LANGUAGE_META, type Direction, type Language, type Localized } from '../i18n'
import { usePersistentState } from '../storage'
import { supabase } from '../backend'
import { useAuth } from '../auth'
import {
  PREFERENCES_KEY,
  THEME_COLOR,
  parsePreferences,
  resolveTheme,
  type Preferences,
  type ResolvedTheme,
  type ThemeChoice,
} from './preferences'

interface PreferencesContextValue extends Preferences {
  direction: Direction
  resolvedTheme: ResolvedTheme
  setLanguage: (language: Language) => void
  setTheme: (theme: ThemeChoice) => void
  reset: () => void
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

const LIGHT_QUERY = '(prefers-color-scheme: light)'
const browserLanguages = () => (typeof navigator === 'undefined' ? [] : navigator.languages)
const parseStored = (raw: unknown) => parsePreferences(raw, browserLanguages())

function useSystemPrefersLight(): boolean {
  const [prefersLight, setPrefersLight] = useState(() => window.matchMedia(LIGHT_QUERY).matches)
  useEffect(() => {
    const query = window.matchMedia(LIGHT_QUERY)
    const onChange = () => setPrefersLight(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return prefersLight
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  cons¶»§q«^