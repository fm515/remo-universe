import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../backend'

interface AuthResult {
  error: string | null
  needsEmailConfirmation?: boolean
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  configured: boolean
  recoveryMode: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string, displayName: string) => Promise<AuthResult>
  signOut: () => Promise<AuthResult>
  requestPasswordReset: (email: string) => Promise<AuthResult>
  updatePassword: (password: string) => Promise<AuthResult>
  updateProfile: (displayName: string) => Promise<AuthResult>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [recoveryMode, setRecoveryMode] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let active = true
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      setUser(session?.user ?? null)
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true)
      if (event === 'SIGNED_OUT') setRecoveryMode(false)
      setLoading(false)
    })

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (!error) setUser(data.session?.user ?? null)
      setLoading(false)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Account service is not configured yet.' }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    return { error: error?.message ?? null }
  }, [])

  const signUp = useCallback(async (email: string, password: string, displayName: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Account service is not configured yet.' }
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: displayName.trim() || null } },
    })
    return {
      error: error?.message ?? null,
      needsEmailConfirmation: !error && !data.session,
    }
  }, [])

  const signOut = useCallback(async (): Promise<AuthResult> => {
    if (!supabase) return { error: null }
    const { error } = await supabase.auth.signOut()
    if (!error) setRecoveryMode(false)
    return { error: error?.message ?? null }
  }, [])

  const requestPasswordReset = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Account service is not configured yet.' }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim())
    return { error: error?.message ?? null }
  }, [])

  const updatePassword = useCallback(async (password: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Account service is not configured yet.' }
    const { error } = await supabase.auth.updateUser({ password })
    if (!error) setRecoveryMode(false)
    return { error: error?.message ?? null }
  }, [])

  const updateProfile = useCallback(async (displayName: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Account service is not configured yet.' }
    const { data: authData, error: authError } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim() || null },
    })
    if (authError) return { error: authError.message }
    if (!authData.user) return { error: 'Unable to load the updated account.' }

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: authData.user.id,
      display_name: displayName.trim() || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })

    return { error: profileError?.message ?? null }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      configured: isSupabaseConfigured,
      recoveryMode,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      updatePassword,
      updateProfile,
    }),
    [user, loading, recoveryMode, signIn, signUp, signOut, requestPasswordReset, updatePassword, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>')
  return value
}
