import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const projectId = formData.get('projectId') as string | null

    if (!file || !projectId) {
      return NextResponse.json(
        { error: 'File and projectId are required' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Only image/* and video/* are allowed' },
        { status: 415 }
      )
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File exceeds ${MAX_BYTES / 1024 / 1024} MB` },
        { status: 413 }
      )
    }

    const token = process.env.BLOB_WRITE_TOKEN
    if (!token) {
      return NextResponse.json(
        { error: 'BLOB_WRITE_TOKEN not configured' },
        { status: 500 }
      )
    }

    const safeName = file.name.replace(/[^\w.\-]/g, '_')
    const path = `${projectId}/${Date.now()}-${safeName}`

    const blob = await put(path, file, {
      access: 'public',
      token,
      contentType: file.type,
    })

    return NextResponse.json({
      success: true,
      fileName: path,
      fileUrl: blob.url,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
