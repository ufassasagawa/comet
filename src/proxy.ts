import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  // デスクトップアプリ（Electron）は起動時に comet_app クッキーをセットしてくる。
  // ブラウザにはこれが無いので、ランディング／DLページに出し分ける。
  const isApp = request.cookies.has('comet_app')

  // /dashboard・/overlay・/download は認証必須
  if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/overlay') || pathname === '/download')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // ルート: アプリは従来どおりリダイレクト、ブラウザはランディングを表示
  if (pathname === '/') {
    if (isApp) {
      const url = request.nextUrl.clone()
      url.pathname = user ? '/dashboard' : '/auth/login'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // ダッシュボード本体はアプリ専用（完全一致のみ。/dashboard/rooms/[id]/log はブラウザでも閲覧可）
  if (pathname === '/dashboard' && !isApp) {
    const url = request.nextUrl.clone()
    url.pathname = '/download'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/overlay/:path*', '/download'],
}
