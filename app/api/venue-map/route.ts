import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat   = searchParams.get('lat')
  const lng   = searchParams.get('lng')
  const size  = searchParams.get('size')  ?? '480x200'
  const level = searchParams.get('level') ?? '4'

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat, lng 필수' }, { status: 400 })
  }

  const apiKey = process.env.KAKAO_REST_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'KAKAO_REST_API_KEY 미설정' }, { status: 500 })
  }

  const url = new URL('https://dapi.kakao.com/v2/maps/staticmap')
  url.searchParams.set('center',  `${lng},${lat}`)
  url.searchParams.set('level',   level)
  url.searchParams.set('size',    size)
  url.searchParams.set('markers', `color:red|${lng},${lat}`)

  const res = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${apiKey}` },
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    return new NextResponse(null, { status: res.status })
  }

  const buffer = await res.arrayBuffer()
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': res.headers.get('content-type') ?? 'image/png',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
