import { createClient } from '@/lib/supabase/server'
import { COLOR_PALETTE } from '@/types'
import { formatTime } from '@/lib/utils'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: room } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .eq('host_id', user.id)
    .single()

  if (!room) notFound()

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', id)
    .order('created_at', { ascending: true })

  const colorMap = Object.fromEntries(COLOR_PALETTE.map(c => [c.name, c.value]))

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="sticky top-0 z-10 px-6 py-4 flex items-center gap-4" style={{ background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1e293b' }}>
        <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors text-sm">
          ← ダッシュボード
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">☄️</span>
          <span className="text-white font-semibold">{room.title}</span>
          <span className="text-slate-500">のコメントログ</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {!messages || messages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-slate-400">まだコメントはありません</p>
          </div>
        ) : (
          <>
            <p className="text-slate-500 text-sm mb-6">{messages.length} 件のコメント</p>
            <div className="flex flex-col gap-2">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  {/* 色インジケーター */}
                  <div
                    className="mt-1 w-3 h-3 rounded-full shrink-0"
                    style={{ background: colorMap[msg.color] ?? '#ffffff', border: '1px solid #334155' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-300">
                        {msg.nickname ?? '匿名'}
                      </span>
                      <span className="text-xs text-slate-500">{formatTime(msg.created_at)}</span>
                    </div>
                    <p className="text-white text-sm break-words">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
