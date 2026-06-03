'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateSlug } from '@/lib/utils'

type Props = {
  onClose: () => void
  onCreated: () => void
}

export default function CreateRoomModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleCreate() {
    if (!title.trim()) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const slug = generateSlug()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    await supabase.from('rooms').insert({
      host_id: user.id,
      slug,
      title: title.trim(),
      expires_at: expiresAt,
    })

    setLoading(false)
    onCreated()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: 'var(--bg-secondary)' }}>
        <h2 className="text-xl font-bold text-white mb-6">新しいルームを作る</h2>

        <label className="block text-sm text-slate-400 mb-2">イベント名</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          placeholder="例：6月全社会議"
          className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2"
          style={{ background: '#0f172a', border: '1px solid #334155', '--tw-ring-color': 'var(--accent)' } as React.CSSProperties}
          autoFocus
        />

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-slate-400 font-semibold hover:text-white transition-colors"
            style={{ background: '#0f172a' }}
          >
            キャンセル
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim() || loading}
            className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)' }}
          >
            {loading ? '作成中…' : '作成する'}
          </button>
        </div>
      </div>
    </div>
  )
}
