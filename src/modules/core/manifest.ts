import { LayoutDashboard } from 'lucide-react'
import type { ModuleManifest } from '@/platform'

export const manifest: ModuleManifest = {
  id: 'core',
  name: 'REMO CORE',
  path: '/core',
  icon: LayoutDashboard,
  tagline: { ar: 'المركز الرئيسي للمنظومة', en: 'The platform hub' },
  description: {
    ar: 'لوحة التحكم، التنقل بين الوحدات، وإعدادات الواجهة.',
    en: 'The dashboard, navigation between modules, and interface settings.',
  },
  features: [
    {
      id: 'dashboard',
      status: 'implemented',
      title: { ar: 'لوحة التحكم وسجل الوحدات', en: 'Dashboard and module registry' },
      description: {
        ar: 'عرض الوحدات السبع مع حالتها الفعلية والتنقل بينها.',
        en: 'All seven modules with their actual status, and navigation between them.',
      },
    },
    {
      id: 'i18n',
      status: 'implemented',
      title: { ar: 'العربية والإنجليزية', en: 'Arabic and English' },
      description: {
        ar: 'تبديل فوري بين العربية (من اليمين لليسار) والإنجليزية (من اليسار لليمين).',
        en: 'Instant switching between Arabic (right-to-left) and English (left-to-right).',
      },
    },
    {
      id: 'themes',
      status: 'implemented',
      title: { ar: 'السمات', en: 'Themes' },
      description: {
        ar: 'سمة داكنة وفاتحة، أو اتباع إعداد النظام.',
        en: 'Dark and light themes, or follow the system setting.',
      },
    },
    {
      id: 'preferences',
      status: 'implemented',
      title: { ar: 'حفظ التفضيلات', en: 'Saved preferences' },
      description: {
        ar: 'تُحفظ اللغة والسمة على هذا الجهاز وتُستعاد عند الفتح التالي.',
        en: 'Language and theme are saved on this device and restored on the next visit.',
      },
    },
    {
      id: 'pwa',
      status: 'implemented',
      title: { ar: 'تطبيق قابل للتثبيت', en: 'Installable app' },
      description: {
        ar: 'يمكن تثبيته على الشاشة الرئيسية، وتفتح الواجهة دون اتصال بعد أول زيارة.',
        en: 'Can be installed to the home screen; the interface opens offline after the first visit.',
      },
    },
    {
      id: 'accounts',
      status: 'planned',
      title: { ar: 'الحسابات وتسجيل الدخول', en: 'Accounts and sign-in' },
      description: {
        ar: 'حساب مستخدم حقيقي عبر خدمة مصادقة. لا يوجد تسجيل دخول في هذه النسخة.',
        en: 'Real user accounts through an authentication service. There is no sign-in in this build.',
      },
    },
    {
      id: 'more-languages',
      status: 'planned',
      title: { ar: 'لغات إضافية', en: 'More languages' },
      description: {
        ar: 'إضافة لغات أخرى فوق البنية الحالية.',
        en: 'Additional languages on top of the current structure.',
      },
    },
  ],
}
