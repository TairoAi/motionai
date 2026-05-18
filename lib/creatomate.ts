import { STYLE_PRESETS } from './constants'
import type { StylePreset } from './types'

export type RenderJobInput = {
  headline: string
  description: string
  cta?: string
  imageUrl?: string
  style: StylePreset
  aspect?: '16:9' | '9:16' | '1:1'
}

export type CreatomateRender = {
  id: string
  status: 'planned' | 'waiting' | 'transcribing' | 'rendering' | 'succeeded' | 'failed'
  url: string
  output_format?: string
  width?: number
  height?: number
  duration?: number
  file_size?: number
  error_message?: string
}

const CREATOMATE_BASE = 'https://api.creatomate.com/v1'

function dimensions(aspect: '16:9' | '9:16' | '1:1') {
  if (aspect === '9:16') return { w: 1080, h: 1920 }
  if (aspect === '1:1') return { w: 1080, h: 1080 }
  return { w: 1920, h: 1080 }
}

export function buildHeroPromoSource(input: RenderJobInput) {
  const preset = STYLE_PRESETS[input.style] ?? STYLE_PRESETS.saas
  const { colors } = preset
  const { w, h } = dimensions(input.aspect ?? '16:9')

  const headline = input.headline || 'Your idea'
  const description = input.description || ''
  const cta = input.cta || 'Empieza ahora'
  const hasImage = Boolean(input.imageUrl)

  const elements: any[] = [
    {
      type: 'shape',
      track: 1,
      width: '100%',
      height: '100%',
      path: 'M 0 0 L 100 0 L 100 100 L 0 100 Z',
      fill_color: colors.background,
    },
    {
      type: 'shape',
      track: 1,
      width: '160%',
      height: '160%',
      x: '50%',
      y: '50%',
      x_anchor: '50%',
      y_anchor: '50%',
      path: 'M 50 0 L 100 50 L 50 100 L 0 50 Z',
      fill_color: colors.accent,
      opacity: '14%',
      animations: [
        { time: 'start', duration: 12, type: 'rotate-slide', easing: 'linear', start_angle: '0deg', end_angle: '12deg' },
      ],
    },
    {
      type: 'text',
      track: 2,
      text: headline,
      x: '50%',
      y: '45%',
      x_anchor: '50%',
      y_anchor: '50%',
      font_family: 'Inter',
      font_weight: '800',
      font_size: '11vmin',
      fill_color: colors.primary,
      time: 0.3,
      duration: 3.5,
      animations: [
        { time: 'start', duration: 1.0, type: 'text-reveal', split: 'letter', easing: 'quadratic-out' },
        { time: 'end', duration: 0.5, type: 'fade', reversed: true },
      ],
    },
    ...(description
      ? [{
          type: 'text',
          track: 3,
          text: description,
          x: '50%',
          y: '62%',
          x_anchor: '50%',
          y_anchor: '50%',
          font_family: 'Inter',
          font_weight: '400',
          font_size: '3.5vmin',
          fill_color: colors.secondary,
          time: 1.2,
          duration: 2.6,
          animations: [
            { time: 'start', duration: 0.6, type: 'fade', easing: 'quadratic-out' },
            { time: 'start', duration: 0.6, type: 'slide', direction: 'up', distance: '6vmin', easing: 'quadratic-out' },
            { time: 'end', duration: 0.5, type: 'fade', reversed: true },
          ],
        }]
      : []),
    {
      type: 'shape',
      track: 1,
      width: '60vmin',
      height: '0.5vmin',
      x: '50%',
      y: '73%',
      x_anchor: '50%',
      y_anchor: '50%',
      path: 'M 0 0 L 100 0 L 100 100 L 0 100 Z',
      fill_color: colors.accent,
      time: 1.8,
      duration: 2.2,
      animations: [
        { time: 'start', duration: 0.8, type: 'scale', start_scale: '0%', end_scale: '100%', x_anchor: '0%', easing: 'quadratic-out' },
        { time: 'end', duration: 0.3, type: 'fade', reversed: true },
      ],
    },
    ...(hasImage
      ? [
          {
            type: 'image',
            track: 4,
            source: input.imageUrl,
            x: '50%',
            y: '50%',
            x_anchor: '50%',
            y_anchor: '50%',
            width: '100%',
            height: '100%',
            fit: 'cover',
            time: 4.2,
            duration: 4.0,
            animations: [
              { time: 'start', duration: 0.7, type: 'fade' },
              { time: 'start', duration: 4.0, type: 'scale', start_scale: '105%', end_scale: '120%', easing: 'linear' },
              { time: 'end', duration: 0.7, type: 'fade', reversed: true },
            ],
          },
          {
            type: 'shape',
            track: 5,
            x: '50%',
            y: '50%',
            x_anchor: '50%',
            y_anchor: '50%',
            width: '100%',
            height: '50%',
            path: 'M 0 0 L 100 0 L 100 100 L 0 100 Z',
            fill_color: 'rgba(0,0,0,0.65)',
            y_offset: '50%',
            time: 4.4,
            duration: 3.8,
            animations: [
              { time: 'start', duration: 0.6, type: 'fade' },
              { time: 'end', duration: 0.6, type: 'fade', reversed: true },
            ],
          },
          {
            type: 'text',
            track: 6,
            text: description || headline,
            x: '50%',
            y: '82%',
            x_anchor: '50%',
            y_anchor: '50%',
            font_family: 'Inter',
            font_weight: '700',
            font_size: '4.2vmin',
            fill_color: '#ffffff',
            time: 4.7,
            duration: 3.4,
            animations: [
              { time: 'start', duration: 0.6, type: 'slide', direction: 'up', distance: '8vmin', easing: 'quadratic-out' },
              { time: 'start', duration: 0.6, type: 'fade' },
              { time: 'end', duration: 0.4, type: 'fade', reversed: true },
            ],
          },
        ]
      : []),
    {
      type: 'text',
      track: 2,
      text: cta,
      x: '50%',
      y: '50%',
      x_anchor: '50%',
      y_anchor: '50%',
      font_family: 'Inter',
      font_weight: '800',
      font_size: '10vmin',
      fill_color: colors.accent,
      time: 8.6,
      duration: 3.4,
      animations: [
        { time: 'start', duration: 0.7, type: 'text-scale', easing: 'elastic-out' },
        { time: 'start', duration: 0.4, type: 'fade' },
      ],
    },
  ]

  return {
    output_format: 'mp4',
    width: w,
    height: h,
    frame_rate: 30,
    duration: 12,
    elements,
  }
}

export async function startRender(input: RenderJobInput): Promise<CreatomateRender> {
  const key = process.env.CREATOMATE_API_KEY
  if (!key) throw new Error('CREATOMATE_API_KEY not set')

  const source = buildHeroPromoSource(input)
  const res = await fetch(`${CREATOMATE_BASE}/renders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ source }),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Creatomate error: ${res.status} ${txt}`)
  }
  const data = await res.json()
  if (!Array.isArray(data) || !data[0]) throw new Error('Unexpected response')
  return data[0] as CreatomateRender
}

export async function getRender(id: string): Promise<CreatomateRender> {
  const key = process.env.CREATOMATE_API_KEY
  if (!key) throw new Error('CREATOMATE_API_KEY not set')

  const res = await fetch(`${CREATOMATE_BASE}/renders/${id}`, {
    headers: { Authorization: `Bearer ${key}` },
  })
  if (!res.ok) throw new Error(`Creatomate error: ${res.status}`)
  return res.json()
}
