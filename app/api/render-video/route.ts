import { NextRequest, NextResponse } from 'next/server'
import { startRender } from '@/lib/creatomate'
import type { StylePreset } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { headline, description, cta, imageUrl, style, aspect } = body as {
      headline?: string
      description?: string
      cta?: string
      imageUrl?: string
      style?: StylePreset
      aspect?: '16:9' | '9:16' | '1:1'
    }

    if (!headline || !style) {
      return NextResponse.json(
        { error: 'headline and style are required' },
        { status: 400 }
      )
    }

    const render = await startRender({
      headline,
      description: description ?? '',
      cta,
      imageUrl,
      style,
      aspect: aspect ?? '16:9',
    })

    return NextResponse.json({
      id: render.id,
      status: render.status,
      url: render.url,
    })
  } catch (error) {
    console.error('render-video POST error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Render failed' },
      { status: 500 }
    )
  }
}
