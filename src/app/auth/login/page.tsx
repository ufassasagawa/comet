'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ALLOWED_DOMAIN } from '@/lib/constants'
import StarfieldBg from '@/components/landing/StarfieldBg'

export default function LoginPage() {
  const supabase = createClient()
  const [domainError, setDomainError] = useState(false)
  const [isApp, setIsApp] = useState(false)

  useEffect(() => {
    // ?error=domain: 社外アカウントでログインを試みた（callback で弾かれた）
    setDomainError(new URLSearchParams(location.search).get('error') === 'domain')
    // comet_app クッキー: デスクトップアプリから開いている（終了ボタンを出す）
    setIsApp(document.cookie.includes('comet_app=1'))
  }, [])

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: { hd: ALLOWED_DOMAIN }, // 社内アカウントを優先表示（強制は callback 側）
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      {/* 星空ドット背景 */}
      <StarfieldBg count={60} />

      <div className="relative z-10 text-center px-8">
        {/* ロゴ */}
        <div className="mb-8">
          <div className="text-7xl mb-4">☄️</div>
          <h1 className="text-5xl font-bold tracking-tight" style={{
            background: 'linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Comet
          </h1>
          <p className="mt-3 text-slate-400 text-lg">オンライン会議に弾幕を流そう</p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-3 mx-auto px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', color: '#fff' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google でログイン
        </button>

        <p className="mt-6 text-slate-500 text-sm">主催者（発表者）向けのログインです</p>

        {domainError && (
          <p className="mt-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-xl px-4 py-3">
            社内（{ALLOWED_DOMAIN}）の Google アカウントでログインしてください
          </p>
        )}

        {isApp && (
          <button
            onClick={() => { window.location.href = '/quit-app' }}
            className="mt-8 text-sm text-slate-500 hover:text-red-400 transition-colors"
          >
            アプリを終了
          </button>
        )}
      </div>
    </div>
  )
}
