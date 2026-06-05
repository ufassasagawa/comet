import Link from 'next/link'
import DanmakuPreview from './DanmakuPreview'

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

      {/* 弾幕プレビュー（CSS アニメーションで実際に流れるデモ） */}
      <DanmakuPreview />

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
      <p className="mt-4 text-slate-600 text-xs">Mac / Windows 対応のデスクトップアプリ／主催者のみログインが必要です</p>
    </section>
  )
}
