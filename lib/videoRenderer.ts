import { STYLE_PRESETS } from './constants'
import type { StylePreset } from './types'

export type RenderableScene = {
  id: string
  type: string
  duration: number
  text?: string
  effect?: string
}

export type RenderInput = {
  scenes: RenderableScene[]
  mediaUrls: string[]
  style: StylePreset
  headline: string
  description: string
  onProgress?: (pct: number) => void
}

const WIDTH = 1280
const HEIGHT = 720
const FPS = 30

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url
  })
}

function pickRecorderMime(): string {
  const candidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ]
  for (const m of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) {
      return m
    }
  }
  return 'video/webm'
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  bg: string,
  accent: string
) {
  const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  grad.addColorStop(0, bg)
  grad.addColorStop(1, mix(bg, accent, 0.15))
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

function mix(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16)
  const ag = parseInt(a.slice(3, 5), 16)
  const ab = parseInt(a.slice(5, 7), 16)
  const br = parseInt(b.slice(1, 3), 16)
  const bg = parseInt(b.slice(3, 5), 16)
  const bb = parseInt(b.slice(5, 7), 16)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return `rgb(${r},${g},${bl})`
}

function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  size: number,
  color: string,
  fontFamily: string,
  yOffset = 0,
  weight = '700'
) {
  ctx.fillStyle = color
  ctx.font = `${weight} ${size}px ${fontFamily}, system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const maxWidth = WIDTH * 0.85
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)

  const lineHeight = size * 1.15
  const totalHeight = lineHeight * lines.length
  const startY = HEIGHT / 2 - totalHeight / 2 + lineHeight / 2 + yOffset

  lines.forEach((l, i) => {
    ctx.fillText(l, WIDTH / 2, startY + i * lineHeight)
  })
}

function drawMediaCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, zoom: number) {
  const canvasRatio = WIDTH / HEIGHT
  const imgRatio = img.width / img.height
  let dw: number, dh: number
  if (imgRatio > canvasRatio) {
    dh = HEIGHT * zoom
    dw = dh * imgRatio
  } else {
    dw = WIDTH * zoom
    dh = dw / imgRatio
  }
  const dx = (WIDTH - dw) / 2
  const dy = (HEIGHT - dh) / 2
  ctx.drawImage(img, dx, dy, dw, dh)
}

export async function renderVideoFromScenes(
  input: RenderInput
): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('renderVideoFromScenes must run in the browser')
  }
  if (!input.scenes.length) {
    throw new Error('No scenes to render')
  }

  const preset = STYLE_PRESETS[input.style] ?? STYLE_PRESETS.saas
  const { colors, typography } = preset

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  const images = await Promise.all(input.mediaUrls.map(loadImage))
  const validImages = images.filter((i): i is HTMLImageElement => !!i)

  const mime = pickRecorderMime()
  const stream = canvas.captureStream(FPS)
  const chunks: Blob[] = []
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 })
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data)
  }

  const done = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mime }))
    recorder.onerror = (e) => reject(e)
  })

  recorder.start()

  const totalDurationMs = input.scenes.reduce((acc, s) => acc + s.duration, 0)
  let elapsedMs = 0

  const drawScene = (scene: RenderableScene, sceneT: number, imgForBg: HTMLImageElement | null) => {
    drawBackground(ctx, colors.background, colors.accent)

    if (imgForBg && scene.type !== 'transition') {
      ctx.save()
      ctx.globalAlpha = scene.type === 'media' ? 1 : 0.35
      const zoom = 1 + sceneT * 0.08
      drawMediaCover(ctx, imgForBg, zoom)
      ctx.restore()

      if (scene.type !== 'media') {
        ctx.fillStyle = 'rgba(0,0,0,0.45)'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
      }
    }

    const fadeIn = easeOutCubic(Math.min(1, sceneT * 3))
    const fadeOut = easeOutCubic(Math.min(1, (1 - sceneT) * 3))
    const alpha = Math.min(fadeIn, fadeOut)

    ctx.save()
    ctx.globalAlpha = alpha

    if (scene.type === 'title') {
      const scale = 0.92 + easeOutCubic(Math.min(1, sceneT * 2)) * 0.08
      ctx.save()
      ctx.translate(WIDTH / 2, HEIGHT / 2)
      ctx.scale(scale, scale)
      ctx.translate(-WIDTH / 2, -HEIGHT / 2)
      drawCenteredText(
        ctx,
        scene.text || input.headline,
        typography.headlineSize,
        colors.primary,
        typography.fontFamily,
        -20,
        '800'
      )
      if (input.description) {
        drawCenteredText(
          ctx,
          input.description,
          typography.bodySize,
          colors.secondary,
          typography.fontFamily,
          typography.headlineSize * 0.8,
          '400'
        )
      }
      ctx.restore()
    } else if (scene.type === 'text') {
      drawCenteredText(
        ctx,
        scene.text || '',
        typography.bodySize * 1.6,
        colors.primary,
        typography.fontFamily,
        0,
        '600'
      )
    } else if (scene.type === 'media') {
      if (!imgForBg) {
        drawCenteredText(
          ctx,
          input.headline,
          typography.headlineSize,
          colors.primary,
          typography.fontFamily,
          0,
          '800'
        )
      }
    } else if (scene.type === 'transition') {
      ctx.fillStyle = colors.accent
      const barH = HEIGHT * easeInOutCubic(sceneT)
      ctx.fillRect(0, HEIGHT / 2 - barH / 2, WIDTH, barH)
    } else if (scene.type === 'effect') {
      const r = WIDTH * 0.6 * easeOutCubic(sceneT)
      const grd = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 0, WIDTH / 2, HEIGHT / 2, r)
      grd.addColorStop(0, colors.accent)
      grd.addColorStop(0.5, mix(colors.accent, colors.background, 0.6))
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
      drawCenteredText(
        ctx,
        scene.effect || '',
        typography.bodySize,
        colors.secondary,
        typography.fontFamily,
        0,
        '500'
      )
    }

    ctx.restore()
  }

  const startedAt = performance.now()

  await new Promise<void>((resolve) => {
    let sceneIdx = 0
    let sceneStartMs = 0

    const tick = () => {
      const now = performance.now()
      elapsedMs = now - startedAt

      while (sceneIdx < input.scenes.length && elapsedMs - sceneStartMs >= input.scenes[sceneIdx].duration) {
        sceneStartMs += input.scenes[sceneIdx].duration
        sceneIdx++
      }

      if (sceneIdx >= input.scenes.length) {
        resolve()
        return
      }

      const scene = input.scenes[sceneIdx]
      const sceneT = (elapsedMs - sceneStartMs) / scene.duration
      const imgForBg = validImages.length > 0 ? validImages[sceneIdx % validImages.length] : null

      drawScene(scene, sceneT, imgForBg)

      input.onProgress?.(Math.min(1, elapsedMs / totalDurationMs))
      requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  })

  recorder.stop()
  return done
}
