import type { ReactNode } from 'react'
import { deriveStatus, type ModuleFeature, type ModuleManifest } from '../modules'
import { useLocalize } from '../preferences'
import { Notice } from './Notice'
import { StatusBadge } from './StatusBadge'
import { common } from './strings'

function FeatureList({ features }: { features: ModuleFeature[] }) {
  const localize = useLocalize()
  return (
    <ul className="features">
      {features.map((feature) => (
        <li key={feature.id} className={`feature feature--${feature.status}`}>
          <div className="feature__head">
            <h3>{localize(feature.title)}</h3>
            <StatusBadge status={feature.status} />
          </div>
          <p>{localize(feature.description)}</p>
        </li>
      ))}
    </ul>
  )
}

/**
 * Standard module page: identity, honest status, optional working UI (children),
 * then implemented features and planned features in clearly separate sections.
 */
export function ModulePage({ manifest, children }: { manifest: ModuleManifest; children?: ReactNode }) {
  const localize = useLocalize()
  const Icon = manifest.icon
  const implemented = manifest.features.filter((f) => f.status === 'implemented')
  const planned = manifest.features.filter((f) => f.status === 'planned')

  return (
    <article className="page">
      <header className="page-head">
        <div className="icon-tile icon-tile--lg">
          <Icon size={26} aria-hidden />
        </div>
        <div className="page-head__text">
          <p className="eyebrow">{localize(manifest.tagline)}</p>
          <h1 dir="ltr">{manifest.name}</h1>
        </div>
        <StatusBadge status={deriveStatus(manifest.features)} />
      </header>

      <p className="lead">{localize(manifest.description)}</p>
      {manifest.notice && <Notice>{localize(manifest.notice)}</Notice>}

      {children}

      <section aria-labelledby="implemented-heading">
        <h2 id="implemented-heading" className="section-title">
          {localize(common.implementedHeading)}
        </h2>
        {implemented.length > 0 ? (
          <FeatureList features={implemented} />
        ) : (
          <p className="empty">{localize(common.nothingImplemented)}</p>
        )}
      </section>

      {planned.length > 0 && (
        <section aria-labelledby="planned-heading">
          <h2 id="planned-heading" className="section-title">
            {localize(common.plannedHeading)}
          </h2>
          <FeatureList features={planned} />
        </section>
      )}
    </article>
  )
}
