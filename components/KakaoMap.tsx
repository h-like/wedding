'use client'

interface Props {
  venueName: string
  lat: number
  lng: number
  mapUrl?: string | null   // Kakao place URL fallback
  primaryColor?: string
  secondaryColor?: string
}

export default function KakaoMap({
  venueName,
  lat,
  lng,
  mapUrl,
  primaryColor = '#2d2d2d',
  secondaryColor = '#888888',
}: Props) {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY

  const encodedName = encodeURIComponent(venueName)

  // 지도 이미지 (카카오 Static Map)
  const staticMapUrl = appKey
    ? `https://dapi.kakao.com/v2/maps/staticmap?center=${lng},${lat}&level=4&size=480x200&markers=color:red|${lng},${lat}&appkey=${appKey}`
    : null

  // 네비게이션 링크
  const kakaoNavUrl = `https://map.kakao.com/link/to/${encodedName},${lat},${lng}`
  const naverNavUrl = `https://map.naver.com/p/directions/-/-/${lng},${lat},${encodedName}/-/walk`
  const tmapNavUrl  = `https://www.tmap.co.kr/tmap2/mobile/route.do?goalname=${encodedName}&goaly=${lat}&goalx=${lng}`

  return (
    <div className="w-full">
      {/* 지도 이미지 */}
      <div className="w-full overflow-hidden rounded-sm">
        {staticMapUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <a href={mapUrl ?? kakaoNavUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={staticMapUrl}
              alt={`${venueName} 지도`}
              className="w-full h-44 object-cover"
            />
          </a>
        ) : (
          <a
            href={mapUrl ?? kakaoNavUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full h-24 text-sm"
            style={{ backgroundColor: '#f5f5f5', color: secondaryColor }}
          >
            📍 지도 보기
          </a>
        )}
      </div>

      {/* 교통편 버튼 */}
      <div className="flex gap-2 mt-3">
        <NavButton href={kakaoNavUrl} color={primaryColor}>
          카카오맵
        </NavButton>
        <NavButton href={naverNavUrl} color={primaryColor}>
          네이버지도
        </NavButton>
        <NavButton href={tmapNavUrl} color={primaryColor}>
          티맵
        </NavButton>
      </div>
    </div>
  )
}

function NavButton({ href, color, children }: { href: string; color: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 text-center py-2 text-xs border transition-opacity hover:opacity-70"
      style={{ borderColor: color, color }}
    >
      {children}
    </a>
  )
}
