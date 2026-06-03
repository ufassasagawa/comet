import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Comet ☄️',
  description: 'オンライン会議を盛り上げるリアルタイム弾幕ツール',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}
