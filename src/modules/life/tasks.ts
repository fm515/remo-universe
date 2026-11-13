/** Pure task logic — no React, no storage. Unit-tested in tasks.test.ts. */

export const TASKS_KEY = 'remo.life.tasks.v1'
export const MAX_TITLE_LENGTH = 200
export const MAX_TASKS = 500

export interface Task {
  id: string
  title: string
  done: boolean
  /** Unix epoch milliseconds. */
  createdAt: number
}

export function normalizeTitle(input: string): string {
  return input.replace(/\s+/g, ' ').trim().slice(0, MAX_TITLE_LENGTH)
}

/** Accepts anything read from storage; drops whatever is not a valid task. Never throws. */
export function parseTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return []
  const seen = new Set<string>()
  const tasks: Task[] = []
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue
    const { id, title, done, createdAt } = item as Record<string, unknown>
    if (typeof id !== 'string' || id === '' || seen.has(id)) continue
    if (typeof title !== 'string') continue
    const cleanTitle = normalizeTitle(title)
    if (cleanTitle === '') continue
    seen.add(id)
    tasks.push({
      id,
      title: cleanTitle,
      done: done === true,
      createdAt: typeof createdAt === 'number' && Number.isFinite(createdAt) ? createdAt : 0,
    })
    if (tasks.length >= MAX_TASKS) break
  }
  return tasks
}

/** Newest first. Returns the same array when the title is empty or the list is full. */
export function addTask(tasks: Task[], title: string, id: string, now: number): Task[] {
  const cleanTitle = normalizeTitle(title)
  if (cleanTitle === '' || tasks.length >= MAX_TASKS) return tasks
  return [{ id, title: cleanTitle, done: false, createdAt: now }, ...tasks]
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id)
}

export function clearCompleted(tasks: Task[]): Task[] {
  return tasks.filter((task) => !task.done)
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  // crypto.randomUUID needs a secure context; fall back for plain-http local testing.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
