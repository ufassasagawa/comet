import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { ALLOWED_DOMAIN } from '@/lib/constants'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    // 社内（ufas.co.jp）アカウント以外は弾く。hd パラメータは UI ヒントに過ぎないため、強制はここで行う
    const email = data?.user?.email
    if (!error && (!email || !email.endsWith(`@${ALLOWED_DOMAIN}`))) {
      await supabase.auth.signOut()
      return NextResponse.redirect(`${origin}/auth/login?error=domain`)
    }
  }

  // アプリ（comet_app クッキーあり）はダッシュボード、ブラウザは DL ページへ
  const isApp = request.cookies.has('comet_app')
  return NextResponse.redirect(`${origin}${isApp ? '/dashboard' : '/download'}`)
}
