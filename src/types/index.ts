export type Room = {
  id: string
  host_id: string
  slug: string
  title: string
  is_active: boolean
  expires_at: string
  created_at: string
}

export type Message = {
  id: string
  room_id: string
  content: string
  color: string
  nickname: string | null
  created_at: string
}

export type StampBroadcast = {
  emoji: string
  id: string
}

export const STAMP_EMOJIS = ['❤️', '👍', '🎉', '👏', '😂', '😮', '😢', '🤔'] as const

export const COLOR_PALETTE: { name: string; value: string }[] = [
  { name: 'white',  value: '#ffffff' },
  { name: 'red',    value: '#ff4444' },
  { name: 'blue',   value: '#4499ff' },
  { name: 'green',  value: '#44cc44' },
  { name: 'orange', value: '#ff8800' },
  { name: 'purple', value: '#cc44ff' },
]
