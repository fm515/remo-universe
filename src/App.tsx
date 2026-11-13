import { useState } from 'react'
import { Activity, Bot, BriefcaseBusiness, ChartCandlestick, ChevronLeft, CircleUserRound, Coins, Globe2, Languages, LayoutDashboard, ShieldCheck, ShoppingBag, Wallet } from 'lucide-react'

const modules = [
  { id: 'core', name: 'REMO CORE', desc: 'المركز الرئيسي وإدارة المنظومة', icon: LayoutDashboard, status: 'نشط كواجهة' },
  { id: 'ai', name: 'REMO AI', desc: 'مساعد الذكاء الاصطناعي', icon: Bot, status: 'قيد التخطيط' },
  { id: 'trade', name: 'REMO TRADE', desc: 'تحليل الأسواق والتداول', icon: ChartCandlestick, status: 'قيد التخطيط' },
  { id: 'wallet', name: 'REMO WALLET', desc: 'المحفظة والأصول الرقمية', icon: Wallet, status: 'قيد التخطيط' },
  { id: 'store', name: 'REMO STORE', desc: 'السوق الرقمي', icon: ShoppingBag, status: 'قيد التخطيط' },
  { id: 'life', name: 'REMO LIFE', desc: 'إدارة الحياة والمهام', icon: BriefcaseBusiness, status: 'قيد التخطيط' },
  { id: 'network', name: 'REMO NETWORK', desc: 'ربط خدمات المنظومة', icon: Globe2, status: 'قيد التخطيط' },
]
export default function App() {
  const [active, setActive] = useState('core')
  const [english, setEnglish] = useState(false)
  const current = modules.find(m => m.id === active) ?? modules[0]
  const t = (ar: string, en: string) => english ? en : ar
  return <div className="app" dir={english ? 'ltr' : 'rtl'}>
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">R</div><div><b>REMO</b><small>UNIVERSE</small></div></div>
      <div className="nav-label">{t('المنظومة','UNIVERSE')}</div>
      {modules.map(m => { const Icon = m.icon; return <button key={m.id} className={'nav-item '+(active===m.id?'selected':'')} onClick={()=>setActive(m.id)}><Icon size={18}/><span>{m.name}</span><ChevronLeft size={15}/></button> })}
      <div className="side-foot"><ShieldCheck size={16}/>{t('نسخة تأسيسية','FOUNDATION BUILD')}</div>
    </aside>
    <main>
      <header><div><span className="eyebrow">{t('منظومة رقمية متكاملة','MODULAR DIGITAL ECOSYSTEM')}</span><h1>{t('مرحباً بك في','WELCOME TO')} <em>REMO UNIVERSE</em></h1></div><button className="lang" onClick={()=>setEnglish(!english)}><Languages size={17}/>{english?'العربية':'English'}</button></header>
      <section className="hero"><div><span className="pill"><Activity size={13}/>{t('الإصدار التأسيسي 0.1.0','FOUNDATION RELEASE 0.1.0')}</span><h2>{t('منظومة واحدة، إمكانات بلا حدود.','One universe. Limitless possibilities.')}</h2><p>{t('نبني الأساس modular لوحدات مستقلة تتطور معاً ضمن تجربة واحدة.','A modular foundation for independent modules evolving in one experience.')}</p></div><div className="hero-orb"><div>REMO<span>✦</span></div></div></section>
      <div className="section-head"><div><span className="eyebrow">{t('الوحدات','MODULES')}</span><h2>{t('مكوّنات المنظومة','Universe modules')}</h2></div><span className="count">07 MODULES</span></div>
      <section className="cards">{modules.map(m=>{const Icon=m.icon;return <button key={m.id} className={'module-card '+(active===m.id?'active':'')} onClick={()=>setActive(m.id)}><div className="card-icon"><Icon size={21}/></div><h3>{m.name}</h3><p>{t(m.desc, ({core:'Main hub and ecosystem management',ai:'AI assistant',trade:'Market analysis and trading',wallet:'Wallet and digital assets',store:'Digital marketplace',life:'Life and task management',network:'Connect ecosystem services'} as Record<string,string>)[m.id])}</p><div className="card-bottom"><span>{t(m.status, m.id==='core'?'UI foundation active':'Planned')}</span><ChevronLeft size={16}/></div></button>})}</section>
      <section className="detail"><div className="detail-icon"><current.icon size={22}/></div><div><span className="eyebrow">{t('الوحدة المحددة','SELECTED MODULE')}</span><h3>{current.name}</h3><p>{t('هذه الوحدة ضمن خارطة الطريق ولم يتم تفعيل وظائفها بعد. سنضيف الوظائف الحقيقية ونختبرها قبل إعلان جاهزيتها.','This module is on the roadmap and its functionality is not enabled yet. Real features will be added and tested before being marked ready.')}</p></div><span className="planned">{t('مخطط لها','PLANNED')}</span></section>
      <footer><span>© REMO UNIVERSE</span><span>{t('نبني تدريجياً وبشفافية','BUILDING STEP BY STEP, TRANSPARENTLY')}</span></footer>
    </main>
  </div>
}
