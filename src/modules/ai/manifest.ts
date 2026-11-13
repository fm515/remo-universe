import { Bot } from 'lucide-react'
import type { ModuleManifest } from '@/platform'

export const manifest: ModuleManifest = {
  id: 'ai',
  name: 'REMO AI',
  path: '/ai',
  icon: Bot,
  tagline: { ar: 'المساعد الذكي', en: 'Intelligent assistant' },
  description: {
    ar: 'مساعد ذكاء اصطناعي يخدم جميع وحدات المنظومة. سيُبنى على مزوّد نماذج حقيقي عبر خادم وسيط يحمي مفاتيح الوصول.',
    en: 'An AI assistant serving every module of the platform. It will be built on a real model provider, reached through a server-side proxy that keeps access keys private.',
  },
  notice: {
    ar: 'لا يوجد أي نموذج ذكاء اصطناعي متصل بهذه النسخة، ولا تُولَّد أي ردود. لن تظهر واجهة محادثة قبل ربط نموذج حقيقي.',
    en: 'No AI model is connected in this build and no responses are generated. A chat interface will not appear until a real model is wired in.',
  },
  features: [
    {
      id: 'chat',
      status: 'planned',
      title: { ar: 'محادثة مع المساعد', en: 'Assistant chat' },
      description: {
        ar: 'محادثة نصية بالعربية والإنجليزية مع نموذج لغوي حقيقي.',
        en: 'Text conversation in Arabic and English with a real language model.',
      },
    },
    {
      id: 'proxy',
      status: 'planned',
      title: { ar: 'خادم وسيط آمن', en: 'Secure server-side proxy' },
      description: {
        ar: 'دالة خادم تحتفظ بمفتاح المزوّد وتفرض حدود الاستخدام. لا مفاتيح داخل التطبيق إطلاقاً.',
        en: 'A server function that holds the provider key and enforces usage limits. No keys ever ship in the app.',
      },
    },
    {
      id: 'context',
      status: 'planned',
      title: { ar: 'مساعدة داخل الوحدات', en: 'In-module assistance' },
      description: {
        ar: 'مساعدة مرتبطة بسياق الوحدة المفتوحة، بإذن صريح من المستخدم.',
        en: 'Help that is aware of the module you are in, with explicit user permission.',
      },
    },
  ],
}
