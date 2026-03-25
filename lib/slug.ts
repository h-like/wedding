import { nanoid } from 'nanoid'

// 한글을 로마자로 변환하는 간단한 매핑 (이름용)
const koreanRomanMap: Record<string, string> = {
  가: 'ga', 나: 'na', 다: 'da', 라: 'ra', 마: 'ma', 바: 'ba', 사: 'sa',
  아: 'a', 자: 'ja', 차: 'cha', 카: 'ka', 타: 'ta', 파: 'pa', 하: 'ha',
  이: 'i', 우: 'u', 오: 'o', 에: 'e', 기: 'ki', 미: 'mi', 지: 'ji',
  현: 'hyun', 민: 'min', 준: 'jun', 수: 'su', 연: 'yeon', 영: 'young',
  진: 'jin', 혜: 'hye', 은: 'eun', 유: 'yu', 정: 'jung', 호: 'ho',
}

function toSlugPart(name: string): string {
  if (!name) return 'unknown'
  // 한글이면 변환 시도, 아니면 그대로 소문자
  const result = name
    .split('')
    .map(char => koreanRomanMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
  return result || 'unknown'
}

export function generateSlug(groomName: string, brideName: string, weddingDate?: string | null): string {
  const groom = toSlugPart(groomName)
  const bride = toSlugPart(brideName)
  const date = weddingDate ? weddingDate.replace(/-/g, '') : 'date'
  const suffix = nanoid(4).toLowerCase()
  return `${groom}-${bride}-${date}-${suffix}`
}
