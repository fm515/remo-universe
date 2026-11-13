import { ChartCandlestick } from 'lucide-react'
import type { ModuleManifest } from '@/platform'

export const manifest: ModuleManifest = {
  id: 'trade',
  name: 'REMO TRADE',
  path: '/trade',
  icon: ChartCandlestick,
  tagline: { ar: 'الأسواق والتحليل', en: 'Markets and analysis' },
  description: {
    ar: 'أدوات لمتابعة الأسواق وتحليلها. تبدأ بعرض بيانات حقيقية من مزوّد موثّق، وأي تنفيذ للصفقات يأتي لاحقاً ويخضع للمتطلبات القانونية والتنظيمية.',
    en: 'Tools for following and analysing markets. It starts with real data from a documented provider; any order execution comes later and is subject to legal and regulatory requirements.',
  },
  notice: {
    ar: 'لا توجد بيانات أسواق ولا أسعار ولا تنفيذ صفقات في هذه النسخة. لا يُعرض أي رقم لأنه لا يوجد مصدر بيانات حقيقي متصل.',
    en: 'This build has no market data, no prices and no trade execution. No figures are shown because no real data source is connected.',
  },
  features: [
    {
      id: 'market-data',
      status: 'planned',
      title: { ar: 'بيانات أسواق حقيقية', en: 'Real market data' },
      description: {
        ar: 'أسعار من مزوّد بيانات معلن المصدر، مع إظهار وقت آخر تحديث.',
        en: 'Prices from a named data provider, always shown with their last-updated time.',
      },
    },
    {
      id: 'watchlist',
      status: 'planned',
      title: { ar: 'قوائم المتابعة', en: 'Watchlists' },
      description: {
        ar: 'قوائم شخصية للأصول التي تتابعها.',
        en: 'Personal lists of the assets you follow.',
      },
    },
    {
      id: 'analysis',
      status: 'planned',
      title: { ar: 'أدوات التحليل', en: 'Analysis tools' },
      description: {
        ar: 'رسوم بيانية ومؤشرات فنية مبنية على البيانات الحقيقية.',
        en: 'Charts and technical indicators computed from the real data.',
      },
    },
    {
      id: 'execution',
      status: 'planned',
      title: { ar: 'تنفيذ الصفقات', en: 'Order execution' },
      description: {
        ar: 'مرحلة متأخرة، عبر وسيط مرخّص فقط وبعد مراجعة قانونية.',
        en: 'A late phase, only through a licensed broker and after legal review.',
      },
    },
  ],
}
