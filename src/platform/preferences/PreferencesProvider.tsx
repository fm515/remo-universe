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
  const { user } = useAuth()
  const preferencesKey = user ? `${PREFERENCES_KEY}.user.${user.id}` : PREFERENCES_KEY
  const [preferences, update] = usePersistentState(preferencesKey, parseStored)
  const [cloudUserId, setCloudUserId] = useState<string | null>(null)
  const systemPrefersLight = useSystemPrefersLight()
  const resolvedTheme = resolveTheme(preferences.theme, systemPrefersLight)
  const direction = LANGUAGE_META[preferences.language].dir

  useEffect(() => {
    if (!user || !supabase) {
      setCloudUserId(null)
      return
    }
    let active = true
    void (async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('language, theme')
        .eq('user_id', user.id)
        .maybeSingle()
      if (!active) return
      if (error) return
      if (data) {
        update(() => parsePreferences(data, browserLanguages()))
      } else {
        const { error: insertError } = await supabase.from('user_preferences').upsert({
          user_id: user.id,
          language: preferences.language,
          theme: preferences.theme,
          updated_at: new Date().toISOString(),
        })
        if (insertError) return
      }
      if (active) setCloudUserId(user.id)
    })()
    return () => { active = false }
    // Load once per account; local preference changes are handled by the sync effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, supabase])

  useEffect(() => {
    if (!user || !supabase || cloudUserId !== user.id) return
    void supabase.from('user_preferences').upsert({
      user_id: user.id,
      language: preferences.language,
      theme: preferences.theme,
      updated_at: new Date().toISOString(),
    })
  }, [user?.id, cloudUserId, preferences.language, preferences.theme])

  useEffect(() => {
    const root = document.documentElement
    root.lang = preferences.language
    root.dir = direction
    root.dataset.theme = resolvedTheme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[resolvedTheme])
  }, [preferences.language, direction, resolvedTheme])

  const setLanguage = useCallback((language: Language) => update((p) => ({ ...p, language })), [update])
  const setTheme = useCallback((theme: ThemeChoice) => update((p) => ({ ...p, theme })), [update])
  const reset = useCallback(() => update(() => parsePreferences(undefined, browserLanguages())), [update])

  const value = useMemo(
    () => ({ ...preferences, direction, resolvedTheme, setLanguage, setTheme, reset }),
    [preferences, direction, resolvedTheme, setLanguage, setTheme, reset],
  )
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences(): PreferencesContextValue {
  const value = useContext(PreferencesContext)
  if (!value) throw new Error('usePreferences must be used inside <PreferencesProvider>')
  return value
}

export function useLocalize(): <T>(value: Localized<T>) => T {
  const { language } = usePreferences()
  return useCallback(<T,>(value: Localized<T>) => value[language], [language])
}
