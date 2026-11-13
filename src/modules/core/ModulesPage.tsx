import { useLocalize } from '@/platform'
import { ModuleGrid, StatusLegend } from './ModuleGrid'
import { strings } from './strings'

export default function ModulesPage() {
  const localize = useLocalize()
  return (
    <div className="page">
      <header>
        <h1>{localize(strings.modulesHeading)}</h1>
        <p className="lead">{localize(strings.modulesIntro)}</p>
      </header>
      <ModuleGrid />
      <StatusLegend />
    </div>
  )
}
