import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRemainingDays } from '@/lib/utils'
import { DRIVE_DMG_URL, DMG_FILENAME, DMG_SIZE_LABEL, INSTALL_MD_PATH } from '@/lib/constants'
import LogoutButton from '@/components/download/LogoutButton'
import type { Room } from '@/types'

// ブラウザでログインした主催者向けページ。
// アプリのダウンロードと、過去ルームのコメントログ閲覧（読み取り専用）のみ提供する。
// ルーム作成・弾幕はデスクトップアプリ専用（proxy.ts が /dashboard をここへ流してくる）。
export default async function DownloadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login') // proxy と二重ガード

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .eq('host_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="sticky top-0 z-20 border-b border-slate-800 backdrop-blur" style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-100">☄️ Comet</Link>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-12">
        {/* ダウンロード */}
        <section
          className="rounded-2xl p-8 border text-center"
          style={{ background: 'var(--bg-secondary)', borderColor: '#334155' }}
        >
          <div className="text-5xl mb-3">☄️</div>
          <h1 className="text-xl font-bold text-slate-100">Comet デスクトップアプリ</h1>
          <p className="mt-2 text-sm text-slate-400">
            {DMG_FILENAME}（Mac 専用・Apple Silicon / Intel 両対応・{DMG_SIZE_LABEL}）
          </p>
          <a
            href={DRIVE_DMG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', color: '#fff' }}
          >
            ⬇ ダウンロード（Google Drive）
          </a>
          <p className="mt-3 text-xs text-slate-500">
            社内限定共有のため、社の Google アカウントでのアクセスが必要です
          </p>

          <div className="mt-6 text-left text-sm text-slate-400 leading-relaxed border-t border-slate-700 pt-5">
            <p className="font-semibold text-slate-300 mb-2">インストール（初回だけ）</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>dmg をダブルクリックして開く</li>
              <li>☄️ Comet を「Applications」フォルダにドラッグ</li>
              <li>Comet をダブルクリック →「開けません」と出たら「OK」で閉じる</li>
              <li>
                <span className="text-slate-200">システム設定 → プライバシーとセキュリティ</span> を開き、下の
                <span className="text-slate-200">「"Comet" は…ブロックされました」→「このまま開く」</span> で許可（初回だけ）
              </li>
              <li>次回からは普通にダブルクリックでOK</li>
            </ol>
            <a href={INSTALL_MD_PATH} download className="inline-block mt-3 text-slate-500 hover:text-slate-300 underline transition-colors">
              詳しい説明書（INSTALL.md）をダウンロード
            </a>
          </div>
        </section>

        {/* コメントログ */}
        <section>
          <h2 className="text-lg font-bold text-slate-100 mb-1">コメントログ</h2>
          <p className="text-sm text-slate-500 mb-5">
            過去のルームに届いたコメントを見返せます。ルームの作成・弾幕表示はアプリから行ってください。
          </p>
          {!rooms || rooms.length === 0 ? (
            <p className="text-sm text-slate-600 rounded-2xl border border-slate-800 p-6 text-center">
              まだルームがありません。アプリでルームを作るとここに表示されます。
            </p>
          ) : (
            <ul className="space-y-3">
              {(rooms as Room[]).map(room => {
                const remaining = getRemainingDays(room.expires_at)
                return (
                  <li key={room.id}>
                    <Link
                      href={`/dashboard/rooms/${room.id}/log`}
                      className="flex items-center justify-between rounded-2xl p-4 border transition-colors hover:border-slate-500"
                      style={{ background: 'var(--bg-secondary)', borderColor: '#334155' }}
                    >
                      <div>
                        <p className="font-medium text-slate-100">{room.title}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(room.created_at).toLocaleDateString('ja-JP')} 作成
                          {remaining > 0 ? `・あと${remaining}日有効` : '・終了'}
                        </p>
                      </div>
                      <span className="text-slate-500 text-sm">ログを見る →</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
