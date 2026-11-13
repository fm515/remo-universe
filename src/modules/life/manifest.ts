import { ListChecks } from 'lucide-react'
import type { ModuleManifest } from '@/platform'

export const manifest: ModuleManifest = {
  id: 'life',
  name: 'REMO LIFE',
  path: '/life',
  icon: ListChecks,
  tagline: { ar: 'تنظيم الحياة والمهام', en: 'Life and task organisation' },
  description: {
    ar: 'أدوات شخصية لتنظيم يومك. قائمة المهام تعمل الآن وتُحفظ على جهازك.',
    en: 'Personal tools for organising your day. The task list works now and is saved on your device.',
  },
  features: [
    {
      id: 'tasks',
      status: 'implemented',
      title: { ar: 'قائمة المهام', en: 'Task list' },
      description: {
        ar: 'أضف المهام وأنجزها واحذفها. تُحفظ في متصفحك على هذا الجهاز وتعمل دون اتصال.',
        en: 'Add, complete and delete tasks. Saved in your browser on this device; works offline.',
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
      status: 'planned',
      title: { ar: 'النسخ الاحتياطي والمزامنة', en: 'Backup and sync' },
      description: {
        ar: 'حفظ المهام في حسابك عند توفر حسابات REMO.',
        en: 'Store tasks in your account once REMO accounts exist.',
      },
    },
  ],
}
