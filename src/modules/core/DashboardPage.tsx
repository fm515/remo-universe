import { Activity } from 'lucide-react'
import { countFeatures, useLocalize, useModules } from '@/platform'
import { ModuleGrid, StatusLegend } from './ModuleGrid'
import { strings } from './strings'

export default function DashboardPage() {
  const localize = useLocalize()
  const modules = useModules()
  // Real numbers, computed from the module manifests — not hand-written.
  const counts = countFeatures(modules)

  return (
    <div className="page">
      <section className="hero">
        <span className="pill">
          <Activity size={14} aria-hidden />
          {localize(strings.buildPill)} · v{__APP_VERSION__}
        </span>
        <h1>
          {localize(strings.welcome)}{' '}
          <span className="brand-text" dir="ltr">
            REMO UNIVERSE
          </span>
        </h1>
        <p>{localize(strings.heroText)}</p>
      </section>

      <dl className="stats">
        <div className="stat">
          <dd>{modules.length}</dd>
          <dt>{localize(strings.statModules)}</dt>
        </div>
        <div className="stat">
          <dd>{counts.implemented}</dd>
          <dt>{localize(strings.statImplemented)}</dt>
        </div>
        <div className="stat">
          <dd>{counts.planned}</dd>
          <dt>{localize(strings.statPlanned)}</dt>
        </div>
      </dl>

      <section aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="section-title">
          {localize(strings.modulesHeading)}
        </h2>
        <p className="muted section-intro">{localize(strings.modulesIntro)}</p>
        <ModuleGrid />
      </section>

      <StatusLegend />
    </div>
  )
}
