import { ShoppingBag } from 'lucide-react'
import type { ModuleManifest } from '@/platform'

export const manifest: ModuleManifest = {
  id: 'store',
  name: 'REMO STORE',
  path: '/store',
  icon: ShoppingBag,
  tagline: { ar: 'السوق الرقمي', en: 'Digital marketplace' },
  description: {
    ar: 'سوق للمنتجات والخدمات الرقمية داخل المنظومة، مع دفع عبر مزوّد مدفوعات مرخّص.',
    en: 'A marketplace for digital products and services inside the platform, with checkout through a licensed payment provider.',
  },
  notice: {
    ar: 'لا توجد منتجات ولا بائعون ولا مدفوعات في هذه النسخة. لا تُعرض منتجات تجريبية على أنها حقيقية.',
    en: 'This build has no products, no sellers and no payments. No sample products are shown as if they were real.',
  },
  features: [
    {
      id: 'catalog',
      status: 'planned',
      title: { ar: 'كتالوج المنتجات', en: 'Product catalogue' },
      description: {
        ar: 'تصفّح وبحث في منتجات حقيقية مخزّنة في قاعدة البيانات.',
        en: 'Browse and search real products stored in the database.',
      },
    },
    {
      id: 'sellers',
      status: 'planned',
      title: { ar: 'حسابات البائعين', en: 'Seller accounts' },
      description: {
        ar: 'إضافة المنتجات وإدارتها من قِبل بائعين موثَّقين.',
        en: 'Verified sellers can add and manage their listings.',
      },
    },
    {
      id: 'checkout',
      status: 'planned',
      title: { ar: 'الدفع', en: 'Checkout' },
      description: {
        ar: 'عبر مزوّد مدفوعات مرخّص. بيانات البطاقات لا تمرّ بخوادم REMO.',
        en: 'Through a licensed payment provider. Card data never touches REMO servers.',
      },
    },
  ],
}
