import { NextRequest, NextResponse } from 'next/server'
import { getRender } from '@/lib/creatomate'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }
    const render = await getRender(id)
    return NextResponse.json({
      id: render.id,
      status: render.status,
      url: render.url,
      width: render.width,
      height: render.height,
      duration: render.duration,
      file_size: render.file_size,
      error_message: render.error_message,
    })
  } catch (error) {
    console.error('render-video GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed' },
      { status: 500 }
    )
  }
}
