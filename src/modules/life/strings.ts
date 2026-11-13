import type { Localized } from '@/platform'

export const strings = {
  heading: { ar: 'مهامي', en: 'My tasks' },
  inputLabel: { ar: 'مهمة جديدة', en: 'New task' },
  placeholder: { ar: 'ما الذي تريد إنجازه؟', en: 'What do you want to get done?' },
  add: { ar: 'إضافة', en: 'Add' },
  empty: { ar: 'لا توجد مهام بعد. أضف أول مهمة.', en: 'No tasks yet. Add your first one.' },
  remaining: { ar: 'متبقية', en: 'remaining' },
  completed: { ar: 'منجزة', en: 'completed' },
  clearCompleted: { ar: 'حذف المنجزة', en: 'Clear completed' },
  delete: { ar: 'حذف المهمة', en: 'Delete task' },
  full: { ar: 'وصلت إلى الحد الأقصى لعدد المهام.', en: 'You have reached the maximum number of tasks.' },
  syncLoading: { ar: 'جارٍ تحميل مهام الحساب…', en: 'Loading account tasks…' },
  syncReady: { ar: 'مزامنة الحساب مفعّلة عند الاتصال.', en: 'Account sync is enabled when online.' },
  storage: {
    ar: 'تُحفظ المهام في متصفحك على هذا الجهاز فقط. لا تُرسل إلى أي خادم ولا تُنسخ احتياطياً، وتُحذف عند مسح بيانات المتصفح.',
    en: 'Tasks are saved in your browser on this device only. They are not sent to any server or backed up, and are removed if you clear browser data.',
  },
} satisfies Record<string, Localized<string>>
