export type StylePreset = 'apple' | 'openai' | 'neon' | 'saas' | 'minimal' | 'cyber'

export interface Project {
  id: string
  user_id: string
  title: string
  description?: string
  style: StylePreset
  status: 'draft' | 'rendering' | 'exported'
  data: Record<string, any>
  created_at: string
  updated_at: string
}
