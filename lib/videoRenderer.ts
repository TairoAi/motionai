import { STYLE_PRESETS } from './constants'
import type { StylePreset } from './types'
import { SfxEngine } from './soundDesign'

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

const WIDTH = 1920
const HEIGHT = 1080
const FPS = 60

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
const easeOutExpo = (t: number) =>
  t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
const easeOutBack = (t: number) => {
  const c1 = 1.70158, c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
const spring = (t: number, damping = 8, stiffness = 100) => {
  if (t <= 0) return 0
  if (t >= 1) return 1
  const w = Math.sqrt(stiffness)
  const z = damping / (2 * w)
  if (z < 1) {
    const wd = w * Math.sqrt(1 - z * z)
    return 1 - Math.exp(-z * w * t) * Math.cos(wd * t)
  }
  return 1 - Math.exp(-w * t) * (1 + w * t)
}

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
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ]
  for (const m of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) {
      return m
    }
  }
  return 'video/webm'
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

type Particle = {
  x: number; y: number
  vx: number; vy: number
  size: number
  alpha: number
  hue: number
}

function makeParticles(count: number): Particle[] {
  const out: Particle[] = []
  for (let i = 0; i < count; i++) {
    out.push({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.6,
      size: 1 + Math.random() * 2.5,
      alpha: 0.15 + Math.random() * 0.55,
      hue: Math.random() * 60,
    })
  }
  return out
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], color: string, dtMs: number) {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (const p of particles) {
    p.x += p.vx * (dtMs / 16)
    p.y += p.vy * (dtMs / 16)
    if (p.y < -10) { p.y = HEIGHT + 10; p.x = Math.random() * WIDTH }
    if (p.x < -10) p.x = WIDTH + 10
    if (p.x > WIDTH + 10) p.x = -10

    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8)
    grd.addColorStop(0, color)
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.globalAlpha = p.alpha
    ctx.fillStyle = grd
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function drawAmbientGlow(ctx: CanvasRenderingContext2D, color: string, intensity: number) {
  const grd = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.55, 0, WIDTH / 2, HEIGHT * 0.55, WIDTH * 0.55)
  grd.addColorStop(0, color)
  grd.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.save()
  ctx.globalAlpha = intensity
  ctx.globalCompositeOperation = 'lighter'
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.restore()
}

