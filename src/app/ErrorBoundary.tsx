import { Component, type ReactNode } from 'react'

interface Props {
  /** Changing this value (e.g. the route) clears the error. */
  resetKey: string
  fallback: ReactNode
  children: ReactNode
}

/** Catches render errors and failed lazy-chunk loads so one module cannot blank the whole app. */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('[REMO] page failed to render', error)
  }

  componentDidUpdate(previous: Props) {
    if (previous.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false })
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
