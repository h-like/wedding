import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ error: '청첩장을 찾을 수 없습니다.' }, { status: 404 })

    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/invitations/[id] error:', err)
    return NextResponse.json({ error: '조회에 실패했습니다.' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = await createServiceClient()

    const allowedFields = [
      'groom_name', 'bride_name', 'wedding_date', 'wedding_time',
      'venue_name', 'venue_address', 'venue_map_url', 'message',
      'groom_account', 'bride_account', 'gallery_images',
      'template_id', 'theme', 'content_overrides', 'section_visibility',
    ]

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    for (const field of allowedFields) {
      if (field in body) updates[field] = body[field]
    }

    const { data, error } = await supabase
      .from('invitations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error('PATCH /api/invitations/[id] error:', err)
    return NextResponse.json({ error: '수정에 실패했습니다.' }, { status: 500 })
  }
}