function drawBackground(ctx: CanvasRenderingContext2D, bg: string, accent: string, t: number) {
  const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  const shift = 0.12 + Math.sin(t * 0.6) * 0.05
  grad.addColorStop(0, bg)
  grad.addColorStop(1, mix(bg, accent, shift))
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

type Line = { text: string; width: number }

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): Line[] {
  const words = text.split(' ')
  const lines: Line[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push({ text: line, width: ctx.measureText(line).width })
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push({ text: line, width: ctx.measureText(line).width })
  return lines
}

function drawHero(
  ctx: CanvasRenderingContext2D,
  text: string,
  size: number,
  color: string,
  fontFamily: string,
  yOffset: number,
  weight: string,
  glowColor: string,
  visibleChars: number = Infinity
) {
  ctx.font = `${weight} ${size}px "${fontFamily}", "Inter Display", "Inter", system-ui, -apple-system, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const maxWidth = WIDTH * 0.82
  const lines = wrapText(ctx, text, maxWidth)
  const lineHeight = size * 1.1
  const totalHeight = lineHeight * lines.length
  const startY = HEIGHT / 2 - totalHeight / 2 + lineHeight / 2 + yOffset

  let charsShown = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let drawText = line.text
    const remaining = visibleChars - charsShown
    if (remaining < line.text.length) {
      drawText = line.text.slice(0, Math.max(0, remaining))
    }
    charsShown += line.text.length + 1
    if (!drawText) continue

    const x = WIDTH / 2
    const y = startY + i * lineHeight

    ctx.save()
    ctx.shadowColor = glowColor
    ctx.shadowBlur = size * 0.6
    ctx.fillStyle = color
    ctx.fillText(drawText, x, y)
    ctx.shadowBlur = size * 0.3
    ctx.fillText(drawText, x, y)
    ctx.restore()

    ctx.fillStyle = color
    ctx.fillText(drawText, x, y)

    if (remaining < line.text.length && remaining > 0) {
      const drawnWidth = ctx.measureText(drawText).width
      const caretX = x - line.width / 2 + drawnWidth
      ctx.save()
      ctx.fillStyle = color
      ctx.globalAlpha = 0.75
      ctx.fillRect(caretX + 4, y - size * 0.45, Math.max(2, size * 0.05), size * 0.9)
      ctx.restore()
    }
  }
}

function drawMediaCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, zoom: number, panX: number, panY: number) {
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
  const dx = (WIDTH - dw) / 2 + panX
  const dy = (HEIGHT - dh) / 2 + panY
  ctx.drawImage(img, dx, dy, dw, dh)
}

function drawVignette(ctx: CanvasRenderingContext2D, intensity: number) {
  const grd = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, WIDTH * 0.3, WIDTH / 2, HEIGHT / 2, WIDTH * 0.75)
  grd.addColorStop(0, 'rgba(0,0,0,0)')
  grd.addColorStop(1, `rgba(0,0,0,${intensity})`)
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

function drawAccentBar(ctx: CanvasRenderingContext2D, color: string, t: number) {
  const w = WIDTH * easeOutExpo(t)
  ctx.save()
  ctx.fillStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 40
  ctx.fillRect(WIDTH / 2 - w / 2, HEIGHT * 0.85, w, 6)
  ctx.restore()
}

export async function renderVideoFromScenes(input: RenderInput): Promise<Blob> {
  if (typeof window === 'undefined') throw new Error('Browser-only')
  if (!input.scenes.length) throw new Error('No scenes to render')

  const preset = STYLE_PRESETS[input.style] ?? STYLE_PRESETS.saas
  const { colors, typography } = preset

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d', { alpha: false })
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  const images = await Promise.all(input.mediaUrls.map(loadImage))
  const validImages = images.filter((i): i is HTMLImageElement => !!i)

  const sfx = new SfxEngine()
  await sfx.resume()

  const videoStream = canvas.captureStream(FPS)
  videoStream.addTrack(sfx.audioTrack)

  const mime = pickRecorderMime()
  const chunks: Blob[] = []
  const recorder = new MediaRecorder(videoStream, { mimeType: mime, videoBitsPerSecond: 8_000_000, audioBitsPerSecond: 192_000 })
  recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data) }

  const done = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mime }))
    recorder.onerror = (e) => reject(e)
  })

  recorder.start(100)

  const particles = makeParticles(60)
  const totalDurationMs = input.scenes.reduce((acc, s) => acc + s.duration, 0)

  const sceneStartTimes: number[] = []
  let acc = 0
  for (const s of input.scenes) { sceneStartTimes.push(acc); acc += s.duration }

  for (let i = 0; i < input.scenes.length; i++) {
    const scene = input.scenes[i]
    const startSec = sceneStartTimes[i] / 1000
    if (scene.type === 'title') {
      sfx.play('impact', startSec + 0.05)
      sfx.play('whoosh', startSec)
      sfx.play('glow', startSec + 0.1)
    } else if (scene.type === 'transition') {
      sfx.play('whoosh', startSec)
    } else if (scene.type === 'text') {
      const text = scene.text || ''
      const dur = scene.duration / 1000
      const typeWindow = dur * 0.7
      const perChar = Math.min(0.05, typeWindow / Math.max(1, text.length))
      for (let c = 0; c < text.length; c++) {
        if (text[c] !== ' ') sfx.play('tick', startSec + c * perChar)
      }
    } else if (scene.type === 'media') {
      sfx.play('pop', startSec)
    } else if (scene.type === 'effect') {
      sfx.play('glow', startSec)
      sfx.play('click', startSec + 0.3)
    }
  }

  await new Promise<void>((resolve) => {
    const t0 = performance.now()
    let lastFrame = t0
    let sceneIdx = 0
    let sceneStartMs = 0

    const tick = () => {
      const now = performance.now()
      const elapsedMs = now - t0
      const dtMs = now - lastFrame
      lastFrame = now

      while (sceneIdx < input.scenes.length && elapsedMs - sceneStartMs >= input.scenes[sceneIdx].duration) {
        sceneStartMs += input.scenes[sceneIdx].duration
        sceneIdx++
      }

      if (sceneIdx >= input.scenes.length) { resolve(); return }

      const scene = input.scenes[sceneIdx]
      const sceneT = (elapsedMs - sceneStartMs) / scene.duration
      const imgForBg = validImages.length > 0 ? validImages[sceneIdx % validImages.length] : null

      drawBackground(ctx, colors.background, colors.accent, elapsedMs / 1000)

      if (imgForBg && scene.type !== 'transition') {
        ctx.save()
        ctx.globalAlpha = scene.type === 'media' ? 1 : 0.45
        const zoom = 1.05 + easeInOutCubic(sceneT) * 0.12
        const panX = (sceneT - 0.5) * 60
        const panY = Math.sin(elapsedMs / 2000) * 12
        drawMediaCover(ctx, imgForBg, zoom, panX, panY)
        ctx.restore()
        if (scene.type !== 'media') {
          const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT)
          grad.addColorStop(0, 'rgba(0,0,0,0.55)')
          grad.addColorStop(1, 'rgba(0,0,0,0.75)')
          ctx.fillStyle = grad
          ctx.fillRect(0, 0, WIDTH, HEIGHT)
        }
      }

      drawAmbientGlow(ctx, colors.accent, 0.18)
      drawParticles(ctx, particles, colors.primary, dtMs)

      if (scene.type === 'title') {
        const springT = spring(sceneT, 14, 130)
        const yOffset = (1 - springT) * 60
        const scale = 0.94 + spring(sceneT, 12, 110) * 0.06
        const alphaIn = easeOutExpo(Math.min(1, sceneT * 2.5))
        const alphaOut = easeOutExpo(Math.min(1, (1 - sceneT) * 4))
        const alpha = Math.min(alphaIn, alphaOut)

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(WIDTH / 2, HEIGHT / 2)
        ctx.scale(scale, scale)
        ctx.translate(-WIDTH / 2, -HEIGHT / 2)

        drawHero(ctx, scene.text || input.headline, typography.headlineSize * 1.5, colors.primary, typography.fontFamily, -30 + yOffset, '800', colors.accent)

        if (input.description) {
          ctx.globalAlpha = alpha * easeOutExpo(Math.max(0, (sceneT - 0.25) * 2))
          drawHero(ctx, input.description, typography.bodySize * 1.4, colors.secondary, typography.fontFamily, typography.headlineSize * 1.2, '500', colors.accent)
        }
        ctx.restore()

        drawAccentBar(ctx, colors.accent, Math.min(1, easeOutExpo(sceneT * 1.8)))
      }

      else if (scene.type === 'text') {
        const text = scene.text || ''
        const typeProgress = Math.min(1, sceneT / 0.7)
        const visibleChars = Math.floor(text.length * easeInOutCubic(typeProgress))
        const fadeOut = sceneT > 0.85 ? easeOutExpo(Math.min(1, (1 - sceneT) * 6)) : 1

        ctx.save()
        ctx.globalAlpha = fadeOut
        drawHero(ctx, text, typography.bodySize * 2.4, colors.primary, typography.fontFamily, 0, '600', colors.accent, visibleChars)
        ctx.restore()
      }

      else if (scene.type === 'media') {
        if (!imgForBg) {
          drawHero(ctx, input.headline, typography.headlineSize, colors.primary, typography.fontFamily, 0, '800', colors.accent)
        }
        const overlay = easeOutExpo(Math.max(0, (sceneT - 0.7) * 4))
        ctx.save()
        ctx.globalAlpha = overlay * 0.85
        const grad = ctx.createLinearGradient(0, HEIGHT * 0.6, 0, HEIGHT)
        grad.addColorStop(0, 'rgba(0,0,0,0)')
        grad.addColorStop(1, 'rgba(0,0,0,0.85)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
        ctx.restore()
      }

      else if (scene.type === 'transition') {
        const t = easeInOutCubic(sceneT)
        const w = WIDTH * t
        ctx.save()
        ctx.fillStyle = colors.accent
        ctx.shadowColor = colors.accent
        ctx.shadowBlur = 80
        ctx.fillRect(WIDTH / 2 - w / 2, HEIGHT / 2 - 8, w, 16)
        ctx.restore()
      }

      else if (scene.type === 'effect') {
        const r = WIDTH * 0.7 * easeOutExpo(sceneT)
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        const grd = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 0, WIDTH / 2, HEIGHT / 2, r)
        grd.addColorStop(0, colors.accent)
        grd.addColorStop(0.4, mix(colors.accent, colors.background, 0.5))
        grd.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
        ctx.restore()
        drawHero(ctx, scene.effect || '', typography.bodySize * 1.5, colors.secondary, typography.fontFamily, 0, '500', colors.accent)
      }

      drawVignette(ctx, 0.45)

      input.onProgress?.(Math.min(1, elapsedMs / totalDurationMs))
      requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  })

  recorder.stop()
  const blob = await done
  await sfx.close()
  return blob
}
