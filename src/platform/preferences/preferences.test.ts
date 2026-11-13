import { describe, expect, it } from 'vitest'
import { detectLanguage } from '../i18n'
import { parsePreferences, resolveTheme } from './preferences'

describe('detectLanguage', () => {
  it('picks the first supported browser language', () => {
    expect(detectLanguage(['fr-FR', 'en-US', 'ar'])).toBe('en')
    expect(detectLanguage(['ar-SY', 'en'])).toBe('ar')
  })
  it('falls back to Arabic', () => {
    expect(detectLanguage(['tr-TR'])).toBe('ar')
    expect(detectLanguage(undefined)).toBe('ar')
  })
})

describe('parsePreferences', () => {
  it('keeps valid stored values', () => {
    expect(parsePreferences({ language: 'en', theme: 'light' }, ['ar'])).toEqual({ language: 'en', theme: 'light' })
  })
  it('recovers from missing or corrupt data', () => {
    for (const raw of [undefined, null, 'x', 42, [], { language: 'xx', theme: 'neon' }]) {
      expect(parsePreferences(raw, ['en-GB'])).toEqual({ language: 'en', theme: 'system' })
    }
  })
})

describe('resolveTheme', () => {
  it('follows the system only when asked to', () => {
    expect(resolveTheme('system', true)).toBe('light')
    expect(resolveTheme('system', false)).toBe('dark')
    expect(resolveTheme('dark', true)).toBe('dark')
    expect(resolveTheme('light', false)).toBe('light')
  })
})
