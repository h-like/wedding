import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { generateSlug } from '@/lib/slug'

export async function POST(request: Request) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'id가 필요합니다.' }, { status: 400 })

    const supabase = await createServiceClient()

    const { data: invitation, error: fetchError } = await supabase
      .from('invitations')
      .select('groom_name, bride_name, wedding_date, slug, is_published')
      .eq('id', id)
      .single()

    if (fetchError) return NextResponse.json({ error: '청첩장을 찾을 수 없습니다.' }, { status: 404 })

    // 이미 공개된 경우 기존 슬러그 반환
    if (invitation.is_published && invitation.slug) {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/i/${invitation.slug}`
      return NextResponse.json({ slug: invitation.slug, url })
    }

    const slug = generateSlug(invitation.groom_name, invitation.bride_name, invitation.wedding_date)

    const { error: updateError } = await supabase
      .from('invitations')
      .update({ slug, is_published: true, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) throw updateError

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/i/${slug}`
    return NextResponse.json({ slug, url })
  } catch (err) {
    console.error('POST /api/publish error:', err)
    return NextResponse.json({ error: '공개에 실패했습니다.' }, { status: 500 })
  }
}
