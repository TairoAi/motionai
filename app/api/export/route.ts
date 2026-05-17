import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { projectId, format } = body

    if (!projectId || !format) {
      return NextResponse.json(
        { error: 'projectId y format requeridos' },
        { status: 400 }
      )
    }

    // Validar que el proyecto pertenece al usuario
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    // Crear registro de exportación
    const { data: exportRecord, error: exportError } = await supabase
      .from('exports')
      .insert({
        project_id: projectId,
        user_id: user.id,
        format,
        status: 'queued',
        progress: 0,
      })
      .select()
      .single()

    if (exportError) {
      throw exportError
    }

    // Aquí es donde se encolaría el trabajo en Vercel Queues
    // Para MVP, simulamos el procesamiento
    // En producción:
    // await queue.enqueue({
    //   type: 'render-video',
    //   payload: { exportId: exportRecord.id, projectId, format }
    // })

    // Simular que comienza a procesar después de 1 segundo
    setTimeout(async () => {
      await supabase
        .from('exports')
        .update({ status: 'processing', progress: 10 })
        .eq('id', exportRecord.id)
    }, 1000)

    return NextResponse.json(
      {
        export: {
          id: exportRecord.id,
          projectId: exportRecord.project_id,
          format: exportRecord.format,
          status: exportRecord.status,
          progress: exportRecord.progress,
          createdAt: exportRecord.created_at,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al iniciar exportación' },
      { status: 500 }
    )
  }
}
