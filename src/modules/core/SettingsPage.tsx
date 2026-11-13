import { Download, Monitor, Moon, RotateCcw, Sun } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  LANGUAGES,
  LANGUAGE_META,
  Segmented,
  promptInstall,
  useLocalize,
  useOnline,
  usePreferences,
  usePwa,
  type ThemeChoice,
} from '@/platform'
import { strings } from './strings'
import AccountPanel from './AccountPanel'

function Row({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="setting">
      <div className="setting__text">
        <h3>{title}</h3>
        {hint && <p className="muted">{hint}</p>}
      </div>
      <div className="setting__control">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const localize = useLocalize()
  const { language, theme, setLanguage, setTheme, reset } = usePreferences()
  const pwa = usePwa()
  const online = useOnline()

  const themeOptions: { value: ThemeChoice; label: string; icon: ReactNode }[] = [
    { value: 'system', label: localize(strings.themeSystem), icon: <Monitor size={16} aria-hidden /> },
    { value: 'dark', label: localize(strings.themeDark), icon: <Moon size={16} aria-hidden /> },
    { value: 'light', label: localize(strings.themeLight), icon: <Sun size={16} aria-hidden /> },
  ]

  return (
    <div className="page">
      <header>
        <h1>{localize(strings.settings)}</h1>
        <p className="lead">{localize(strings.settingsIntro)}</p>
      </header>

      <AccountPanel />

      <sec¶»§q«^