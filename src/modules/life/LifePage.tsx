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
        .select('id, title, completed_at, created_at, updated_at')
        .eq('user_id', user.id)
        .order(¶»§q«^