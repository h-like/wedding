import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'

const BUCKET = 'wedding-gallery'

// POST: 이미지 업로드
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    // 현재 gallery_images 조회
    const { data: inv, error: fetchError } = await supabase
      .from('invitations')
      .select('gallery_images')
      .eq('id', id)
      .single()

    if (fetchError) return NextResponse.json({ error: '청첩장을 찾을 수 없습니다.' }, { status: 404 })

    // Storage에 업로드
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${id}/${Date.now()}.${ext}`
    const arrayBuffer = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, arrayBuffer, { contentType: file.type, upsert: false })

    if (uploadError) throw uploadError

    // Public URL 생성
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)

    // gallery_images 배열에 추가
    const updatedImages = [...(inv.gallery_images ?? []), publicUrl]
    const { error: updateError } = await supabase
      .from('invitations')
      .update({ gallery_images: updatedImages, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) throw updateError

    return NextResponse.json({ url: publicUrl, gallery_images: updatedImages }, { status: 201 })
  } catch (err) {
    console.error('POST /api/invitations/[id]/gallery error:', err)
    return NextResponse.json({ error: '업로드에 실패했습니다.' }, { status: 500 })
  }
}

// DELETE: 이미지 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { url } = await request.json() as { url: string }

    const supabase = await createServiceClient()

    const { data: inv, error: fetchError } = await supabase
      .from('invitations')
      .select('gallery_images')
      .eq('id', id)
      .single()

    if (fetchError) return NextResponse.json({ error: '청첩장을 찾을 수 없습니다.' }, { status: 404 })

    // Storage에서 파일 경로 추출 후 삭제
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const storagePath = url.replace(`${supabaseUrl}/storage/v1/object/public/${BUCKET}/`, '')
    await supabase.storage.from(BUCKET).remove([storagePath])

    // gallery_images 배열에서 제거
    const updatedImages = (inv.gallery_images ?? []).filter((u: string) => u !== url)
    const { error: updateError } = await supabase
      .from('invitations')
      .update({ gallery_images: updatedImages, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) throw updateError

    return NextResponse.json({ gallery_images: updatedImages })
  } catch (err) {
    console.error('DELETE /api/invitations/[id]/gallery error:', err)
    return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 })
  }
}
