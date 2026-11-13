export const LANGUAGES = ['ar', 'en'] as const
export type Language = (typeof LANGUAGES)[number]
export type Direction = 'rtl' | 'ltr'

/** A value available in every supported language. TypeScript enforces completeness. */
export type Localized<T> = Record<Language, T>

export const LANGUAGE_META: Record<Language, { dir: Direction; nativeName: string }> = {
  ar: { dir: 'rtl', nativeName: 'العربية' },
  en: { dir: 'ltr', nativeName: 'English' },
}

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value)
}

/** Picks the first supported language from a browser language list. Falls back to Arabic. */
export function detectLanguage(candidates: readonly string[] | undefined): Language {
  for (const candidate of candidates ?? []) {
    const code = candidate.toLowerCase().slice(0, 2)
    if (isLanguage(code)) return code
  }
  return 'ar'
}
