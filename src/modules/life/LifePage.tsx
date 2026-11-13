import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { ModulePage, Notice, supabase, useAuth, useLocalize, usePersistentState } from '@/platform'
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
  const { user } = useAuth()
  const storageKey = user ? `remo.life.tasks.v1.user.${user.id}` : TASKS_KEY
  const [tasks, updateTasks] = usePersistentState(storageKey, parseTasks)
  const [draft, setDraft] = useState('')
  const [dueDraft, setDueDraft] = useState('')
  const [cloudReady, setCloudReady] = useState(false)
  const [syncNotice, setSyncNotice] = useState('')
  const [syncAttempt, setSyncAttempt] = useState(0)

  useEffect(() => {
    const retry = () => setSyncAttempt((value) => value + 1)
    window.addEventListener('online', retry)
    return () => window.removeEventListener('online', retry)
  }, [])

  useEffect(() => {
    const client = supabase
    if (!user || !client) {
      setCloudReady(false)
      setSyncNotice('')
      return
    }
    let active = true
    setCloudReady(false)
    void (async () => {
      const { data, error } = await client
        .from('life_tasks')
        .select('id, title, completed_at, created_at, updated_at, due_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (!active) return
      if (error) {
        setSyncNotice(error.message)
        return
      }
      const remote = (data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        done: Boolean(row.completed_at),
        createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
        dueAt: row.due_at ? new Date(row.due_at).toISOString().slice(0, 10) : null,
      }))
      let stored: unknown
      try { stored = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]') } catch { stored = [] }
      const local = parseTasks(stored)
      const byId = new Map(remote.map((task) => [task.id, task]))
      for (const task of local) byId.set(task.id, task)
      const merged = [...byId.values()].sort((a, b) => b.createdAt - a.createdAt).slice(0, MAX_TASKS)
      updateTasks(() => merged)
      setCloudReady(true)
    })()
    return () => { active = false }
  }, [user?.id, storageKey, syncAttempt])

  useEffect(() => {
    const client = supabase
    if (!user || !client || !cloudReady) return
    let active = true
    const timer = window.setTimeout(() => {
      void (async () => {
        const { data: remote, error: readError } = await client
          .from('life_tasks').select('id').eq('user_id', user.id)
        if (!active) return
        if (readError) {
          setSyncNotice(readError.message)
          return
        }
        const localIds = new Set(tasks.map((task) => task.id))
        const deletedIds = (remote ?? []).map((row) => row.id).filter((id) => !localIds.has(id))
        if (deletedIds.length) {
          const { error } = await client.from('life_tasks').delete().eq('user_id', user.id).in('id', deletedIds)
          if (error) { setSyncNotice(error.message); return }
        }
        if (tasks.length) {
          const rows = tasks.map((task) => ({
            id: task.id,
            user_id: user.id,
            title: task.title,
            completed_at: task.done ? new Date(task.createdAt || Date.now()).toISOString() : null,
            created_at: new Date(task.createdAt || Date.now()).toISOString(),
            updated_at: new Date().toISOString(),
            due_at: task.dueAt ? new Date(`${task.dueAt}T12:00:00.000Z`).toISOString() : null,
          }))
          const { error } = await client.from('life_tasks').upsert(rows, { onConflict: 'id' })
          if (error) { setSyncNotice(error.message); return }
        }
        if (active) setSyncNotice('')
      })()
    }, 500)
    return () => { active = false; window.clearTimeout(timer) }
  }, [user?.id, cloudReady, tasks, syncAttempt])

  const doneCount = tasks.filter((task) => task.done).length
  const full = tasks.length >= MAX_TASKS
  const canAdd = normalizeTitle(draft) !== '' && !full

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!canAdd) return
    updateTasks((previous) => addTask(previous, draft, createId(), Date.now(), dueDraft || null))
    setDraft('')
    setDueDraft('')
  }

  return (
    <ModulePage manifest={manifest}>
      <section className="card tasks" aria-labelledby="tasks-heading">
        {user ? <p className="muted" role="status">{cloudReady ? (syncNotice || localize(strings.syncReady)) : (syncNotice || localize(strings.syncLoading))}</p> : null}
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
            className="input tasks__title-input"
            dir="auto"
            value={draft}
            maxLength={MAX_TITLE_LENGTH}
            placeholder={localize(strings.placeholder)}
            autoComplete="off"
            enterKeyHint="done"
            onChange={(event) => setDraft(event.target.value)}
          />
          <label className="tasks__due-field">
            <span>{localize(strings.dueDate)}</span>
            <input
              className="input"
              type="date"
              value={dueDraft}
              onChange={(event) => setDueDraft(event.target.value)}
            />
          </label>
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
                  <span className="task__content">
                    <span dir="auto">{task.title}</span>
                    {task.dueAt ? (
                      <small className="task__due">{localize(strings.due)}: {new Date(`${task.dueAt}T12:00:00`).toLocaleDateString()}</small>
                    ) : null}
                  </span>
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

        <Notice>{user ? 'تُحفظ المهام على هذا الجهاز وتُزامن مع حسابك عند توفر الاتصال.' : localize(strings.storage)}</Notice>
      </section>
    </ModulePage>
  )
}
