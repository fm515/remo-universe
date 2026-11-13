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

      <section className="card settings">
        <Row title={localize(strings.language)} hint={localize(strings.languageHint)}>
          <Segmented
            label={localize(strings.language)}
            value={language}
            onChange={setLanguage}
            options={LANGUAGES.map((code) => ({ value: code, label: LANGUAGE_META[code].nativeName }))}
          />
        </Row>
        <Row title={localize(strings.theme)} hint={localize(strings.themeHint)}>
          <Segmented label={localize(strings.theme)} value={theme} onChange={setTheme} options={themeOptions} />
        </Row>
        <Row title={localize(strings.reset)} hint={localize(strings.resetHint)}>
          <button type="button" className="btn btn--ghost" onClick={reset}>
            <RotateCcw size={16} aria-hidden />
            {localize(strings.reset)}
          </button>
        </Row>
      </section>

      <section className="card settings" aria-labelledby="app-heading">
        <h2 id="app-heading" className="section-title">
          {localize(strings.app)}
        </h2>
        <Row
          title={localize(strings.installTitle)}
          hint={localize(
            pwa.installed ? strings.installed : pwa.canInstall ? strings.installAvailable : strings.installManual,
          )}
        >
          {pwa.canInstall && !pwa.installed && (
            <button type="button" className="btn btn--primary" onClick={() => void promptInstall()}>
              <Download size={16} aria-hidden />
              {localize(strings.install)}
            </button>
          )}
        </Row>
        <Row
          title={localize(strings.offlineTitle)}
          hint={localize(pwa.offlineReady ? strings.offlineReady : strings.offlineNotReady)}
        >
          {null}
        </Row>
        <Row title={localize(strings.connectionTitle)} hint={localize(online ? strings.online : strings.offline)}>
          {null}
        </Row>
        <Row title={localize(strings.versionTitle)}>
          <code dir="ltr">v{__APP_VERSION__}</code>
        </Row>
      </section>

      <section className="card" aria-labelledby="data-heading">
        <h2 id="data-heading" className="section-title">
          {localize(strings.data)}
        </h2>
        <p className="muted">{localize(strings.dataText)}</p>
      </section>

    </div>
  )
}
