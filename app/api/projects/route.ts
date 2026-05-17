import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
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

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ projects: data })
  } catch (error: any) {
    console.error('GET projects error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener proyectos' },
      { status: 500 }
    )
  }
}

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
    const { title, description, style, data: projectData } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Título requerido' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        title,
        description,
        style,
        status: 'draft',
        data: projectData || { scenes: [], timeline: [], effects: {} },
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ project: data }, { status: 201 })
  } catch (error: any) {
    console.error('POST project error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear proyecto' },
      { status: 500 }
    )
  }
}
