import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm']

export async function POST(req: NextRequest) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      )
    }

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID requerido' },
        { status: 400 }
      )
    }

    // Validar tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de archivo no permitido: ${file.type}` },
        { status: 400 }
      )
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Archivo muy grande (máx 100MB)` },
        { status: 400 }
      )
    }

    // Simular almacenamiento (en producción usar Vercel Blob)
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const blobUrl = `https://blob.example.com/${fileId}/${file.name}`

    // Obtener duración si es video
    let duration: number | undefined
    if (file.type.startsWith('video')) {
      // En una app real, extraer duración del archivo
      duration = Math.random() * 30 * 1000 // 0-30 segundos
    }

    // Guardar en Supabase
    const { data: mediaAsset, error: dbError } = await supabase
      .from('media_assets')
      .insert([
        {
          project_id: projectId,
          blob_url: blobUrl,
          type: file.type.startsWith('image') ? 'image' : 'video',
          duration_ms: duration,
        },
      ])
      .select()

    if (dbError) {
      console.error('DB error:', dbError)
      throw new Error('Error al guardar en BD')
    }

    return NextResponse.json(
      {
        id: mediaAsset[0].id,
        url: blobUrl,
        type: file.type.startsWith('image') ? 'image' : 'video',
        name: file.name,
        size: file.size,
        duration,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al subir archivo' },
      { status: 500 }
    )
  }
}
