import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge, deriveStatus, useLocalize, useModules } from '@/platform'
import { strings } from './strings'

export function ModuleGrid() {
  const localize = useLocalize()
  const modules = useModules()
  return (
    <ul className="module-grid">
      {modules.map((module) => {
        const Icon = module.icon
        const working = module.features.filter((f) => f.status === 'implemented').length
        return (
          <li key={module.id}>
            <Link to={module.path} className="module-card">
              <div className="module-card__top">
                <div className="icon-tile">
                  <Icon size={22} aria-hidden />
                </div>
                <StatusBadge status={deriveStatus(module.features)} />
              </div>
              <h3 dir="ltr">{module.name}</h3>
              <p>{localize(module.tagline)}</p>
              <div className="module-card__foot">
                <span>
                  {working} {localize(strings.featuresOf)} {module.features.length} {localize(strings.featuresWorking)}
                </span>
                <ChevronRight size={18} className="flip-rtl" aria-hidden />
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function StatusLegend() {
  const localize = useLocalize()
  return (
    <section className="card legend" aria-labelledby="legend-heading">
      <h2 id="legend-heading" className="section-title">
        {localize(strings.legendHeading)}
      </h2>
      <dl>
        <div>
          <dt>
            <StatusBadge status="active" />
          </dt>
          <dd>{localize(strings.legendActive)}</dd>
        </div>
        <div>
          <dt>
            <StatusBadge status="partial" />
          </dt>
          <dd>{localize(strings.legendPartial)}</dd>
        </div>
        <div>
          <dt>
            <StatusBadge status="planned" />
          </dt>
          <dd>{localize(strings.legendPlanned)}</dd>
        </div>
      </dl>
    </section>
  )
}
