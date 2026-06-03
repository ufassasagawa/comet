import Link from 'next/link'

export default function QuitAppPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6" style={{ background: 'var(--bg-primary)' }}>
      <div>
        <p className="text-4xl mb-4">☄️</p>
        <p className="text-white font-semibold mb-2">Electron アプリでのみ使用できます</p>
        <Link href="/dashboard" className="text-sm underline decoration-dotted" style={{ color: 'var(--accent)' }}>
          ダッシュボードに戻る
        </Link>
      </div>
    </div>
  )
}
