import Link from 'next/link'
import { INSTALL_MD_PATH } from '@/lib/constants'

const INSTALL_STEPS = [
  <>ログインして <span className="text-slate-200 font-medium">.dmg をダウンロード</span>（社内の Google Drive からDLします）</>,
  <>dmg をダブルクリック → <span className="text-slate-200 font-medium">☄️ Comet を「Applications」にドラッグ</span></>,
  <>
    アプリケーションフォルダから <span className="text-slate-200 font-medium">右クリック →「開く」</span>
    （「開発元を検証できません」と出たらもう一度「開く」。<span className="text-amber-400">この右クリック起動は初回の1回だけ</span>）
  </>,
  <>次回からは普通にダブルクリックでOK 🎉</>,
]

export default function Install() {
  return (
    <section id="install" className="relative z-10 max-w-2xl mx-auto px-8 py-16">
      <h2 className="text-2xl font-bold text-slate-100 text-center mb-10">インストール（3分・初回だけ）</h2>
      <ol className="space-y-4">
        {INSTALL_STEPS.map((step, i) => (
          <li
            key={i}
            className="flex gap-4 rounded-2xl p-5 border text-sm text-slate-400 leading-relaxed"
            style={{ background: 'var(--bg-secondary)', borderColor: '#334155' }}
          >
            <span className="shrink-0 text-slate-500 font-bold">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-col items-center gap-3">
        <Link
          href="/auth/login"
          className="px-8 py-4 rounded-2xl font-semibold transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', color: '#fff' }}
        >
          ログインしてダウンロードへ
        </Link>
        <a href={INSTALL_MD_PATH} download className="text-sm text-slate-500 hover:text-slate-300 underline transition-colors">
          説明書（INSTALL.md）をダウンロード
        </a>
      </div>
    </section>
  )
}
