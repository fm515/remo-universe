import { Globe2 } from 'lucide-react'
import type { ModuleManifest } from '@/platform'

export const manifest: ModuleManifest = {
  id: 'network',
  name: 'REMO NETWORK',
  path: '/network',
  icon: Globe2,
  tagline: { ar: 'ربط خدمات المنظومة', en: 'Connecting the platform' },
  description: {
    ar: 'الطبقة التي تربط الوحدات بالخدمات الخلفية: الحسابات، المزامنة، والإشعارات. تبدأ بخدمة خلفية واحدة ضمن الباقات المجانية.',
    en: 'The layer that connects modules to backend services: accounts, sync and notifications. It starts with a single backend that fits free-tier plans.',
  },
  notice: {
    ar: 'لا توجد خدمة خلفية متصلة بهذه النسخة. التطبيق يعمل كاملاً على جهازك ولا يرسل أي بيانات.',
    en: 'No backend is connected in this build. The app runs entirely on your device and sends no data anywhere.',
  },
  features: [
    {
      id: 'accounts',
      status: 'planned',
      title: { ar: 'حساب REMO موحّد', en: 'Unified REMO account' },
      description: {
        ar: 'تسجيل دخول واحد لجميع الوحدات.',
        en: 'One sign-in for every module.',
      },
    },
    {
      id: 'sync',
      status: 'planned',
      title: { ar: 'المزامنة بين الأجهزة', en: 'Cross-device sync' },
      description: {
        ar: 'مزامنة التفضيلات وبيانات الوحدات بين أجهزتك.',
        en: 'Sync preferences and module data across your devices.',
      },
    },
    {
      id: 'notifications',
      status: 'planned',
      title: { ar: 'الإشعارات', en: 'Notifications' },
      description: {
        ar: 'إشعارات فورية اختيارية من الوحدات.',
        en: 'Optional push notifications from modules.',
      },
    },
    {
      id: 'status',
      status: 'planned',
      title: { ar: 'حالة الخدمات', en: 'Service status' },
      description: {
        ar: 'صفحة تعرض الحالة الفعلية للخدمات الخلفية.',
        en: 'A page showing the actual state of backend services.',
      },
    },
  ],
}
