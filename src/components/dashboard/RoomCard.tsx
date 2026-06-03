'use client'

import { useState } from 'react'
import { Room } from '@/types'
import { getRemainingDays } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

type Props = {
  room: Room
  origin: string
  onUpdated: () => void
}

export default function RoomCard({ room, origin, onUpdated }: Props) {
  const [copied, setCopied] = useState(false)
  const [ending, setEnding] = useState(false)
  const supabase = createClient()
  const participantUrl = `${origin}/r/${room.slug}`
  const overlayUrl = `${origin}/overlay/${room.slug}`
  const remaining = getRemainingDays(room.expires_at)

  async function copyUrl() {
    await navigator.clipboard.writeText(participantUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function endRoom() {
    if (!confirm(`「${room.title}」を終了しますか？\n参加者がアクセスできなくなります。`)) return
    setEnding(true)
    await supabase.from('rooms').update({ is_active: false }).eq('id', room.id)
    onUpdated()
  }

  const isExpired = !room.is_active || remaining === 0

  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid #334155' }}>
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-lg leading-tight">{room.title}</h3>
          <p className="text-slate-400 text-sm mt-1">
            {isExpired ? (
              <span className="text-red-400">終了済み</span>
            ) : (
              <span className="text-emerald-400">残り {remaining} 日</span>
            )}
          </p>
        </div>
        {!isExpired && (
          <span className="px-2 py-1 rounded-full text-xs font-medium text-emerald-300" style={{ background: 'rgba(52,211,153,0.15)' }}>
            開催中
          </span>
        )}
      </div>

      {/* URL */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4 overflow-hidden" style={{ background: '#0f172a' }}>
        <span className="text-slate-400 text-xs truncate flex-1">{participantUrl}</span>
        <button
          onClick={copyUrl}
          className="shrink-0 text-xs font-medium px-3 py-1 rounded-lg transition-colors"
          style={{ background: copied ? '#166534' : 'var(--accent)', color: '#fff' }}
        >
          {copied ? '✓ コピー済み' : 'コピー'}
        </button>
      </div>

      {/* アクション */}
      <div className="flex gap-2">
        {!isExpired && (
          <>
            <a
              href={overlayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)' }}
            >
              ☄️ 弾幕を開く
            </a>
            <a
              href={`/dashboard/rooms/${room.id}/log`}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
              style={{ background: '#0f172a' }}
            >
              ログ
            </a>
            <button
              onClick={endRoom}
              disabled={ending}
              className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 transition-colors disabled:opacity-40"
              style={{ background: '#0f172a' }}
            >
              終了
            </button>
          </>
        )}
        {isExpired && (
          <a
            href={`/dashboard/rooms/${room.id}/log`}
            className="flex-1 text-center py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
            style={{ background: '#0f172a' }}
          >
            コメントログを見る
          </a>
        )}
      </div>
    </div>
  )
}
