import { describe, expect, it } from 'vitest'
import { MAX_REMINDERS_PER_TASK, MAX_TASKS, MAX_TITLE_LENGTH, addReminder, addTask, clearCompleted, parseTasks, removeReminder, removeTask, toggleTask, updateReminder, type Task } from './tasks'

const task = (id: string, done = false): Task => ({ id, title: 'Task ' + id, done, createdAt: 1, dueAt: null, reminders: [] })
const reminder = (id: string, remindAt = '2026-12-01T09:30:00.000Z') => ({ id, remindAt, timezone: 'Europe/Istanbul' })

describe('tasks', () => {
  it('adds new tasks with no reminders by default', () => {
    const result = addTask([task('a')], '  buy   bread \n', 'b', 5, '2026-12-01')
    expect(result[0]).toMatchObject({ id: 'b', title: 'buy bread', dueAt: '2026-12-01', reminders: [] })
    expect(addTask([], 'call home', 'c', 6)[0].dueAt).toBeNull()
  })
  it('respects title and task limits', () => {
    const list = [task('a')]
    expect(addTask(list, '   ', 'b', 1)).toBe(list)
    expect(addTask([], 'x'.repeat(MAX_TITLE_LENGTH + 50), 'b', 1)[0].title).toHaveLength(MAX_TITLE_LENGTH)
    const full = Array.from({ length: MAX_TASKS }, (_, i) => task(String(i)))
    expect(addTask(full, 'one more', 'z', 1)).toBe(full)
  })
  it('adds multiple reminders in chronological order and prevents duplicate times', () => {
    const base = [task('a')]
    const later = reminder('later', '2026-12-02T09:00:00.000Z')
    const earlier = reminder('earlier', '2026-12-01T09:00:00.000Z')
    const result = addReminder(addReminder(base, 'a', later), 'a', earlier)
    expect(result[0].reminders.map((item) => item.id)).toEqual(['earlier', 'later'])
    expect(addReminder(result, 'a', reminder('duplicate', earlier.remindAt))).toEqual(result)
  })
  it('enforces reminder limit and removes one reminder independently', () => {
    const reminders = Array.from({ length: MAX_REMINDERS_PER_TASK }, (_, i) => reminder(String(i), new Date(Date.UTC(2026, 0, 1, 0, i)).toISOString()))
    const full: Task = { ...task('a'), reminders }
    expect(addReminder([full], 'a', reminder('extra'))[0].reminders).toHaveLength(MAX_REMINDERS_PER_TASK)
    expect(removeReminder([full], 'a', '0')[0].reminders).toHaveLength(MAX_REMINDERS_PER_TASK - 1)
  })
  it('updates a reminder date and time without changing its id', () => {
    const original = reminder('r1')
    const updated = updateReminder([{ ...task('a'), reminders: [original] }], 'a', 'r1', '2026-12-05T12:45:00.000Z', 'Europe/Istanbul')
    expect(updated[0].reminders).toEqual([{ ...original, remindAt: '2026-12-05T12:45:00.000Z' }])
  })
  it('toggles, removes and clears completed without mutating', () => {
    const list = [task('a'), task('b', true)]
    expect(toggleTask(list, 'a')[0].done).toBe(true)
    expect(list[0].done).toBe(false)
    expect(removeTask(list, 'a')).toEqual([task('b', true)])
    expect(clearCompleted(list)).toEqual([task('a')])
  })
  it('parses legacy tasks and validates reminders defensively', () => {
    expect(parseTasks(undefined)).toEqual([])
    expect(parseTasks([{ id: 'old', title: 'legacy task' }])[0].reminders).toEqual([])
    const parsed = parseTasks([{ id: 'a', title: 'ok', reminders: [reminder('r1')] }, { id: 'b', title: 'bad', reminders: [{ id: 'bad', remindAt: 'tomorrow' }] }])
    expect(parsed[0].reminders).toEqual([reminder('r1')])
    expect(parsed[1].reminders).toEqual([])
  })
})