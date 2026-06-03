import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import DanmakuLayer from '@/components/overlay/DanmakuLayer'
import StampPopper from '@/components/overlay/StampPopper'

export default async function OverlayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: room } = await supabase
    .from('rooms')
    .select('id, title, is_active, expires_at')
    .eq('slug', slug)
    .eq('host_id', user.id)
    .single()

  if (!room) notFound()

  const isExpired = !room.is_active || new Date(room.expires_at) < new Date()

  if (isExpired) {
    return (
      <div className="fixed inset-0 flex items-center justify-center text-center" style={{ background: '#000' }}>
        <div>
          <p className="text-6xl mb-4">🌌</p>
          <p className="text-white text-xl font-bold">このルームは終了しました</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0" style={{ background: '#000' }}>
      <DanmakuLayer roomId={room.id} />
      <StampPopper roomSlug={slug} />

      {/* 控えめなルーム名表示 */}
      <div className="absolute bottom-4 right-4 text-slate-600 text-xs pointer-events-none select-none">
        ☄️ {room.title}
      </div>
    </div>
  )
}
