import type { Localized } from '../i18n'
import type { FeatureStatus, ModuleStatus } from '../modules'

/** Shared vocabulary. Module-specific text lives inside each module. */
export const statusLabel: Record<ModuleStatus | FeatureStatus, Localized<string>> = {
  active: { ar: 'يعمل', en: 'Working' },
  partial: { ar: 'يعمل جزئياً', en: 'Partly working' },
  implemented: { ar: 'مُنفَّذ', en: 'Implemented' },
  planned: { ar: 'مخطط له', en: 'Planned' },
}

export const common = {
  implementedHeading: { ar: 'ما يعمل الآن', en: 'Working now' },
  plannedHeading: { ar: 'مخطط له — غير متوفر بعد', en: 'Planned — not available yet' },
  nothingImplemented: {
    ar: 'لا توجد وظائف مُنفَّذة في هذه الوحدة حتى الآن.',
    en: 'Nothing in this module is implemented yet.',
  },
  noticeLabel: { ar: 'تنبيه', en: 'Please note' },
} satisfies Record<string, Localized<string>>
