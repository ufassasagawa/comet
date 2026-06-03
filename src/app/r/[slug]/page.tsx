import { createClient } from '@/lib/supabase/server'
import CommentForm from '@/components/participant/CommentForm'
import StampPanel from '@/components/participant/StampPanel'

export default async function ParticipantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: room } = await supabase
    .from('rooms')
    .select('id, title, is_active, expires_at')
    .eq('slug', slug)
    .single()

  const isExpired = !room || !room.is_active || new Date(room.expires_at) < new Date()

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6" style={{ background: 'var(--bg-primary)' }}>
        <div>
          <p className="text-6xl mb-4">🌌</p>
          <h1 className="text-xl font-bold text-white mb-2">このルームは終了しました</h1>
          <p className="text-slate-400 text-sm">主催者に新しいURLを確認してください</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* ヘッダー */}
      <header className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #1e293b' }}>
        <span className="text-xl">☄️</span>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">{room.title}</p>
          <p className="text-slate-500 text-xs">Comet</p>
        </div>
        <span className="ml-auto px-2 py-1 rounded-full text-xs text-emerald-300" style={{ background: 'rgba(52,211,153,0.15)' }}>
          ● ライブ
        </span>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 px-5 py-6 flex flex-col gap-6 max-w-lg mx-auto w-full">
        <CommentForm roomId={room.id} />
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
          <StampPanel roomSlug={slug} />
        </div>
      </main>

      <footer className="text-center py-4 text-slate-600 text-xs">
        Powered by Comet ☄️
      </footer>
    </div>
  )
}
