import { ListChecks } from 'lucide-react'
import type { ModuleManifest } from '@/platform'

export const manifest: ModuleManifest = {
  id: 'life', name: 'REMO LIFE', path: '/life', icon: ListChecks,
  tagline: { ar: 'تنظيم الحياة والمهام', en: 'Life and task organisation' },
  description: { ar: 'أدوات شخصية لتنظيم يومك. أضف المهام والتذكيرات المتعددة وحدد مواعيدها، وتُزامن بيانات الحساب عند توفر الاتصال.', en: 'Personal tools for organising your day. Add tasks and multiple reminders; account data syncs when online.' },
  features: [
    { id: 'tasks', status: 'implemented', title: { ar: 'قائمة المهام', en: 'Task list' }, description: { ar: 'أضف المهام وأنجزها واحذفها وحدد موعد إنجاز اختياريًا. تعمل دون اتصال، وتُزامن مهام الحساب عند تسجيل الدخول وتوفر الإنترنت.', en: 'Add, complete and delete tasks with an optional due date. Works offline; account tasks sync when signed in and online.' } },
    { id: 'due-dates', status: 'implemented', title: { ar: 'مواعيد إنجاز المهام', en: 'Task due dates' }, description: { ar: 'حدد موعد إنجاز اختياريًا لكل مهمة، ويُحفظ محليًا ويُزامن مع الحساب.', en: 'Set an optional due date for each task; dates are stored locally and synced with the account.' } },
    { id: 'reminders', status: 'planned', title: { ar: 'التنبيهات والتذكيرات', en: 'Alerts and reminders' }, description: { ar: 'إضافة وإدارة عدة مواعيد تذكير لكل مهمة قيد التطوير. الإشعارات الفعلية عند إغلاق التطبيق لم تُفعّل بعد.', en: 'Adding and managing multiple reminders per task is under development. Background push notifications are not enabled yet.' } },
    { id: 'habits', status: 'planned', title: { ar: 'متابعة العادات', en: 'Habit tracking' }, description: { ar: 'عادات يومية مع سجل الالتزام.', en: 'Daily habits with a streak history.' } },
    { id: 'sync', status: 'implemented', title: { ar: 'مزامنة المهام للحساب', en: 'Account task sync' }, description: { ar: 'تُزامن مهام الحساب بين الجلسات والأجهزة عند توفر الإنترنت. مهام الضيف تبقى على الجهاز.', en: 'Account tasks sync across sessions and devices when online. Guest tasks remain on-device.' } },
  ],
}