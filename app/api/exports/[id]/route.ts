import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: exportRecord, error } = await supabase
      .from('exports')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !exportRecord) {
      return NextResponse.json(
        { error: 'Exportación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ export: exportRecord })
  } catch (error: any) {
    console.error('GET export error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener exportación' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { error } = await supabase
      .from('exports')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('DELETE export error:', error)
    return NextResponse.json(
      { error: error.message || 'Error al cancelar exportación' },
      { status: 500 }
    )
  }
}
