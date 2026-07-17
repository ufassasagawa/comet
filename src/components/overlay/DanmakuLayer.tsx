'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CommentBroadcast, COLOR_PALETTE } from '@/types'

const FIXED_LANES = 12        // 固定レーン数。上から順に 0〜11（画面をほぼ全面活用＝レーン不足を防ぐ）
const LANE_VH = 8             // 1レーンの高さ = 画面高の8% → 12レーンで約96%（2+12×8=98vh）（ディスプレイ相対）
const TOP_OFFSET_VH = 2       // 最上段の上マージン（メニューバー回避）
const ANIM_DURATION = 8000    // コメントが右端から左端に抜けるまでの ms

type ActiveComment = CommentBroadcast & { lane: number; animKey: string }

type Props = { roomSlug: string }

export default function DanmakuLayer({ roomSlug }: Props) {
  const [comments, setComments] = useState<ActiveComment[]>([])
  // 各レーンが「空き」になる時刻（epoch ms）。0 = 最初から空き
  const laneAvailableAt = useRef<number[]>(Array(FIXED_LANES).fill(0))
  const queueRef = useRef<CommentBroadcast[]>([])
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
    // スタンプとは別 topic（`room:${slug}`）にする。同一 topic だと realtime-js が同一
    // channel インスタンスを返し、DanmakuLayer と StampPopper の subscribe/removeChannel が競合するため
    function openChannel() {
      return supabase
        .channel(`danmaku:${roomSlug}`)
        .on('broadcast', { event: 'comment' }, ({ payload }) => {
          if (!payload) return // 生の送信で payload 欠落の可能性（悪意 or バグ）に備える
          const p = payload as CommentBroadcast
          queueRef.current.push({
            ...p,
            content: String(p.content ?? '').slice(0, 40),          // DBのCHECK制約を経由しないため受信側でクランプ
            nickname: p.nickname ? String(p.nickname).slice(0, 20) : null,
          })
          processQueue()
        })
        .subscribe((status, err) => {
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('[comet] danmaku channel error:', status, err)
          }
        })
    }

    let channel = openChannel()

    // Electron から非表示イベントが来たら切断してリソース解放
    function onHide() {
      supabase.removeChannel(channel)
      setComments([])
      queueRef.current = []
    }
    // 再表示イベントが来たら再接続
    function onShow() {
      channel = openChannel()
    }

    document.addEventListener('comet-overlay-hide', onHide)
    document.addEventListener('comet-overlay-show', onShow)

    return () => {
      supabase.removeChannel(channel)
      document.removeEventListener('comet-overlay-hide', onHide)
      document.removeEventListener('comet-overlay-show', onShow)
    }
  }, [roomSlug, processQueue])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {comments.map(comment => (
        <div
          key={comment.animKey}
          className="absolute whitespace-nowrap font-bold select-none"
          style={{
            top: `${TOP_OFFSET_VH + comment.lane * LANE_VH}vh`,
            color: colorMap[comment.color] ?? '#ffffff',
            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 2px 8px rgba(0,0,0,0.8)',
            animation: `danmaku-slide ${ANIM_DURATION}ms linear forwards`,
            fontSize: '6vh',
            lineHeight: `${LANE_VH}vh`,
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
