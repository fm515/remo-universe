import { ListChecks } from 'lucide-react'
import type { ModuleManifest } from '@/platform'

export const manifest: ModuleManifest = {
  id: 'life',
  name: 'REMO LIFE',
  path: '/life',
  icon: ListChecks,
  tagline: { ar: 'تنظيم الحياة والمهام', en: 'Life and task organisation' },
  description: {
    ar: 'أدوات شخصية لتنظيم يومك. أضف المهام وحدد مواعيد إنجازها، وتُزامن مهام الحساب عند توفر الاتصال.',
    en: 'Personal tools for organising your day. Add tasks, set due dates, and sync account tasks when online.',
  },
  features: [
    {
      id: 'tasks',
      status: 'implemented',
      title: { ar: 'قائمة المهام', en: 'Task list' },
      description: {
        ar: 'أضف المهام وأنجزها واحذفها وحدد موعد إنجاز اختياريًا. تعمل دون اتصال، وتُزامن مهام الحساب عند تسجيل الدخول وتوفر الإنترنت.',
        en: 'Add, complete and delete tasks with an optional due date. Works offline; account tasks sync when signed in and online.',
      },
    },
    {
      id: 'reminders',
      status: 'partial',
      title: { ar: 'المواعيد والتنبيهات', en: 'Due dates and reminders' },
      description: {
        ar: 'يمكن تحديد موعد إنجاز للمهمة. التنبيهات والإشعارات الفعلية ما زالت قيد التخطيط.',
        en: 'Task due dates are available. Actual alerts and notifications are still planned.',
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
        ar: 'تُزامن مهام الحساب بين الجلسات عند توفر الإنترنت. مهام الضيف تبقى على الجهاز.',
        en: 'Account tasks sync across sessions when online. Guest tasks remain on-device.',
      },
    },
  ],
}
