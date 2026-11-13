import { useState, type FormEvent } from 'react'
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
  displayName: { ar: 'الاسم (اختياري)', en: 'Name (optional)' },
  signIn: { ar: 'تسجيل الدخول', en: 'Sign in' },
  signUp: { ar: 'إنشاء حساب', en: 'Create account' },
  switchToSignUp: { ar: 'ليس لديك حساب؟ أنشئ حساباً', en: 'New here? Create an account' },
  switchToSignIn: { ar: 'لديك حساب بالفعل؟ سجّل الدخول', en: 'Already have an account? Sign in' },
  signOut: { ar: 'تسجيل الخروج', en: 'Sign out' },
  confirmEmail: { ar: 'تم إنشاء الحساب. افتح بريدك الإلكتروني واضغ���q�^