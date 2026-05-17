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

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    let query = supabase
      .from('exports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ exports: data || [] })
  } catch (error: any) {
    console.error('GET exports error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener exportaciones' },
      { status: 500 }
    )
  }
}
