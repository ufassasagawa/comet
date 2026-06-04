const FEATURES = [
  {
    emoji: '💬',
    title: '弾幕コメント',
    body: '参加者がスマホから送ったコメントが、ニコニコ動画風に右から左へ流れる。色も選べて、重ならないよう自動でレーン割り当て。',
  },
  {
    emoji: '🎉',
    title: 'スタンプ連打',
    body: '8種類のスタンプ（❤️ 👍 🎉 👏 😂 😮 😢 🤔）が画面下からポンポン上がる。連打した分だけ全部出る。',
  },
  {
    emoji: '📜',
    title: 'コメントログ',
    body: '流れて消えたコメントも全部保存。イベントが終わったあと、時系列でゆっくり見返せる。',
  },
]

export default function Features() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-8 py-16">
      <h2 className="text-2xl font-bold text-slate-100 text-center mb-10">できること</h2>
      <div className="grid sm:grid-cols-3 gap-5">
        {FEATURES.map(f => (
          <div
            key={f.title}
            className="rounded-2xl p-5 border"
            style={{ background: 'var(--bg-secondary)', borderColor: '#334155' }}
          >
            <div className="text-3xl mb-3">{f.emoji}</div>
            <h3 className="font-semibold text-slate-100 mb-2">{f.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
