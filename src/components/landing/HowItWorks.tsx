const STEPS = [
  { num: '1', title: 'ルームを作る', body: 'アプリにログインして「＋ ルームを作る」。イベントごとに専用URLが発行される。' },
  { num: '2', title: 'URLを配る', body: '参加者URLをコピーして Zoom/Meet のチャットに貼る。参加者はログイン不要・スマホでOK。' },
  { num: '3', title: '弾幕を開く', body: '「☄️ 弾幕を開く」を押すと透明なオーバーレイがデスクトップに出現。スライドの上をコメントが流れる。' },
  { num: '4', title: '画面全体を共有', body: 'Zoom/Meet で「画面全体」を共有すれば、会議の全員に弾幕が見える。' },
]

export default function HowItWorks() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-8 py-16">
      <h2 className="text-2xl font-bold text-slate-100 text-center mb-10">イベント当日の流れ</h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {STEPS.map(s => (
          <div
            key={s.num}
            className="flex gap-4 rounded-2xl p-5 border"
            style={{ background: 'var(--bg-secondary)', borderColor: '#334155' }}
          >
            <div
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)' }}
            >
              {s.num}
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 mb-1">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-slate-500 text-sm">
        ルームURLは発行から1週間で自動失効します。イベントごとに作り直してください。
      </p>
    </section>
  )
}
