'use client'

import { useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { STAMP_EMOJIS } from '@/types'

const MAX_STAMPS_PER_SEC = 8

type Props = {
  roomSlug: string
}

export default function StampPanel({ roomSlug }: Props) {
  const supabase = createClient()
  const stampCount = useRef(0)
  const windowStart = useRef(Date.now())

  async function sendStamp(emoji: string) {
    const now = Date.now()
    // 1秒ウィンドウをリセット
    if (now - windowStart.current >= 1000) {
      stampCount.current = 0
      windowStart.current = now
    }
    if (stampCount.current >= MAX_STAMPS_PER_SEC) return
    stampCount.current++

    const channel = supabase.channel(`room:${roomSlug}`)
    await channel.send({
      type: 'broadcast',
      event: 'stamp',
      payload: { emoji, id: `${Date.now()}-${Math.random()}` },
    })
  }

  return (
    <div>
      <label className="block text-xs text-slate-400 mb-2">スタンプ（連打OK！）</label>
      <div className="grid grid-cols-4 gap-3">
        {STAMP_EMOJIS.map(emoji => (
          <button
            key={emoji}
            onClick={() => sendStamp(emoji)}
            className="text-3xl py-3 rounded-2xl transition-all active:scale-90 hover:scale-110 select-none"
            style={{ background: '#1e293b', border: '1px solid #334155' }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
