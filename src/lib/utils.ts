import { customAlphabet } from 'nanoid'

// 読みやすく推測されにくい slug（10文字）
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10)

export function generateSlug(): string {
  return nanoid()
}

export function getRemainingDays(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
