import type { Localized } from '@/platform'

export const strings = {
  skip: { ar: 'تخطَّ إلى المحتوى', en: 'Skip to content' },
  home: { ar: 'الرئيسية', en: 'Home' },
  modules: { ar: 'الوحدات', en: 'Modules' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
  mainNav: { ar: 'التنقل الرئيسي', en: 'Main navigation' },
  foundation: { ar: 'نسخة تأسيسية', en: 'Foundation build' },
  switchLanguage: { ar: 'Switch to English', en: 'التبديل إلى العربية' },
  toLight: { ar: 'التبديل إلى السمة الفاتحة', en: 'Switch to light theme' },
  toDark: { ar: 'التبديل إلى السمة الداكنة', en: 'Switch to dark theme' },
  offline: {
    ar: 'أنت غير متصل بالشبكة. الواجهة تعمل من النسخة المحفوظة.',
    en: 'You are offline. The interface is running from the cached copy.',
  },
  updateReady: { ar: 'يتوفر إصدار جديد.', en: 'A new version is available.' },
  reload: { ar: 'تحديث', en: 'Reload' },
  later: { ar: 'لاحقاً', en: 'Later' },
  loading: { ar: 'جارٍ التحميل…', en: 'Loading…' },
  notFound: { ar: 'الصفحة غير موجودة', en: 'Page not found' },
  notFoundText: { ar: 'لا توجد صفحة على هذا العنوان.', en: 'There is no page at this address.' },
  backHome: { ar: 'العودة إلى الرئيسية', en: 'Back to home' },
  errorTitle: { ar: 'تعذّر تحميل هذه الصفحة', en: 'This page could not be loaded' },
  errorText: {
    ar: 'قد يكون السبب انقطاع الاتصال أو تحديث التطبيق. أعد التحميل للمحاولة مجدداً.',
    en: 'This can happen when the connection drops or the app was updated. Reload to try again.',
  },
  footer: { ar: 'نبني تدريجياً وبشفافية', en: 'Built step by step, transparently' },
} satisfies Record<string, Localized<string>>
