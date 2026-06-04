'use client'

import { useEffect, useState } from 'react'

type Star = { size: number; top: number; left: number; opacity: number }

// 星空ドット背景。乱数はサーバ/クライアントで食い違い hydration mismatch になるため、
// マウント後（client のみ）に生成する。
export default function StarfieldBg({ count = 80 }: { count?: number }) {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(
      Array.from({ length: count }, () => ({
        size: Math.random() > 0.8 ? 2 : 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.6 + 0.2,
      }))
    )
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: `${s.size}px`,
            height: `${s.size}px`,
            top: `${s.top}%`,
            left: `${s.left}%`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  )
}
