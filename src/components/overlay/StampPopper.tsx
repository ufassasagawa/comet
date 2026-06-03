'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StampBroadcast } from '@/types'

const ANIM_DURATION = 1800 // ms

type ActiveStamp = StampBroadcast & { x: number }

type Props = {
  roomSlug: string
}

export default function StampPopper({ roomSlug }: Props) {
  const [stamps, setStamps] = useState<ActiveStamp[]>([])
  const supabase = createClient()

  useEffect(() => {
    let channel = supabase
      .channel(`room:${roomSlug}`)
      .on('broadcast', { event: 'stamp' }, ({ payload }: { payload: StampBroadcast }) => {
        const x = 10 + Math.random() * 80
        const id = `${payload.id}-${Date.now()}`
        setStamps(prev => [...prev, { ...payload, id, x }])
        setTimeout(() => {
          setStamps(prev => prev.filter(s => s.id !== id))
        }, ANIM_DURATION + 200)
      })
      .subscribe()

    function onHide() {
      supabase.removeChannel(channel)
      setStamps([])
    }
    function onShow() {
      channel = supabase
        .channel(`room:${roomSlug}`)
        .on('broadcast', { event: 'stamp' }, ({ payload }: { payload: StampBroadcast }) => {
          const x = 10 + Math.random() * 80
          const id = `${payload.id}-${Date.now()}`
          setStamps(prev => [...prev, { ...payload, id, x }])
          setTimeout(() => {
            setStamps(prev => prev.filter(s => s.id !== id))
          }, ANIM_DURATION + 200)
        })
        .subscribe()
    }

    document.addEventListener('comet-overlay-hide', onHide)
    document.addEventListener('comet-overlay-show', onShow)

    return () => {
      supabase.removeChannel(channel)
      document.removeEventListener('comet-overlay-hide', onHide)
      document.removeEventListener('comet-overlay-show', onShow)
    }
  }, [roomSlug])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stamps.map(stamp => (
        <div
          key={stamp.id}
          className="absolute text-5xl select-none"
          style={{
            bottom: '10%',
            left: `${stamp.x}%`,
            animation: `stamp-pop ${ANIM_DURATION}ms ease-out forwards`,
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))',
          }}
        >
          {stamp.emoji}
        </div>
      ))}
    </div>
  )
}
