import type { Localized } from '@/platform'

export const strings = {
  // Dashboard
  buildPill: { ar: 'نسخة تأسيسية', en: 'Foundation build' },
  welcome: { ar: 'مرحباً بك في', en: 'Welcome to' },
  heroText: {
    ar: 'منظومة رقمية من سبع وحدات مستقلة. هذه النسخة تؤسّس الواجهة والبنية، وكل وحدة تعرض بوضوح ما يعمل فعلاً وما هو مخطط له فقط.',
    en: 'A digital platform of seven independent modules. This build lays down the interface and architecture, and every module states plainly what works today and what is only planned.',
  },
  statModules: { ar: 'وحدات', en: 'Modules' },
  statImplemented: { ar: 'وظائف تعمل', en: 'Features working' },
  statPlanned: { ar: 'وظائف مخطط لها', en: 'Features planned' },
  modulesHeading: { ar: 'الوحدات', en: 'Modules' },
  modulesIntro: {
    ar: 'كل وحدة مستقلة داخل تطبيق واحد. افتح أي وحدة لترى حالتها بالتفصيل.',
    en: 'Each module is independent inside one app. Open any module to see its status in detail.',
  },
  featuresWorking: { ar: 'وظائف تعمل', en: 'working' },
  featuresOf: { ar: 'من', en: 'of' },
  legendHeading: { ar: 'معنى الحالات', en: 'What the statuses mean' },
  legendActive: {
    ar: 'كل وظائف الوحدة المذكورة تعمل في هذه النسخة.',
    en: 'Every listed feature of the module works in this build.',
  },
  legendPartial: {
    ar: 'بعض الوظائف تعمل فعلاً، والباقي مخطط له.',
    en: 'Some features really work; the rest are planned.',
  },
  legendPlanned: {
    ar: 'لا شيء يعمل بعد. لا تُعرض بيانات أو نتائج وهمية.',
    en: 'Nothing works yet. No mock data or simulated results are shown.',
  },

  // Settings
  settings: { ar: 'الإعدادات', en: 'Settings' },
  settingsIntro: {
    ar: 'تفضيلات الواجهة تُحفظ على هذا الجهاز.',
    en: 'Interface preferences are saved on this device.',
  },
  language: { ar: 'اللغة', en: 'Language' },
  languageHint: {
    ar: 'تغيّر اللغة واتجاه الواجهة فوراً.',
    en: 'Changes the language and layout direction immediately.',
  },
  theme: { ar: 'السمة', en: 'Theme' },
  themeHint: { ar: '«النظام» يتبع إعداد جهازك.', en: '"System" follows your device setting.' },
  themeSystem: { ar: 'النظام', en: 'System' },
  themeDark: { ar: 'داكنة', en: 'Dark' },
  themeLight: { ar: 'فاتحة', en: 'Light' },
  app: { ar: 'التطبيق', en: 'App' },
  install: { ar: 'تثبيت التطبيق', en: 'Install app' },
  installTitle: { ar: 'التثبيت', en: 'Installation' },
  installed: { ar: 'يعمل كتطبيق مثبَّت.', en: 'Running as an installed app.' },
  installAvailable: {
    ar: 'يمكن تثبيت التطبيق على هذا الجهاز.',
    en: 'This app can be installed on this device.',
  },
  installManual: {
    ar: 'لتثبيته افتح قائمة المتصفح واختر «إضافة إلى الشاشة الرئيسية» أو «تثبيت التطبيق».',
    en: 'To install, open the browser menu and choose "Add to Home screen" or "Install app".',
  },
  offlineTitle: { ar: 'العمل دون اتصال', en: 'Offline use' },
  offlineReady: {
    ar: 'الواجهة محفوظة على الجهاز وتفتح دون اتصال.',
    en: 'The interface is cached on this device and opens without a connection.',
  },
  offlineNotReady: {
    ar: 'غير محفوظة للعمل دون اتصال بعد (تتوفر في النسخة المنشورة بعد أول زيارة).',
    en: 'Not cached for offline use yet (available in the published build after the first visit).',
  },
  connectionTitle: { ar: 'الاتصال', en: 'Connection' },
  online: { ar: 'المتصفح متصل بالشبكة.', en: 'The browser is online.' },
  offline: { ar: 'المتصفح غير متصل بالشبكة.', en: 'The browser is offline.' },
  versionTitle: { ar: 'الإصدار', en: 'Version' },
  data: { ar: 'بياناتك', en: 'Your data' },
  dataText: {
    ar: 'لا توجد حسابات ولا خوادم ولا أدوات تتبّع في هذه النسخة. التفضيلات ومهام REMO LIFE تُحفظ في متصفحك فقط.',
    en: 'This build has no accounts, no servers and no trackers. Preferences and REMO LIFE tasks are stored in your browser only.',
  },
  reset: { ar: 'إعادة ضبط تفضيلات الواجهة', en: 'Reset interface preferences' },
  resetHint: {
    ar: 'يعيد اللغة والسمة إلى الإعداد الافتراضي. لا يحذف مهامك.',
    en: 'Returns language and theme to their defaults. Does not delete your tasks.',
  },
} satisfies Record<string, Localized<string>>
