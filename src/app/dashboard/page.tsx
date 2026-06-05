'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Room } from '@/types'
import RoomCard from '@/components/dashboard/RoomCard'
import CreateRoomModal from '@/components/dashboard/CreateRoomModal'

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<'active' | 'all'>('active')
  const supabase = createClient()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  async function loadRooms() {
    // 自分のルームだけ表示する（RLS の「アクティブなら誰でも読める」ポリシーで
    // 他人のルームも返ってくるため、host_id で明示的に絞る）
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('host_id', user.id)
      .order('created_at', { ascending: false })
    setRooms(data ?? [])
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    location.href = '/auth/login'
  }

  useEffect(() => {
    loadRooms()
  }, [])

  const filtered = filter === 'active'
    ? rooms.filter(r => r.is_active && new Date(r.expires_at) > new Date())
    : rooms

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1e293b' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">☄️</span>
          <span className="text-xl font-bold text-white">Comet</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => { window.location.href = '/quit-app' }}
            className="text-sm text-slate-500 hover:text-red-400 transition-colors"
          >
            アプリを終了
          </button>
          <button
            onClick={handleSignOut}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            ログアウト
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* タイトル + 作成ボタン */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">ルーム一覧</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white hover:opacity-90 transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)' }}
          >
            <span className="text-lg">＋</span> ルームを作る
          </button>
        </div>

        {/* フィルター */}
        <div className="flex gap-2 mb-6">
          {(['active', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: filter === f ? 'var(--accent)' : '#1e293b',
                color: filter === f ? '#fff' : '#94a3b8',
              }}
            >
              {f === 'active' ? '開催中' : 'すべて'}
            </button>
          ))}
        </div>

        {/* ルーム一覧 */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🌌</p>
            <p className="text-slate-400">
              {filter === 'active' ? '開催中のルームはありません' : 'ルームがありません'}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-sm underline decoration-dotted"
              style={{ color: 'var(--accent)' }}
            >
              最初のルームを作る
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                origin={origin}
                onUpdated={loadRooms}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <CreateRoomModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); loadRooms() }}
        />
      )}
    </div>
  )
}
