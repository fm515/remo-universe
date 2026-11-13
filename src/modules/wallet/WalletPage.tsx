import { ModulePage } from '@/platform'
import { manifest } from './manifest'

/** Planned module: renders its manifest only. No mock UI, no sample data. */
export default function WalletPage() {
  return <ModulePage manifest={manifest} />
}
