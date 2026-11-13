import { Plus, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { ModulePage, Notice, useLocalize, usePersistentState } from '@/platform'
import { manifest } from './manifest'
import { strings } from './strings'
import {
  MAX_TASKS,
  MAX_TITLE_LENGTH,
  TASKS_KEY,
  addTask,
  clearCompleted,
  createId,
  normalizeTitle,
  parseTasks,
  removeTask,
  toggleTask,
} from './tasks'

export default function LifePage() {
  const localize = useLocalize()
  const [tasks, updateTasks] = usePersistentState(TASKS_KEY, parseTasks)
  const [draft, setDraft] = useState('')

  const doneCount = tasks.filter((task) => task.done).length
  const full = tasks.length >= MAX_TASKS
  const canAdd = normalizeTitle(draft) !== '' && !full

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!canAdd) return
    updateTasks((previous) => addTask(previous, draft, createId(), Date.now()))
    setDraft('')
  }

  return (
    <ModulePage manifest={manifest}>
      <section className="card tasks" aria-labelledby="tasks-heading">
        <div className="tasks__head">
          <h2 id="tasks-heading" className="section-title">
            {localize(strings.heading)}
          </h2>
          <p className="muted" aria-live="polite">
            {tasks.length - doneCount} {localize(strings.remaining)} · {doneCount} {localize(strings.completed)}
          </p>
        </div>

        <form className="tasks__form" onSubmit={onSubmit}>
          <label className="visually-hidden" htmlFor="task-input">
            {localize(strings.inputLabel)}
          </label>
          <input
            id="task-input"
            className="input"
            dir="auto"
            value={draft}
            maxLength={MAX_TITLE_LENGTH}
            placeholder={localize(strings.placeholder)}
            autoComplete="off"
            enterKeyHint="done"
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit" className="btn btn--primary" disabled={!canAdd}>
            <Plus size={18} aria-hidden />
            {localize(strings.add)}
          </button>
        </form>
        {full && <p className="muted">{localize(strings.full)}</p>}

        {tasks.length === 0 ? (
          <p className="empty">{localize(strings.empty)}</p>
        ) : (
          <ul className="tasks__list">
            {tasks.map((task) => (
              <li key={task.id} className="task" data-done={task.done}>
                <label className="task__label">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => updateTasks((previous) => toggleTask(previous, task.id))}
                  />
                  <span dir="auto">{task.title}</span>
                </label>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`${localize(strings.delete)}: ${task.title}`}
                  onClick={() => updateTasks((previous) => removeTask(previous, task.id))}
                >
                  <Trash2 size={18} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        {doneCount > 0 && (
          <button type="button" className="btn btn--ghost" onClick={() => updateTasks(clearCompleted)}>
            {localize(strings.clearCompleted)}
          </button>
        )}

        <Notice>{localize(strings.storage)}</Notice>
      </section>
    </ModulePage>
  )
}
