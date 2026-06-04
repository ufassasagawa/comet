import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative z-10 flex flex-col items-center text-center px-8 pt-24 pb-16">
      <div className="text-7xl mb-4">☄️</div>
      <h1
        className="text-6xl font-bold tracking-tight"
        style={{
          background: 'linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Comet
      </h1>
      <p className="mt-4 text-slate-300 text-xl">オンライン会議に弾幕を流そう</p>
      <p className="mt-2 text-slate-500 text-sm">
        プレゼンの上に参加者のコメント・スタンプがリアルタイムで流れる、社内向けツールです
      </p>

      {/* 弾幕プレビュー（雰囲気が伝わる静的モック） */}
      <div
        className="mt-10 w-full max-w-2xl rounded-2xl border border-slate-700 overflow-hidden relative"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="px-5 py-3 border-b border-slate-700 text-left text-slate-500 text-xs">
          📊 発表スライド.key — 画面共有中
        </div>
        <div className="relative h-44 px-5">
          <span className="absolute top-4 right-8 font-bold text-lg" style={{ color: '#f87171', textShadow: '0 0 4px #000, 1px 1px 2px #000' }}>
            なるほど！！
          </span>
          <span className="absolute top-14 left-10 font-bold text-lg" style={{ color: '#4ade80', textShadow: '0 0 4px #000, 1px 1px 2px #000' }}>
            この機能ほしかった
          </span>
          <span className="absolute top-24 right-20 font-bold text-lg" style={{ color: '#fff', textShadow: '0 0 4px #000, 1px 1px 2px #000' }}>
            ８８８８８８
          </span>
          <span className="absolute bottom-3 left-8 text-3xl">🎉</span>
          <span className="absolute bottom-6 left-24 text-2xl opacity-80">👏</span>
          <span className="absolute bottom-2 right-16 text-3xl">❤️</span>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/auth/login"
          className="px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', color: '#fff' }}
        >
          ログインしてダウンロード
        </Link>
        <a
          href="#install"
          className="px-8 py-4 rounded-2xl font-semibold text-lg border border-slate-600 text-slate-300 transition-all hover:border-slate-400 hover:scale-105 active:scale-95"
        >
          使い方を見る
        </a>
      </div>
      <p className="mt-4 text-slate-600 text-xs">Mac 専用デスクトップアプリ／主催者のみログインが必要です</p>
    </section>
  )
}
