import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import DanmakuLayer from '@/components/overlay/DanmakuLayer'
import StampPopper from '@/components/overlay/StampPopper'

export default async function OverlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ app?: string }>
}) {
  const { slug } = await params
  const { app } = await searchParams
  // Electron オーバーレイから開かれた場合は背景透明（PPT等の上に重ねるため）
  const bg = app === '1' ? 'transparent' : '#000'
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
      <div className="fixed inset-0 flex items-center justify-center text-center" style={{ background: bg }}>
        <div>
          <p className="text-6xl mb-4">🌌</p>
          <p className="text-white text-xl font-bold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>このルームは終了しました</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0" style={{ background: bg }}>
      <DanmakuLayer roomId={room.id} />
      <StampPopper roomSlug={slug} />

      {/* 控えめなルーム名表示 */}
      <div className="absolute bottom-4 right-4 text-slate-600 text-xs pointer-events-none select-none">
        ☄️ {room.title}
      </div>
    </div>
  )
}
