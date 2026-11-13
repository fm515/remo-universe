import { ModulePage } from '@/platform'
import { manifest } from './manifest'

export default function CorePage() {
  return <ModulePage manifest={manifest} />
}
