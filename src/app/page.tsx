import StarfieldBg from '@/components/landing/StarfieldBg'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Install from '@/components/landing/Install'

// ブラウザ向けランディング（アプリ紹介・ログイン・ダウンロード導線）。
// デスクトップアプリ（comet_app クッキーあり）は proxy.ts がここへ来る前に /dashboard へ流す。
export default function LandingPage() {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <StarfieldBg />
      <Hero />
      <Features />
      <HowItWorks />
      <Install />
      <footer className="relative z-10 text-center text-slate-600 text-xs py-10 border-t border-slate-800">
        Comet ☄️ — 社内向けツール／お問い合わせは Slack で佐々川まで
      </footer>
    </div>
  )
}
