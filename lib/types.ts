export type StylePreset = 'apple' | 'openai' | 'neon' | 'saas' | 'minimal' | 'cyber'

export type Style = string

export type Scene = {
  id: string
  type: string
  duration: number
  text?: string
  effects?: string[]
}

export type Template = {
  id: string
  name: string
  style: string
  data: any
  isPublic: boolean
  downloads: number
}

export type Project = {
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

export type Export = {
  id: string
  projectId: string
  format: string
  status: string
  videoUrl?: string
  createdAt: string
  progress?: number
  errorMessage?: string
}

export type Media = {
  id: string
  url: string
  type: string
  size: number
  duration?: number
}
