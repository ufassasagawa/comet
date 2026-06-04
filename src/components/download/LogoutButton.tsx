'use client'

import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <button onClick={logout} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
      ログアウト
    </button>
  )
}
