import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { initPwa } from './platform/pwa'
import './platform/styles/tokens.css'
import './platform/styles/base.css'
import './platform/styles/components.css'
import './app/shell.css'

initPwa()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
