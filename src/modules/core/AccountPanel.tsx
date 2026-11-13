import { useEffect, useState, type FormEvent } from 'react'
import { useAuth, useLocalize } from '@/platform'
import type { Localized } from '@/platform'

const copy = {
  title: { ar: 'حساب REMO', en: 'REMO account' },
  intro: { ar: 'سجّل الدخول لحفظ مهامك وإعداداتك ومزامنتها بين أجهزتك.', en: 'Sign in to back up your tasks and preferences and sync them across your devices.' },
  unavailable: { ar: 'خدمة الحسابات لم تُفعّل بعد. حاول لاحقاً.', en: 'The account service is not configured yet. Please try again later.' },
  loading: { ar: 'جارٍ التحقق من الجلسة…', en: 'Checking your session…' },
  signedIn: { ar: 'تم تسجيل الدخول', en: 'Signed in' },
  email: { ar: 'البريد الإلكتروني', en: 'Email address' },
  password: { ar: 'كلمة المرور', en: 'Password' },
  displayName: { ar: 'الاسم المعروض', en: 'Display name' },
  signIn: { ar: 'تسجيل الدخول', en: 'Sign in' },
  signUp: { ar: 'إنشاء حساب', en: 'Create account' },
  switchToSignUp: { ar: 'ليس لديك حساب؟ أنشئ حساباً', en: 'New here? Create an account' },
  switchToSignIn: { ar: 'لديك حساب بالفعل؟ سجّل الدخول', en: 'Already have an account? Sign in' },
  signOut: { ar: 'تسجيل الخروج', en: 'Sign out' },
  confirmEmail: { ar: 'تم إنشاء الحساب. افتح بريدك الإلكتروني واضغط رابط التأكيد، ثم عد إلى التطبيق وسجّل الدخول.', en: 'Account created. Check your inbox and confirm your email, then return here to sign in.' },
  signedInMessage: { ar: 'حسابك متصل. ستتم مزامنة المهام والإعدادات عند توفر الاتصال.', en: 'Your account is connected. Tasks and preferences sync when a connection is available.' },
  passwordHint: { ar: 'استخدم 8 أحرف على الأقل.', en: 'Use at least 8 characters.' },
  working: { ar: 'جارٍ التنفيذ…', en: 'Working…' },
  forgotPassword: { ar: 'نسيت كلمة المرور؟', en: 'Forgot password?' },
  sendReset: { ar: 'إرسال رابط الاستعادة', en: 'Send reset link' },
  resetSent: { ar: 'إذا كان البريد مسجلاً، فسيصلك رابط لاستعادة كلمة المرور. افحص صندوق الوارد والرسائل غير المرغوب فيها.', en: 'If the email is registered, a password reset link will arrive. Check your inbox and spam folder.' },
  backToSignIn: { ar: 'العودة إلى تسجيل الدخول', en: 'Back to sign in' },
  newPassword: { ar: 'كلمة المرور الجديدة', en: 'New password' },
  confirmPassword: { ar: 'تأكيد كلمة المرور', en: 'Confirm password' },
  savePassword: { ar: 'حفظ كلمة المرور الجديدة', en: 'Save new password' },
  passwordUpdated: { ar: 'تم تحديث كلمة المرور بنجاح.', en: 'Your password has been updated.' },
  passwordsMismatch: { ar: 'كلمتا المرور غير متطابقتين.', en: 'The passwords do not match.' },
  saveProfile: { ar: 'حفظ الملف الشخصي', en: 'Save profile' },
  profileSaved: { ar: 'تم حفظ الاسم في حسابك.', en: 'Your profile name has been saved.' },
} satisfies Record<string, Localized<string>>

