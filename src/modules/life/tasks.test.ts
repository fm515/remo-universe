import { describe, expect, it } from 'vitest'
import { MAX_TASKS, MAX_TITLE_LENGTH, addTask, clearCompleted, parseTasks, removeTask, toggleTask, type Task } from './tasks'

const task = (id: string, done = false): Task => ({ id, title: `Task ${id}`, done, createdAt: 1, dueAt: null })

describe('tasks', () => {
  it('adds new tasks first, with a cleaned title and optional due date', () => {
    const result = addTask([task('a')], '  buy   bread \\n', 'b', 5, '2026-12-01')
    expect(result).toEqual([{ id: 'b', title: 'buy bread', done: false, createdAt: 5, dueAt: '2026-12-01' }, task('a')])
    expect(addTask([], 'call home', 'c', 6)[0].dueAt).toBeNull()
  })

  it('ignores empty titles, truncates long ones and respects the limit', () => {
    const list = [task('a')]
    expect(addTask(list, '   ', 'b', 1)).toBe(list)
    expect(addTask([], 'x'.repeat(MAX_TITLE_LENGTH + 50), 'b', 1)[0].title).toHaveLength(MAX_TITLE_LENGTH)
    const full = Array.from({ length: MAX_TASKS }, (_, i) => task(String(i)))
    expect(addTask(full, 'one more', 'z', 1)).toBe(full)
  })

  it('toggles, removes and clears completed without mutating', () => {
    const list = [task('a'), task('b', true)]
    expect(toggleTask(list, 'a')[0].done).toBe(true)
    expect(list[0].done).toBe(false)
    expect(removeTask(list, 'a')).toEqual([task('b', true)])
    expect(clearCompleted(list)).toEqual([task('a')])
  })

  it('parses stored data defensively and preserves legacy tasks without due dates', () => {
    expect(parseTasks(undefined)).toEqual([])
    expect(parseTasks('garbage')).toEqual([])
    expect(
      parseTasks([
        { id: 'a', title: 'ok', done: true, createdAt: 9, dueAt: '2026-12-01' },
        { id: 'a', title: 'duplicate id' },
        { id: 'b', title: '   ' },
        { id: '', title: 'no id' },
        { title: 'missing id' },
        null,
        7,
        { id: 'c', title: 'loose', done: 'yes', createdAt: 'never' },
        { id: 'd', title: 'bad date', dueAt: 'tomorrow' },
      ]),
    ).toEqual([
      { id: 'a', title: 'ok', done: true, createdAt: 9, dueAt: '2026-12-01' },
      { id: 'c', title: 'loose', done: false, createdAt: 0, dueAt: null },
      { id: 'd', title: 'bad date', done: false, createdAt: 0, dueAt: null },
    ])
  })
})
