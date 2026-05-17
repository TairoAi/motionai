import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string

    if (!file || !projectId) {
      return NextResponse.json(
        { error: 'File and projectId are required' },
        { status: 400 }
      )
    }

    // For now, just simulate successful upload
    // In production, you would upload to Vercel Blob or S3
    const fileName = `${projectId}/${Date.now()}-${file.name}`
    const fileUrl = `https://example.com/uploads/${fileName}`

    console.log(`Upload received: ${file.name} (${file.size} bytes) for project ${projectId}`)

    return NextResponse.json({
      success: true,
      fileName,
      fileUrl,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