export default function AccountPanel() {
  const localize = useLocalize()
  const {
    user, loading, configured, recoveryMode, signIn, signUp, signOut,
    requestPasswordReset, updatePassword, updateProfile,
  } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setDisplayName(String(user?.user_metadata?.display_name ?? ''))
    if (user?.email) setEmail(user.email)
  }, [user?.id, user?.user_metadata?.display_name, user?.email])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    setError('')
    try {
      if (recoveryMode) {
        if (newPassword !== confirmPassword) {
          setError(localize(copy.passwordsMismatch))
          return
        }
        const result = await updatePassword(newPassword)
        if (result.error) setError(result.error)
        else {
          setPassword('')
          setNewPassword('')
          setConfirmPassword('')
          setMessage(localize(copy.passwordUpdated))
        }
        return
      }

      if (mode === 'reset') {
        const result = await requestPasswordReset(email)
        if (result.error) setError(result.error)
        else setMessage(localize(copy.resetSent))
        return
      }

      const result = mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password, displayName)
      if (result.error) setError(result.error)
      else if (result.needsEmailConfirmation) setMessage(localize(copy.confirmEmail))
      else if (mode === 'signup') setMessage(localize(copy.signedInMessage))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const result = await updateProfile(displayName)
      if (result.error) setError(result.error)
      else setMessage(localize(copy.profileSaved))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const logout = async () => {
    setBusy(true)
    setError('')
    const result = await signOut()
    if (result.error) setError(result.error)
    setBusy(false)
  }

  return (
    <section className="card" aria-labelledby="account-heading">
      <h2 id="account-heading" className="section-title">{localize(copy.title)}</h2>
      <p className="muted">{localize(copy.intro)}</p>

      {loading ? <p className="muted" role="status">{localize(copy.loading)}</p> : null}
      {!loading && !configured ? <p className="muted" role="status">{localize(copy.unavailable)}</p> : null}

      {!loading && configured && recoveryMode ? (
        <form className="auth-form" onSubmit={(event) => void submit(event)}>
          <label>
            <span>{localize(copy.newPassword)}</span>
            <input className="input" type="password" value={newPassword} required minLength={8} autoComplete="new-password" onChange={(event) => setNewPassword(event.target.value)} />
          </label>
          <label>
            <span>{localize(copy.confirmPassword)}</span>
            <input className="input" type="password" value={confirmPassword} required minLength={8} autoComplete="new-password" onChange={(event) => setConfirmPassword(event.target.value)} />
          </label>
          {error ? <p className="notice notice--error" role="alert">{error}</p> : null}
          {message ? <p className="notice" role="status">{message}</p> : null}
          <button className="btn btn--primary" type="submit" disabled={busy}>
            {busy ? localize(copy.working) : localize(copy.savePassword)}
          </button>
        </form>
      ) : null}

      {!loading && configured && user && !recoveryMode ? (
        <div className="auth-account">
          <p><strong>{localize(copy.signedIn)}:</strong> <span dir="ltr">{user.email}</span></p>
          <p className="muted">{localize(copy.signedInMessage)}</p>
          <form className="auth-form" onSubmit={(event) => void saveProfile(event)}>
            <label>
              <span>{localize(copy.displayName)}</span>
              <input className="input" value={displayName} maxLength={80} autoComplete="name" onChange={(event) => setDisplayName(event.target.value)} />
            </label>
            {error ? <p className="notice notice--error" role="alert">{error}</p> : null}
            {message ? <p className="notice" role="status">{message}</p> : null}
            <button className="btn btn--primary" type="submit" disabled={busy}>
              {busy ? localize(copy.working) : localize(copy.saveProfile)}
            </button>
          </form>
          <button className="btn btn--ghost" type="button" disabled={busy} onClick={() => void logout()}>
            {busy ? localize(copy.working) : localize(copy.signOut)}
          </button>
        </div>
      ) : null}

      {!loading && configured && !user && !recoveryMode ? (
        <form className="auth-form" onSubmit={(event) => void submit(event)}>
          {mode === 'signup' ? (
            <label>
              <span>{localize(copy.displayName)}</span>
              <input className="input" value={displayName} maxLength={80} autoComplete="name" onChange={(event) => setDisplayName(event.target.value)} />
            </label>
          ) : null}
          <label>
            <span>{localize(copy.email)}</span>
            <input className="input" type="email" value={email} required autoComplete="email" inputMode="email" onChange={(event) => setEmail(event.target.value)} />
          </label>
          {mode !== 'reset' ? (
            <label>
              <span>{localize(copy.password)}</span>
              <input className="input" type="password" value={password} required minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} onChange={(event) => setPassword(event.target.value)} />
            </label>
          ) : null}
          {mode === 'signup' ? <p className="muted">{localize(copy.passwordHint)}</p> : null}
          {error ? <p className="notice notice--error" role="alert">{error}</p> : null}
          {message ? <p className="notice" role="status">{message}</p> : null}
          <button className="btn btn--primary" type="submit" disabled={busy}>
            {busy ? localize(copy.working) : localize(mode === 'signin' ? copy.signIn : mode === 'signup' ? copy.signUp : copy.sendReset)}
          </button>
          {mode === 'signin' ? (
            <>
              <button className="btn btn--ghost" type="button" disabled={busy} onClick={() => { setMode('reset'); setError(''); setMessage('') }}>
                {localize(copy.forgotPassword)}
              </button>
              <button className="btn btn--ghost" type="button" disabled={busy} onClick={() => { setMode('signup'); setError(''); setMessage('') }}>
                {localize(copy.switchToSignUp)}
              </button>
            </>
          ) : (
            <button className="btn btn--ghost" type="button" disabled={busy} onClick={() => { setMode('signin'); setError(''); setMessage('') }}>
              {localize(copy.backToSignIn)}
            </button>
          )}
        </form>
      ) : null}
      {error && user && !recoveryMode ? <p className="notice notice--error" role="alert">{error}</p> : null}
    </section>
  )
}
