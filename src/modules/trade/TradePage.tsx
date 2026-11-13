import { ModulePage } from '@/platform'
import { manifest } from './manifest'

/** Planned module: renders its manifest only. No mock UI, no sample data. */
export default function TradePage() {
  return <ModulePage manifest={manifest} />
}
