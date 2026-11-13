import { Wallet } from 'lucide-react'
import type { ModuleManifest } from '@/platform'

export const manifest: ModuleManifest = {
  id: 'wallet',
  name: 'REMO WALLET',
  path: '/wallet',
  icon: Wallet,
  tagline: { ar: 'المحفظة والأصول الرقمية', en: 'Wallet and digital assets' },
  description: {
    ar: 'واجهة لإدارة الأصول الرقمية. تبدأ بالاتصال بمحفظة يملكها المستخدم للعرض فقط، دون أن يحتفظ REMO بأي مفاتيح أو أموال.',
    en: 'An interface for digital assets. It starts with a view-only connection to a wallet the user already owns — REMO never holds keys or funds.',
  },
  notice: {
    ar: 'لا توجد أرصدة ولا معاملات ولا مفاتيح ولا عمليات بلوكتشين في هذه النسخة. عملة REMO لم تُصدَر بعد، وهي عملة خدمية (Utility) مخطط لها في مرحلة لاحقة.',
    en: 'This build has no balances, no transactions, no keys and no blockchain operations. The REMO token has not been deployed; it is a utility token planned for a later phase.',
  },
  features: [
    {
      id: 'connect',
      status: 'planned',
      title: { ar: 'ربط محفظة خارجية (للعرض)', en: 'Connect an external wallet (view-only)' },
      description: {
        ar: 'الاتصال بمحفظة يتحكم بها المستخدم. المفاتيح الخاصة لا تغادر محفظته أبداً.',
        en: 'Connect a wallet the user controls. Private keys never leave their wallet.',
      },
    },
    {
      id: 'balances',
      status: 'planned',
      title: { ar: 'الأرصدة من الشبكة', en: 'On-chain balances' },
      description: {
        ar: 'أرصدة تُقرأ مباشرة من الشبكة، مع ذكر المصدر ووقت القراءة.',
        en: 'Balances read directly from the network, shown with source and read time.',
      },
    },
    {
      id: 'history',
      status: 'planned',
      title: { ar: 'سجل المعاملات', en: 'Transaction history' },
      description: {
        ar: 'عرض المعاملات السابقة من بيانات الشبكة العامة.',
        en: 'Past transactions, read from public network data.',
      },
    },
    {
      id: 'token',
      status: 'planned',
      title: { ar: 'عملة REMO الخدمية', en: 'REMO utility token' },
      description: {
        ar: 'مرحلة لاحقة: عملة خدمية داخل المنظومة، بعد تدقيق العقد والمراجعة القانونية. لم تُصدَر.',
        en: 'Later phase: a utility token for use inside the platform, after contract audit and legal review. Not deployed.',
      },
    },
  ],
}
