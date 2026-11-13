// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

/** End-to-end smoke test of the real app tree in a simulated browser (jsdom). */

beforeEach(() => {
  window.localStorage.clear()
  window.location.hash = '#/'
  document.documentElement.removeAttribute('data-theme')
  // jsdom has no matchMedia; report a dark-preferring system.
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
  window.scrollTo = vi.fn()
  Object.defineProperty(window.navigator, 'languages', { value: ['ar'], configurable: true })
})
afterEach(cleanup)

const stored = (key: string) => JSON.parse(window.localStorage.getItem(key) ?? 'null')

describe('App', () => {
  it('renders the Arabic RTL dashboard with all seven modules by default', async () => {
    render(<App />)
    expect(await screen.findByText('مرحباً بك في')).toBeTruthy()
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar')
    expect(document.documentElement.dataset.theme).toBe('dark')
    for (const name of ['CORE', 'AI', 'TRADE', 'WALLET', 'STORE', 'LIFE', 'NETWORK']) {
      expect(screen.getAllByText(`REMO ${name}`).length).toBeGreaterThan(0)
    }
  })

  it('switches language and theme, and persists both', async () => {
    const first = render(<App />)
    await screen.findByText('مرحباً بك في')

    fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }))
    expect(await screen.findByText('Welcome to')).toBeTruthy()
    expect(document.documentElement.dir).toBe('ltr')

    fireEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(stored('remo.preferences.v1')).toEqual({ language: 'en', theme: 'light' })

    // A fresh mount (= reopening the app) restores the saved preferences.
    first.unmount()
    render(<App />)
    expect(await screen.findByText('Welcome to')).toBeTruthy()
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('navigates to a planned module and shows its notice instead of fake content', async () => {
    window.localStorage.setItem('remo.preferences.v1', JSON.stringify({ language: 'en', theme: 'dark' }))
    render(<App />)
    await screen.findByText('Welcome to')
    fireEvent.click(screen.getAllByRole('link', { name: /REMO WALLET/ })[0])
    expect(await screen.findByText(/no balances, no transactions/)).toBeTruthy()
    expect(screen.getByText('Nothing in this module is implemented yet.')).toBeTruthy()
    expect(document.title).toBe('REMO WALLET · REMO UNIVERSE')
  })

  it('adds, completes and deletes a task in REMO LIFE, saved on the device', async () => {
    window.localStorage.setItem('remo.preferences.v1', JSON.stringify({ language: 'en', theme: 'dark' }))
    window.location.hash = '#/life'
    render(<App />)

    const input = await screen.findByLabelText('New task')
    fireEvent.change(input, { target: { value: 'Call the bank' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('Call the bank')).toBeTruthy()
    expect(stored('remo.life.tasks.v1')).toMatchObject([{ title: 'Call the bank', done: false }])

    fireEvent.click(screen.getByRole('checkbox'))
    expect(stored('remo.life.tasks.v1')).toMatchObject([{ done: true }])

    fireEvent.click(screen.getByRole('button', { name: 'Delete task: Call the bank' }))
    expect(screen.queryByText('Call the bank')).toBeNull()
    expect(stored('remo.life.tasks.v1')).toEqual([])
  })

  it('shows a not-found page for unknown routes', async () => {
    window.location.hash = '#/does-not-exist'
    render(<App />)
    expect(await screen.findByText('الصفحة غير موجودة')).toBeTruthy()
  })
})
