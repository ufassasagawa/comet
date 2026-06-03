'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Message, COLOR_PALETTE } from '@/types'

const FIXED_LANES = 5         // 固定レーン数。上から順に 0〜4
const LANE_HEIGHT = 40        // px
const ANIM_DURATION = 8000    // コメントが右端から左端に抜けるまでの ms

type ActiveComment = Message & { lane: number; animKey: string }

type Props = { roomId: string }

export default function DanmakuLayer({ roomId }: Props) {
  const [comments, setComments] = useState<ActiveComment[]>([])
  // 各レーンが「空き」になる時刻（epoch ms）。0 = 最初から空き
  const laneAvailableAt = useRef<number[]>(Array(FIXED_LANES).fill(0))
  const queueRef = useRef<Message[]>([])
  const supabase = createClient()

  const colorMap = Object.fromEntries(COLOR_PALETTE.map(c => [c.name, c.value]))

  // 空きレーンを探す。上（インデックス小）から順にチェックし、最初の空きレーンを返す
  function findFreeLane(): number | null {
    const now = Date.now()
    for (let i = 0; i < FIXED_LANES; i++) {
      if (laneAvailableAt.current[i] <= now) return i
    }
    return null
  }

  // 次に空くレーンまでの待ち時間 (ms)
  function msUntilNextFree(): number {
    const now = Date.now()
    const soonest = Math.min(...laneAvailableAt.current)
    return Math.max(50, soonest - now + 50)
  }

  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) return

    const lane = findFreeLane()
    if (lane === null) {
      // 全レーン使用中 → 最短で空くタイミングに再試行
      setTimeout(processQueue, msUntilNextFree())
      return
    }

    const msg = queueRef.current.shift()!
    const animKey = `${msg.id}-${Date.now()}`

    // このレーンを ANIM_DURATION の間ロック（流れ切るまで再利用しない）
    laneAvailableAt.current[lane] = Date.now() + ANIM_DURATION

    setComments(prev => [...prev, { ...msg, lane, animKey }])

    // アニメーション完了後に DOM から削除
    setTimeout(() => {
      setComments(prev => prev.filter(c => c.animKey !== animKey))
    }, ANIM_DURATION + 500)

    // キューに残りがあれば続けて処理
    if (queueRef.current.length > 0) {
      setTimeout(processQueue, 80)
    }
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel(`danmaku:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
        (payload) => {
          queueRef.current.push(payload.new as Message)
          processQueue()
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomId, processQueue])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {comments.map(comment => (
        <div
          key={comment.animKey}
          className="absolute whitespace-nowrap font-bold select-none"
          style={{
            top: comment.lane * LANE_HEIGHT + 8,
            color: colorMap[comment.color] ?? '#ffffff',
            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 2px 8px rgba(0,0,0,0.8)',
            animation: `danmaku-slide ${ANIM_DURATION}ms linear forwards`,
            fontSize: '1.9rem',
            lineHeight: '36px',
          }}
        >
          {comment.nickname ? (
            <span style={{ fontSize: '0.85em', opacity: 0.75 }}>{comment.nickname}：</span>
          ) : null}
          {comment.content}
        </div>
      ))}
    </div>
  )
}
