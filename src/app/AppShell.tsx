import { Home, Languages, LayoutGrid, Moon, Settings, ShieldCheck, Sun, WifiOff } from 'lucide-react'
import { Suspense, useEffect, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ROUTES,
  dismissUpdate,
  reloadToUpdate,
  useLocalize,
  useModules,
  useOnline,
  usePreferences,
  usePwa,
} from '@/platform'
import { ErrorBoundary } from './ErrorBoundary'
import { strings } from './strings'

function Brand() {
  return (
    <Link to={ROUTES.home} className="brand" dir="ltr" aria-label="REMO UNIVERSE">
      <span className="brand__mark" aria-hidden>
        R
      </span>
      <span className="brand__name">
        <b>REMO</b>
        <small>UNIVERSE</small>
      </span>
    </Link>
  )
}

function QuickToggles() {
  const localize = useLocalize()
  const { language, resolvedTheme, setLanguage, setTheme } = usePreferences()
  const nextLanguage = language === 'ar' ? 'en' : 'ar'
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
  return (
    <div className="toggles">
      <button
        type="button"
        className="icon-btn icon-btn--label"
        lang={nextLanguage}
        aria-label={localize(strings.switchLanguage)}
        onClick={() => setLanguage(nextLanguage)}
      >
        <Languages size={18} aria-hidden />
        <span aria-hidden>{nextLanguage === 'ar' ? 'ع' : 'EN'}</span>
      </button>
      <button
        type="button"
        className="icon-btn"
        aria-label={localize(nextTheme === 'light' ? strings.toLight : strings.toDark)}
        onClick={() => setTheme(nextTheme)}
      >
        {nextTheme === 'light' ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
      </button>
    </div>
  )
}

function ErrorFallback() {
  const localize = useLocalize()
  return (
    <div className="page">
      <h1>{localize(strings.errorTitle)}</h1>
      <p className="lead">{localize(strings.errorText)}</p>
      <div>
        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
          {localize(strings.reload)}
        </button>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const localize = useLocalize()
  const modules = useModules()
  const { pathname } = useLocation()
  const online = useOnline()
  const pwa = usePwa()

  const currentModule = modules.find((module) => module.path === pathname)
  const inModules = pathname === ROUTES.modules || currentModule !== undefined

  useEffect(() => {
    const page =
      currentModule?.name ??
      (pathname === ROUTES.settings
        ? localize(strings.settings)
        : pathname === ROUTES.modules
          ? localize(strings.modules)
          : null)
    document.title = page ? `${page} · REMO UNIVERSE` : 'REMO UNIVERSE'
    window.scrollTo(0, 0)
  }, [pathname, currentModule, localize])

  return (
    <div className="shell">
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>
        {localize(strings.skip)}
      </a>

      <aside className="sidebar">
        <Brand />
        <nav aria-label={localize(strings.mainNav)}>
          <NavLink to={ROUTES.home} end className="nav-item">
            <Home size={18} aria-hidden />
            <span>{localize(strings.home)}</span>
          </NavLink>
          <p className="nav-label">{localize(strings.modules)}</p>
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <NavLink key={module.id} to={module.path} className="nav-item">
                <Icon size={18} aria-hidden />
                <span dir="ltr">{module.name}</span>
              </NavLink>
            )
          })}
          <hr />
          <NavLink to={ROUTES.settings} className="nav-item">
            <Settings size={18} aria-hidden />
            <span>{localize(strings.settings)}</span>
          </NavLink>
        </nav>
        <p className="sidebar__foot">
          <ShieldCheck size={16} aria-hidden />
          {localize(strings.foundation)} · v{__APP_VERSION__}
        </p>
      </aside>

      <div className="shell__main">
        <header className="topbar">
          <div className="topbar__brand">
            <Brand />
          </div>
          <QuickToggles />
        </header>

        {!online && (
          <p className="banner" role="status">
            <WifiOff size={16} aria-hidden />
            {localize(strings.offline)}
          </p>
        )}

        <main id="main" tabIndex={-1}>
          <ErrorBoundary resetKey={pathname} fallback={<ErrorFallback />}>
            <Suspense fallback={<p className="loading">{localize(strings.loading)}</p>}>{children}</Suspense>
          </ErrorBoundary>
          <footer className="footer">
            <span dir="ltr">© REMO UNIVERSE</span>
            <span>{localize(strings.footer)}</span>
          </footer>
        </main>
      </div>

      <nav className="bottomnav" aria-label={localize(strings.mainNav)}>
        <NavLink to={ROUTES.home} end className="bottomnav__item">
          <Home size={20} aria-hidden />
          <span>{localize(strings.home)}</span>
        </NavLink>
        <Link
          to={ROUTES.modules}
          className={`bottomnav__item${inModules ? ' active' : ''}`}
          aria-current={pathname === ROUTES.modules ? 'page' : undefined}
        >
          <LayoutGrid size={20} aria-hidden />
          <span>{localize(strings.modules)}</span>
        </Link>
        <NavLink to={ROUTES.settings} className="bottomnav__item">
          <Settings size={20} aria-hidden />
          <span>{localize(strings.settings)}</span>
        </NavLink>
      </nav>

      {pwa.updateAvailable && (
        <div className="toast" role="alert">
          <span>{localize(strings.updateReady)}</span>
          <button type="button" className="btn btn--primary" onClick={reloadToUpdate}>
            {localize(strings.reload)}
          </button>
          <button type="button" className="btn btn--ghost" onClick={dismissUpdate}>
            {localize(strings.later)}
          </button>
        </div>
      )}
    </div>
  )
}
