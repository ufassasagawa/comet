'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { COLOR_PALETTE, CommentBroadcast } from '@/types'

const MAX_CHARS = 40

type Props = {
  roomId: string
  roomSlug: string
}

export default function CommentForm({ roomId, roomSlug }: Props) {
  const [text, setText] = useState('')
  const [color, setColor] = useState('white')
  const [nickname, setNickname] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('comet_nickname') ?? '' : ''
  )
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastSentAt = useRef(0)
  const isComposing = useRef(false) // IME変換中フラグ
  const supabase = createClient()

  const handleNicknameChange = useCallback((v: string) => {
    setNickname(v)
    localStorage.setItem('comet_nickname', v)
  }, [])

  async function handleSend() {
    const now = Date.now()
    if (!text.trim() || sending) return
    if (now - lastSentAt.current < 1000) return // 1秒に1件
    lastSentAt.current = now
    setSending(true)
    setError(null)

    try {
      const content = text.trim().slice(0, MAX_CHARS)
      const nick = nickname.trim() || null

      const { error: insertError } = await supabase.from('messages').insert({
        room_id: roomId,
        content,
        color,
        nickname: nick,
      })

      if (insertError) {
        setError('コメントを送信できませんでした。ルームが終了しているか、接続に問題があります。')
        return // text はクリアしない（再送可能に）
      }

      // 表示配信はスタンプと同じ Realtime Broadcast（DB保存はログ用のみ）
      const status = await supabase.channel(`danmaku:${roomSlug}`).send({
        type: 'broadcast',
        event: 'comment',
        payload: { id: `${Date.now()}-${Math.random()}`, content, color, nickname: nick } satisfies CommentBroadcast,
      })
      if (status !== 'ok') console.warn('[comet] comment broadcast failed:', status)

      setText('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ニックネーム */}
      <div>
        <label className="block text-xs text-slate-400 mb-1.5">ニックネーム（任意）</label>
        <input
          type="text"
          value={nickname}
          onChange={e => handleNicknameChange(e.target.value)}
          placeholder="匿名"
          maxLength={20}
          className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 text-sm"
          style={{ background: '#0f172a', border: '1px solid #334155', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties}
        />
      </div>

      {/* 色パレット */}
      <div>
        <label className="block text-xs text-slate-400 mb-1.5">文字色</label>
        <div className="flex gap-2 flex-wrap">
          {COLOR_PALETTE.map(c => (
            <button
              key={c.name}
              onClick={() => setColor(c.name)}
              className="w-9 h-9 rounded-full transition-all"
              style={{
                background: c.value,
                border: color === c.name ? '3px solid var(--accent)' : '2px solid #334155',
                transform: color === c.name ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* テキスト入力 */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-slate-400">コメント</label>
          <span className={`text-xs ${text.length >= MAX_CHARS ? 'text-red-400' : 'text-slate-500'}`}>
            {text.length}/{MAX_CHARS}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
            onCompositionStart={() => { isComposing.current = true }}
            onCompositionEnd={() => { isComposing.current = false }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !isComposing.current) handleSend()
            }}
            placeholder="コメントを入力…"
            className="flex-1 px-4 py-3 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2"
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              color: COLOR_PALETTE.find(c => c.name === color)?.value ?? '#fff',
              '--tw-ring-color': 'var(--accent)',
            } as React.CSSProperties}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="px-5 rounded-xl font-bold text-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-30"
            style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', color: '#fff' }}
          >
            →
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      </div>
    </div>
  )
}
