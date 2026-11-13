/** Pure task and reminder logic — no React, no storage. Unit-tested in tasks.test.ts. */

export const TASKS_KEY = 'remo.life.tasks.v1'
export const MAX_TITLE_LENGTH = 200
export const MAX_TASKS = 500
export const MAX_REMINDERS_PER_TASK = 20

export interface TaskReminder { id: string; remindAt: string; timezone: string }
export interface Task { id: string; title: string; done: boolean; createdAt: number; dueAt: string | null; reminders: TaskReminder[] }

export function normalizeTitle(input: string): string { return input.replace(/\s+/g, ' ').trim().slice(0, MAX_TITLE_LENGTH) }
function normalizeDueDate(value: unknown): string | null {
  if (typeof value !== 'string') return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value + 'T12:00:00.000Z' // legacy date-only value
  if (!Number.isFinite(Date.parse(value))) return null
  return new Date(value).toISOString()
}

function parseReminders(value: unknown): TaskReminder[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const result: TaskReminder[] = []
  for (const item of value) {
    if (typeof item !== 'object' || item === null) continue
    const candidate = item as Record<string, unknown>
    if (typeof candidate.id !== 'string' || !candidate.id || seen.has(candidate.id)) continue
    if (typeof candidate.remindAt !== 'string' || !Number.isFinite(Date.parse(candidate.remindAt))) continue
    const timezone = typeof candidate.timezone === 'string' && candidate.timezone.length <= 80 ? candidate.timezone : 'UTC'
    seen.add(candidate.id)
    result.push({ id: candidate.id, remindAt: new Date(candidate.remindAt).toISOString(), timezone })
    if (result.length >= MAX_REMINDERS_PER_TASK) break
  }
  return result.sort((a, b) => Date.parse(a.remindAt) - Date.parse(b.remindAt))
}

export function parseTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return []
  const seen = new Set<string>()
  const tasks: Task[] = []
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue
    const { id, title, done, createdAt, dueAt, reminders } = item as Record<string, unknown>
    if (typeof id !== 'string' || id === '' || seen.has(id) || typeof title !== 'string') continue
    const cleanTitle = normalizeTitle(title)
    if (!cleanTitle) continue
    seen.add(id)
    tasks.push({ id, title: cleanTitle, done: done === true, createdAt: typeof createdAt === 'number' && Number.isFinite(createdAt) ? createdAt : 0, dueAt: normalizeDueDate(dueAt), reminders: parseReminders(reminders) })
    if (tasks.length >= MAX_TASKS) break
  }
  return tasks
}

export function addTask(tasks: Task[], title: string, id: string, now: number, dueAt: string | null = null): Task[] {
  const cleanTitle = normalizeTitle(title)
  if (!cleanTitle || tasks.length >= MAX_TASKS) return tasks
  return [{ id, title: cleanTitle, done: false, createdAt: now, dueAt: normalizeDueDate(dueAt), reminders: [] }, ...tasks]
}

export function addReminder(tasks: Task[], taskId: string, reminder: TaskReminder): Task[] {
  return tasks.map((task) => {
    if (task.id !== taskId || task.reminders.length >= MAX_REMINDERS_PER_TASK || task.reminders.some((item) => item.remindAt === reminder.remindAt)) return task
    return { ...task, reminders: [...task.reminders, reminder].sort((a, b) => Date.parse(a.remindAt) - Date.parse(b.remindAt)) }
  })
}

export function updateReminder(tasks: Task[], taskId: string, reminderId: string, remindAt: string, timezone: string): Task[] {
  return tasks.map((task) => {
    if (task.id !== taskId || !task.reminders.some((item) => item.id === reminderId)) return task
    if (task.reminders.some((item) => item.id !== reminderId && item.remindAt === remindAt)) return task
    return { ...task, reminders: task.reminders.map((item) => item.id === reminderId ? { ...item, remindAt, timezone } : item).sort((a, b) => Date.parse(a.remindAt) - Date.parse(b.remindAt)) }
  })
}

export function removeReminder(tasks: Task[], taskId: string, reminderId: string): Task[] {
  return tasks.map((task) => task.id === taskId ? { ...task, reminders: task.reminders.filter((item) => item.id !== reminderId) } : task)
}
export function toggleTask(tasks: Task[], id: string): Task[] { return tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task) }
export function removeTask(tasks: Task[], id: string): Task[] { return tasks.filter((task) => task.id !== id) }
export function clearCompleted(tasks: Task[]): Task[] { return tasks.filter((task) => !task.done) }
export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
}