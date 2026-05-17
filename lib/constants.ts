import type { StylePreset } from './types'

export const STYLE_PRESETS: Record<StylePreset, {
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  typography: {
    headlineSize: number
    bodySize: number
    fontFamily: string
  }
  effects: string[]
  soundProfile: string
}> = {
  apple: {
    name: 'Apple Style',
    description: 'Minimal, clean, premium. Like Apple keynotes.',
    colors: {
      primary: '#ffffff',
      secondary: '#f5f5f5',
      accent: '#0071e3',
      background: '#000000',
    },
    typography: {
      headlineSize: 64,
      bodySize: 24,
      fontFamily: 'Inter',
    },
    effects: ['motionBlur', 'zoom', 'particles'],
    soundProfile: 'subtle',
  },
  openai: {
    name: 'OpenAI Style',
    description: 'Bold, vibrant, cutting-edge. Like ChatGPT marketing.',
    colors: {
      primary: '#00ff88',
      secondary: '#00d4ff',
      accent: '#b500ff',
      background: '#0f0f0f',
    },
    typography: {
      headlineSize: 72,
      bodySize: 28,
      fontFamily: 'Inter',
    },
    effects: ['glow', 'parallax', 'motionBlur'],
    soundProfile: 'futuristic',
  },
  neon: {
    name: 'Futuristic Neon',
    description: 'Cyberpunk vibes. Bright neon on dark backgrounds.',
    colors: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: '#0a0a0a',
    },
    typography: {
      headlineSize: 80,
      bodySize: 26,
      fontFamily: 'Courier New',
    },
    effects: ['glow', 'particles', 'motionBlur'],
    soundProfile: 'neon',
  },
  saas: {
    name: 'SaaS Promo',
    description: 'Professional, business-focused. Perfect for B2B.',
    colors: {
      primary: '#4f46e5',
      secondary: '#6366f1',
      accent: '#10b981',
      background: '#1f2937',
    },
    typography: {
      headlineSize: 56,
      bodySize: 20,
      fontFamily: 'Inter',
    },
    effects: ['zoom', 'parallax'],
    soundProfile: 'corporate',
  },
  minimal: {
    name: 'Minimal Tech',
    description: 'Subtle, elegant, focus on content.',
    colors: {
      primary: '#ffffff',
      secondary: '#e5e7eb',
      accent: '#9333ea',
      background: '#1a1a1a',
    },
    typography: {
      headlineSize: 52,
      bodySize: 18,
      fontFamily: 'Inter',
    },
    effects: ['zoom'],
    soundProfile: 'ambient',
  },
  cyber: {
    name: 'Cyber Glow',
    description: 'High-tech, energetic, maximum impact.',
    colors: {
      primary: '#00ff41',
      secondary: '#ff0080',
      accent: '#00d9ff',
      background: '#050505',
    },
    typography: {
      headlineSize: 76,
      bodySize: 28,
      fontFamily: 'Courier New',
    },
    effects: ['glow', 'particles', 'motionBlur', 'parallax'],
    soundProfile: 'intense',
  },
}

export const SOUND_EFFECTS = {
  whoosh: { duration: 0.4, intensity: 0.7 },
  click: { duration: 0.15, intensity: 0.5 },
  typing: { duration: 0.1, intensity: 0.3 },
  impact: { duration: 0.3, intensity: 0.8 },
}

export const VIDEO_FORMATS = {
  mp4_1080p: { name: 'Full HD (1080p)', resolution: '1920x1080', aspectRatio: '16:9' },
  vertical_reels: { name: 'Instagram Reels', resolution: '1080x1920', aspectRatio: '9:16' },
  youtube: { name: 'YouTube', resolution: '1280x720', aspectRatio: '16:9' },
  square: { name: 'Square (TikTok)', resolution: '1080x1080', aspectRatio: '1:1' },
}

export const MAX_FILE_SIZE = 100 * 1024 * 1024
export const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm']
export const MAX_PROJECT_DURATION = 300
