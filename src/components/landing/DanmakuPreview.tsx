// ヒーロー用の弾幕デモ。CSS アニメーションのみ（JS 不使用）なので Server Component のままで動く。
// オンライン会議（Meet 風）で発表スライドを画面共有している裏画面の上を、
// 本物と同じ雰囲気でコメントが流れ・スタンプが跳ねる。

const COMMENTS = [
  { text: 'なるほど！！', color: '#ff8800', lane: 0, duration: 9, delay: 0 },
  { text: 'この機能ほしかった', color: '#44cc44', lane: 1, duration: 11, delay: 2.5 },
  { text: '８８８８８８８８', color: '#ffffff', lane: 2, duration: 8, delay: 1.2 },
  { text: 'わかりやすい〜', color: '#4499ff', lane: 0, duration: 10, delay: 5 },
  { text: '神機能きた', color: '#cc44ff', lane: 1, duration: 9, delay: 7.5 },
  { text: 'すごい！！！', color: '#ff4444', lane: 2, duration: 10, delay: 4.8 },
]

const STAMPS = [
  { emoji: '🎉', left: '12%', delay: 0 },
  { emoji: '👏', left: '28%', delay: 1.4 },
  { emoji: '❤️', left: '74%', delay: 0.7 },
  { emoji: '😂', left: '58%', delay: 2.1 },
  { emoji: '👍', left: '85%', delay: 2.8 },
  { emoji: '😮', left: '42%', delay: 3.5 },
]

const PARTICIPANTS = [
  { emoji: '🧑‍💻', name: 'Sasagawa', bg: '#3b3460' },
  { emoji: '👩‍💼', name: 'Tanaka', bg: '#2d4a3e' },
  { emoji: '👨‍🦱', name: 'Suzuki', bg: '#4a3a2d' },
  { emoji: '🧔', name: 'Sato', bg: '#2d3c4a' },
]

export default function DanmakuPreview() {
  return (
    <div
      className="mt-10 w-full max-w-2xl rounded-2xl border border-slate-700 overflow-hidden relative shadow-2xl"
      style={{ background: '#1b1e26' }}
    >
      <style>{`
        @keyframes landing-danmaku {
          from { left: 100%; transform: translateX(0); }
          to   { left: 0%;   transform: translateX(-100%); }
        }
        @keyframes landing-stamp {
          0%   { transform: translateY(0) scale(0.4);      opacity: 0; }
          15%  { transform: translateY(-26px) scale(1.15); opacity: 1; }
          30%  { transform: translateY(-52px) scale(1);    opacity: 1; }
          100% { transform: translateY(-150px) scale(1);   opacity: 0; }
        }
      `}</style>

      {/* 会議ウィンドウのタイトルバー */}
      <div className="px-4 py-2.5 border-b border-slate-700/60 flex items-center gap-2" style={{ background: '#22262f' }}>
        <span className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        </span>
        <span className="text-left text-slate-400 text-xs ml-2">全社定例 — オンライン会議</span>
        <span className="ml-auto text-[10px] text-red-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> 画面を共有中
        </span>
      </div>

      <div className="relative h-72 overflow-hidden">
        {/* 会議レイアウト: 左=共有スライド・右=参加者タイル */}
        <div className="absolute inset-0 flex gap-2 p-3 pb-12">
          {/* 共有中のスライド（白いプレゼン資料） */}
          <div className="flex-1 rounded-lg bg-slate-50 px-7 py-5 text-left flex flex-col shadow-inner">
            <p className="text-slate-800 font-bold text-base leading-tight">2026年度 上期ハイライト</p>
            <div className="mt-0.5 h-0.5 w-12 rounded" style={{ background: 'linear-gradient(90deg, #818cf8, #a78bfa)' }} />
            <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600">
              <li>・新規プロジェクト 12件 立ち上げ</li>
              <li>・社内ツール活用で工数 18% 削減</li>
              <li>・AI ワークショップ全社展開</li>
            </ul>
            <div className="mt-auto flex items-end gap-2.5">
              {[
                { h: 'h-7', label: '1Q' },
                { h: 'h-12', label: '2Q' },
                { h: 'h-16', label: '3Q' },
                { h: 'h-20', label: '4Q' },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className={`w-9 ${bar.h} rounded-t-sm`} style={{ background: `rgba(129, 140, 248, ${0.45 + i * 0.18})` }} />
                  <span className="text-[9px] text-slate-400">{bar.label}</span>
                </div>
              ))}
              <p className="ml-auto self-start text-[10px] text-slate-400">売上推移</p>
            </div>
          </div>

          {/* 参加者タイル列 */}
          <div className="w-24 flex flex-col gap-2">
            {PARTICIPANTS.map(p => (
              <div key={p.name} className="flex-1 rounded-md relative flex items-center justify-center text-xl" style={{ background: p.bg }}>
                {p.emoji}
                <span className="absolute bottom-0.5 left-1 text-[8px] text-slate-300/80">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 会議ツールバー */}
        <div className="absolute bottom-0 inset-x-0 h-9 flex items-center justify-center gap-2.5" style={{ background: '#22262f' }}>
          <span className="w-6 h-6 rounded-full bg-slate-600/60 flex items-center justify-center text-[11px]">🎙️</span>
          <span className="w-6 h-6 rounded-full bg-slate-600/60 flex items-center justify-center text-[11px]">📷</span>
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px]" style={{ background: 'rgba(129, 140, 248, 0.4)' }}>🖥️</span>
          <span className="w-9 h-6 rounded-full bg-red-500/80 flex items-center justify-center text-[10px] text-white">退出</span>
        </div>

        {/* 弾幕（右→左・無限ループ）— 会議画面全体の上に重なる */}
        {COMMENTS.map((c, i) => (
          <span
            key={i}
            className="absolute font-bold text-xl whitespace-nowrap pointer-events-none z-10"
            style={{
              top: `${16 + c.lane * 56}px`,
              color: c.color,
              textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 2px 2px 4px rgba(0,0,0,0.6)',
              animation: `landing-danmaku ${c.duration}s linear ${c.delay}s infinite`,
              left: '100%',
            }}
          >
            {c.text}
          </span>
        ))}

        {/* スタンプ（下からポップ・無限ループ） */}
        {STAMPS.map((s, i) => (
          <span
            key={i}
            className="absolute bottom-10 text-3xl pointer-events-none opacity-0 z-10"
            style={{ left: s.left, animation: `landing-stamp 4s ease-out ${s.delay}s infinite` }}
          >
            {s.emoji}
          </span>
        ))}
      </div>
    </div>
  )
}
