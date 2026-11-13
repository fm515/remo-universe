import { HashRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, ModuleRegistryProvider, PreferencesProvider, ROUTES, useAuth, useLocalize } from '@/platform'
import { AppShell } from './AppShell'
import { modules } from './registry'
import { strings } from './strings'

function NotFound() {
  const localize = useLocalize()
  return (
    <div className="page">
      <h1>{localize(strings.notFound)}</h1>
      <p className="lead">{localize(strings.notFoundText)}</p>
      <div>
        <Link to={ROUTES.home} className="btn btn--primary">
          {localize(strings.backHome)}
        </Link>
      </div>
    </div>
  )
}

/**
 * Supabase recovery links deliver their session in the URL fragment. Because
 * this app uses HashRouter, that fragment can briefly look like an unknown
 * route (for example /access_token=...). Wait for auth URL detection, then
 * send an active password-recovery session to the account form.
 */
function RouteFallback() {
  const { loading, recoveryMode } = useAuth()
  const localize = useLocalize()

  if (loading) {
    return <div className="page"><p className="muted" role="status">{localize(strings.loading)}</p></div>
  }

  if (recoveryMode) {
    return <Navigate to={ROUTES.settings} replace />
  }

  return <NotFound />
}

/** Every route comes from a module manifest — the shell has no knowledge of module internals. */
const routes = modules.flatMap((module) => [
  { path: module.path, Page: module.Page },
  ...(module.extraRoutes ?? []),
])

export default function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
      <ModuleRegistryProvider modules={modules}>
        {/* Hash routing: deep links work on any static host with no server rewrite rules. */}
        <HashRouter>
          <AppShell>
            <Routes>
              {routes.map(({ path, Page }) => (
                <Route key={path} path={path} element={<Page />} />
              ))}
              <Route path="*" element={<RouteFallback />} />
            </Routes>
          </AppShell>
        </HashRouter>
      </ModuleRegistryProvider>
      </PreferencesProvider>
    </AuthProvider>
  )
}
