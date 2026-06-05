import Link from 'next/link'
import { INSTALL_MD_PATH } from '@/lib/constants'

const MAC_STEPS = [
  <>.dmg を開き <span className="text-slate-200 font-medium">☄️ Comet を「Applications」にドラッグ</span></>,
  <>Comet をダブルクリック →「開けません」は <span className="text-slate-200 font-medium">「OK」</span> で閉じる</>,
  <><span className="text-slate-200 font-medium">システム設定 → プライバシーとセキュリティ →「このまま開く」</span>（<span className="text-amber-400">初回だけ</span>）</>,
  <>次回からは普通にダブルクリックでOK 🎉</>,
]

const WIN_STEPS = [
  <>.exe を <span className="text-slate-200 font-medium">ダブルクリックで実行</span></>,
  <>「PC が保護されました」→ <span className="text-slate-200 font-medium">「詳細情報」→「実行」</span>（<span className="text-amber-400">初回だけ</span>）</>,
  <>ウィザードで <span className="text-slate-200 font-medium">「次へ」→「インストール」</span>（管理者権限不要）</>,
  <>スタートメニュー／デスクトップから起動 🎉</>,
]

function StepList({ title, steps }: { title: string; steps: React.ReactNode[] }) {
  return (
    <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-secondary)', borderColor: '#334155' }}>
      <p className="font-semibold text-slate-100 mb-3">{title}</p>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-slate-400 leading-relaxed">
            <span className="shrink-0 text-slate-500 font-bold">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Install() {
  return (
    <section id="install" className="relative z-10 max-w-3xl mx-auto px-8 py-16">
      <h2 className="text-2xl font-bold text-slate-100 text-center mb-3">インストール（3分・初回だけ）</h2>
      <p className="text-center text-slate-500 text-sm mb-10">ログインすると、お使いの OS のインストーラをダウンロードできます</p>
      <div className="grid sm:grid-cols-2 gap-5">
        <StepList title=" Mac" steps={MAC_STEPS} />
        <StepList title="⊞ Windows" steps={WIN_STEPS} />
      </div>
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
