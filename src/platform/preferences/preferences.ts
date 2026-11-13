import { detectLanguage, isLanguage, type Language } from '../i18n'

export const PREFERENCES_KEY = 'remo.preferences.v1'

export const THEME_CHOICES = ['system', 'dark', 'light'] as const
export type ThemeChoice = (typeof THEME_CHOICES)[number]
export type ResolvedTheme = 'dark' | 'light'

export interface Preferences {
  language: Language
  theme: ThemeChoice
}

function isThemeChoice(value: unknown): value is ThemeChoice {
  return typeof value === 'string' && (THEME_CHOICES as readonly string[]).includes(value)
}

/** Turns anything found in storage into valid preferences. Never throws. */
export function parsePreferences(raw: unknown, browserLanguages?: readonly string[]): Preferences {
  const record = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {}
  return {
    language: isLanguage(record.language) ? record.language : detectLanguage(browserLanguages),
    theme: isThemeChoice(record.theme) ? record.theme : 'system',
  }
}

export function resolveTheme(choice: ThemeChoice, systemPrefersLight: boolean): ResolvedTheme {
  if (choice === 'system') return systemPrefersLight ? 'light' : 'dark'
  return choice
}

/** Browser chrome colour per theme. Must match --bg in styles/tokens.css. */
export const THEME_COLOR: Record<ResolvedTheme, string> = { dark: '#0a0a0a', light: '#ffffff' }
