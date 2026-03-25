'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { KakaoPlace } from '@/app/api/venue-search/route'

export interface VenueInfo {
  venue_name: string
  venue_address: string
  venue_map_url: string
  venue_lat: number
  venue_lng: number
}

interface Props {
  value: VenueInfo | null
  onChange: (venue: VenueInfo | null) => void
}

export default function VenueSearch({ value, onChange }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<KakaoPlace[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mapAppKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 1) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/venue-search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.places ?? [])
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 350)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, search])

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function selectPlace(place: KakaoPlace) {
    onChange({
      venue_name: place.place_name,
      venue_address: place.road_address_name || place.address_name,
      venue_map_url: place.place_url,
      venue_lat: parseFloat(place.y),
      venue_lng: parseFloat(place.x),
    })
    setQuery('')
    setOpen(false)
    setResults([])
  }

  function clear() {
    onChange(null)
    setQuery('')
  }

  const staticMapUrl = value && mapAppKey
    ? `https://dapi.kakao.com/v2/maps/staticmap?center=${value.venue_lng},${value.venue_lat}&level=4&size=480x160&markers=color:red|${value.venue_lng},${value.venue_lat}&appkey=${mapAppKey}`
    : null

  return (
    <div className="space-y-3">
      {/* 선택된 장소 카드 */}
      {value ? (
        <div className="border border-gray-200 rounded-sm overflow-hidden">
          {/* 지도 미리보기 */}
          {staticMapUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={staticMapUrl}
              alt="지도 미리보기"
              className="w-full h-36 object-cover"
            />
          ) : (
            <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
              지도 미리보기를 보려면 NEXT_PUBLIC_KAKAO_MAP_APP_KEY를 설정하세요
            </div>
          )}

          {/* 장소 정보 */}
          <div className="px-4 py-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{value.venue_name}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{value.venue_address}</p>
            </div>
            <button
              type="button"
              onClick={clear}
              className="shrink-0 text-xs text-gray-400 hover:text-gray-700 mt-0.5"
            >
              변경
            </button>
          </div>
        </div>
      ) : (
        /* 검색 입력 */
        <div ref={containerRef} className="relative">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              placeholder="웨딩홀 이름으로 검색 (예: 더케이호텔)"
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 pr-10"
            />
            {loading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs animate-pulse">
                검색 중
              </span>
            )}
          </div>

          {/* 드롭다운 결과 */}
          {open && results.length > 0 && (
            <ul className="absolute z-50 w-full top-full left-0 border border-gray-200 border-t-0 bg-white shadow-md max-h-64 overflow-y-auto">
              {results.map(place => (
                <li key={place.id}>
                  <button
                    type="button"
                    onClick={() => selectPlace(place)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <p className="text-sm font-medium text-gray-900">{place.place_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {place.road_address_name || place.address_name}
                    </p>
                    {place.phone && (
                      <p className="text-xs text-gray-300 mt-0.5">{place.phone}</p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {open && !loading && query.length > 0 && results.length === 0 && (
            <div className="absolute z-50 w-full top-full left-0 border border-gray-200 border-t-0 bg-white shadow-md px-4 py-3 text-sm text-gray-400">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  )
}
