import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { invitation_id, guest_name, attending, guest_count, message } = body

    if (!invitation_id || !guest_name || attending === undefined) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    const { error } = await supabase.from('rsvp_responses').insert({
      invitation_id,
      guest_name,
      attending,
      guest_count: guest_count || 1,
      message: message || null,
    })

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('POST /api/rsvp error:', err)
    return NextResponse.json({ error: 'RSVP 제출에 실패했습니다.' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const invitation_id = searchParams.get('invitation_id')
    if (!invitation_id) return NextResponse.json({ error: 'invitation_id가 필요합니다.' }, { status: 400 })

    const supabase = await createServiceClient()
    const { data, error } = await supabase
      .from('rsvp_responses')
      .select('*')
      .eq('invitation_id', invitation_id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error('GET /api/rsvp error:', err)
    return NextResponse.json({ error: '조회에 실패했습니다.' }, { status: 500 })
  }
}
