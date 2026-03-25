import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { DEFAULT_THEME, DEFAULT_SECTION_VISIBILITY } from '@/types/invitation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { groom_name, bride_name, venue_name, wedding_date, wedding_time, venue_address, venue_map_url, venue_lat, venue_lng, message } = body

    if (!groom_name || !bride_name || !venue_name) {
      return NextResponse.json({ error: '신랑/신부 이름과 장소는 필수입니다.' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('invitations')
      .insert({
        groom_name,
        bride_name,
        venue_name,
        wedding_date: wedding_date || null,
        wedding_time: wedding_time || null,
        venue_address: venue_address || null,
        venue_map_url: venue_map_url || null,
        venue_lat: venue_lat ?? null,
        venue_lng: venue_lng ?? null,
        message: message || null,
        template_id: 'minimal-white',
        theme: DEFAULT_THEME,
        content_overrides: {},
        section_visibility: DEFAULT_SECTION_VISIBILITY,
        gallery_images: [],
        is_published: false,
        slug: null,
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ id: data.id }, { status: 201 })
  } catch (err) {
    console.error('POST /api/invitations error:', err)
    return NextResponse.json({ error: '청첩장 생성에 실패했습니다.' }, { status: 500 })
  }
}
