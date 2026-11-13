import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { ModulePage, Notice, supabase, useAuth, useLocalize, usePersistentState } from '@/platform'
import { manifest } from './manifest'
import { strings } from './strings'
import { MAX_REMINDERS_PER_TASK, MAX_TASKS, MAX_TITLE_LENGTH, TASKS_KEY, addReminder, addTask, clearCompleted, createId, normalizeTitle, parseTasks, removeReminder, removeTask, toggleTask, updateReminder } from './tasks'

export default function LifePage() {
  const localize = useLocalize()
  const { user } = useAuth()
  const storageKey = user ? 'remo.life.tasks.v1.user.' + user.id : TASKS_KEY
  const [tasks, updateTasks] = usePersistentState(storageKey, parseTasks)
  const [draft, setDraft] = useState('')
  const [dueDraft, setDueDraft] = useState('')
  const [reminderTaskId, setReminderTaskId] = useState<string | null>(null)
  const [reminderDraft, setReminderDraft] = useState('')
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null)
  const [editingReminderDraft, setEditingReminderDraft] = useState('')
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
    if (!user || !client) { setCloudReady(false); setSyncNotice(''); return }
    let active = true
    setCloudReady(false)
    void (async () => {
      const [taskResult, reminderResult] = await Promise.all([
        client.from('life_tasks').select('id, title, completed_at, created_at, updated_at, due_at').eq('user_id', user.id).order('created_at', { ascending: false }),
        client.from('life_task_reminders').select('id, task_id, remind_at, timezone').eq('user_id', user.id),
      ])
      if (!active) return
      if (taskResult.error || reminderResult.error) { setSyncNotice((taskResult.error ?? reminderResult.error)?.message ?? 'Unable to load tasks.'); return }
      const remindersByTask = new Map<string, { id: string; remindAt: string; timezone: string }[]>()
      for (const row of reminderResult.data ?? []) {
        const list = remindersByTask.get(row.task_id) ?? []
        list.push({ id: row.id, remindAt: row.remind_at, timezone: row.timezone })
        remindersByTask.set(row.task_id, list)
      }
      const remote = (taskResult.data ?? []).map((row) => ({
        id: row.id, title: row.title, done: Boolean(row.completed_at),
        createdAt: row.created_at ? new Date(row.created_at).getTime() : 0,
        dueAt: row.due_at ? new Date(row.due_at).toISOString().slice(0, 10) : null,
        reminders: remindersByTask.get(row.id) ?? [],
      }))
      let stored: unknown
      try { stored = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]') } catch { stored = [] }
      const local = parseTasks(stored)
      const byId = new Map(remote.map((task) => [task.id, task]))
      for (const task of local) {
        const remoteTask = byId.get(task.id)
        if (!remoteTask) { byId.set(task.id, task); continue }
        const mergedReminders = new Map(remoteTask.reminders.map((item) => [item.id, item]))
        for (const item of task.reminders) mergedReminders.set(item.id, item)
        byId.set(task.id, { ...task, dueAt: task.dueAt ?? remoteTask.dueAt, reminders: [...mergedReminders.values()].sort((a, b) => Date.parse(a.remindAt) - Date.parse(b.remindAt)) })
      }
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
        const { data: remote, error: readError } = await client.from('life_tasks').select('id').eq('user_id', user.id)
        if (!active) return
        if (readError) { setSyncNotice(readError.message); return }
        const localIds = new Set(tasks.map((task) => task.id))
        const deletedIds = (remote ?? []).map((row) => row.id).filter((id) => !localIds.has(id))
        if (deletedIds.length) {
          const { error } = await client.from('life_tasks').delete().eq('user_id', user.id).in('id', deletedIds)
          if (error) { setSyncNotice(error.message); return }
        }
        if (tasks.length) {
          const rows = tasks.map((task) => ({ id: task.id, user_id: user.id, title: task.title,
            completed_at: task.done ? new Date(task.createdAt || Date.now()).toISOString() : null,
            created_at: new Date(task.createdAt || Date.now()).toISOString(), updated_at: new Date().toISOString(),
            due_at: task.dueAt ? new Date(task.dueAt + 'T12:00:00.000Z').toISOString() : null }))
          const { error } = await client.from('life_tasks').upsert(rows, { onConflict: 'id' })
          if (error) { setSyncNotice(error.message); return }
        }
        const { data: remoteReminders, error: reminderReadError } = await client.from('life_task_reminders').select('id').eq('user_id', user.id)
        if (reminderReadError) { setSyncNotice(reminderReadError.message); return }
        const localReminderIds = new Set(tasks.flatMap((task) => task.reminders.map((item) => item.id)))
        const deletedReminderIds = (remoteReminders ?? []).map((row) => row.id).filter((id) => !localReminderIds.has(id))
        if (deletedReminderIds.length) {
          const { error } = await client.from('life_task_reminders').delete().eq('user_id', user.id).in('id', deletedReminderIds)
          if (error) { setSyncNotice(error.message); return }
        }
        const reminderRows = tasks.flatMap((task) => task.reminders.map((item) => ({ id: item.id, task_id: task.id, user_id: user.id, remind_at: item.remindAt, timezone: item.timezone })))
        if (reminderRows.length) {
          const { error } = await client.from('life_task_reminders').upsert(reminderRows, { onConflict: 'id' })
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
    setDraft(''); setDueDraft('')
  }
  const toLocalInputValue = (iso: string) => {
    const date = new Date(iso)
    return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
  }
  const saveReminderEdit = (taskId: string, reminderId: string) => {
    if (!editingReminderDraft) return
    const date = new Date(editingReminderDraft)
    if (!Number.isFinite(date.getTime())) return
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    updateTasks((previous) => updateReminder(previous, taskId, reminderId, date.toISOString(), timezone))
    setEditingReminderId(null); setEditingReminderDraft('')
  }
  const saveReminder = (taskId: string) => {
    if (!reminderDraft) return
    const date = new Date(reminderDraft)
    if (!Number.isFinite(date.getTime())) return
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    updateTasks((previous) => addReminder(previous, taskId, { id: createId(), remindAt: date.toISOString(), timezone }))
    setReminderDraft(''); setReminderTaskId(null)
  }

  return (
    <ModulePage manifest={manifest}>
      <section className='card tasks' aria-labelledby='tasks-heading'>
        {user ? <p className='muted' role='status'>{cloudReady ? (syncNotice || localize(strings.syncReady)) : (syncNotice || localize(strings.syncLoading))}</p> : null}
        <div className='tasks__head'>
          <h2 id='tasks-heading' className='section-title'>{localize(strings.heading)}</h2>
          <p className='muted' aria-live='polite'>{tasks.length - doneCount} {localize(strings.remaining)} · {doneCount} {localize(strings.completed)}</p>
        </div>
        <form className='tasks__form' onSubmit={onSubmit}>
          <label className='visually-hidden' htmlFor='task-input'>{localize(strings.inputLabel)}</label>
          <input id='task-input' className='input tasks__title-input' dir='auto' value={draft} maxLength={MAX_TITLE_LENGTH} placeholder={localize(strings.placeholder)} autoComplete='off' enterKeyHint='done' onChange={(event) => setDraft(event.target.value)} />
          <label className='tasks__due-field'><span>{localize(strings.dueDate)}</span><input className='input' type='date' value={dueDraft} onChange={(event) => setDueDraft(event.target.value)} /></label>
          <button type='submit' className='btn btn--primary' disabled={!canAdd}><Plus size={18} aria-hidden />{localize(strings.add)}</button>
        </form>
        {full && <p className='muted'>{localize(strings.full)}</p>}
        {tasks.length === 0 ? <p className='empty'>{localize(strings.empty)}</p> : (
          <ul className='tasks__list'>
            {tasks.map((task) => (
              <li key={task.id} className='task' data-done={task.done}>
                <div className='task__main'>
                  <label className='task__label'>
                    <input type='checkbox' checked={task.done} onChange={() => updateTasks((previous) => toggleTask(previous, task.id))} />
                    <span className='task__content'><span dir='auto'>{task.title}</span>{task.dueAt ? <small className='task__due'>{localize(strings.due)}: {new Date(task.dueAt + 'T12:00:00').toLocaleDateString()}</small> : null}</span>
                  </label>
                  <button type='button' className='icon-btn' aria-label={localize(strings.delete) + ': ' + task.title} onClick={() => updateTasks((previous) => removeTask(previous, task.id))}><Trash2 size={18} aria-hidden /></button>
                </div>
                <div className='task__reminders'>
                  <div className='task__reminders-head'>
                    <span className='muted'>{localize(strings.reminders)} ({task.reminders.length})</span>
                    <button type='button' className='btn btn--ghost task__add-reminder' disabled={task.reminders.length >= MAX_REMINDERS_PER_TASK} onClick={() => { setReminderTaskId(task.id); setReminderDraft('') }}><Plus size={16} aria-hidden />{localize(strings.addReminder)}</button>
                  </div>
                  {task.reminders.map((item) => (
                    <div className='task__reminder' key={item.id}>
                      {editingReminderId === item.id ? (
                        <div className='task__reminder-editor'>
                          <input className='input' type='datetime-local' value={editingReminderDraft} onChange={(event) => setEditingReminderDraft(event.target.value)} />
                          <button type='button' className='btn btn--primary' disabled={!editingReminderDraft} onClick={() => saveReminderEdit(task.id, item.id)}>{localize(strings.saveReminder)}</button>
                          <button type='button' className='icon-btn' aria-label={localize(strings.cancel)} onClick={() => { setEditingReminderId(null); setEditingReminderDraft('') }}><X size={16} aria-hidden /></button>
                        </div>
                      ) : (
                        <>
                          <span>{new Date(item.remindAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                          <div className='task__reminder-actions'>
                            <button type='button' className='icon-btn' aria-label={localize(strings.editReminder)} onClick={() => { setEditingReminderId(item.id); setEditingReminderDraft(toLocalInputValue(item.remindAt)) }}><Pencil size={16} aria-hidden /></button>
                            <button type='button' className='icon-btn' aria-label={localize(strings.removeReminder)} onClick={() => updateTasks((previous) => removeReminder(previous, task.id, item.id))}><X size={16} aria-hidden /></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {reminderTaskId === task.id && (
                    <div className='task__reminder-editor'>
                      <label className='tasks__due-field'><span>{localize(strings.reminderDateTime)}</span><input className='input' type='datetime-local' value={reminderDraft} onChange={(event) => setReminderDraft(event.target.value)} /></label>
                      <button type='button' className='btn btn--primary' disabled={!reminderDraft} onClick={() => saveReminder(task.id)}>{localize(strings.saveReminder)}</button>
                      <button type='button' className='btn btn--ghost' onClick={() => { setReminderTaskId(null); setReminderDraft('') }}>{localize(strings.delete)}</button>
                    </div>
                  )}
                  {task.reminders.length >= MAX_REMINDERS_PER_TASK && <small className='muted'>{localize(strings.reminderLimit)}</small>}
                </div>
              </li>
            ))}
          </ul>
        )}
        {doneCount > 0 && <button type='button' className='btn btn--ghost' onClick={() => updateTasks(clearCompleted)}>{localize(strings.clearCompleted)}</button>}
        <Notice>{user ? 'تُحفظ المهام والتذكيرات على هذا الجهاز وتُزامن مع حسابك عند توفر الاتصال.' : localize(strings.storage)}</Notice>
      </section>
    </ModulePage>
  )
}