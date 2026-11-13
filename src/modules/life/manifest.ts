import { ListChecks } from 'lucide-react'
import type { ModuleManifest } from '@/platform'

export const manifest: ModuleManifest = {
  id: 'life',
  name: 'REMO LIFE',
  path: '/life',
  icon: ListChecks,
  tagline: { ar: 'تنظيم الحياة والمهام', en: 'Life and task organisation' },
  description: {
    ar: 'أدوات شخصية لتنظيم يومك. قائمة المهام تعمل محلياً وتُزامن مع حسابك عند تسجيل الدخول وتوفر الاتصال.',
    en: 'Personal tools for organising your day. Tasks work locally and sync to your account when signed in and online.',
  },
  features: [
    {
      id: 'tasks',
      status: 'implemented',
      title: { ar: 'قائمة المهام', en: 'Task list' },
      description: {
        ar: 'أضف المهام وأنجزها واحذفها. تعمل دون اتصال، وتُزامن مهام الحساب عند تسجيل الدخول وتوفر الإنترنت.',
        en: 'Add, complete and delete tasks. Works offline; account tasks sync when signed in and online.',
      },
    },
    {
      id: 'reminders',
      status: 'planned',
      title: { ar: 'التذكيرات والمواعيد', en: 'Reminders and due dates' },
      description: {
        ar: 'تواريخ استحقاق وتنبيهات للمهام.',
        en: 'Due dates and alerts for tasks.',
      },
    },
    {
      id: 'habits',
      status: 'planned',
      title: { ar: 'متابعة العادات', en: 'Habit tracking' },
      description: {
        ar: 'عادات يومية مع سجل الالتزام.',
        en: 'Daily habits with a streak history.',
      },
    },
    {
      id: 'sync',
      status: 'implemented',
      title: { ar: 'مزامنة المهام للحساب', en: 'Account task sync' },
      description: {
        ar: 'تُزامن مهام الحساب بين الجلسات عند توفر الإنترنت. مهام الضيف تبقى على الجهاز، واختبار المزامنة على جهازين حقيقيين ما زال مطلوباً.',
        en: 'Account tasks sync across sessions when online. Guest tasks remain on-device; two-device end-to-end testing is still required.',
      },
    },
  ],
}
