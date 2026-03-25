import { NextResponse } from 'next/server'

export interface KakaoPlace {
  id: string
  place_name: string
  address_name: string
  road_address_name: string
  phone: string
  place_url: string
  x: string  // longitude
  y: string  // latitude
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim()

  if (!query || query.length < 1) {
    return NextResponse.json({ places: [] })
  }

  const apiKey = process.env.KAKAO_REST_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'KAKAO_REST_API_KEY가 설정되지 않았습니다.' }, { status: 500 })
  }

  const url = new URL('https://dapi.kakao.com/v2/local/search/keyword.json')
  url.searchParams.set('query', query)
  url.searchParams.set('size', '8')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${apiKey}` },
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    return NextResponse.json({ error: '장소 검색에 실패했습니다.' }, { status: res.status })
  }

  const data = await res.json()
  const places: KakaoPlace[] = data.documents ?? []

  return NextResponse.json({ places })
}
