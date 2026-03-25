/** "2026-05-15" → "2026년 5월 15일" */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

/** "14:30" → "오후 2시 30분" / 기존 텍스트면 그대로 반환 */
export function formatTime(timeStr: string | null): string {
  if (!timeStr) return ''
  if (!/^\d{2}:\d{2}$/.test(timeStr)) return timeStr // 레거시 텍스트 그대로
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h < 12 ? '오전' : '오후'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${ampm} ${hour}시 ${m.toString().padStart(2, '0')}분`
}

/** 결혼식까지 남은 시간 카운트다운 계산 */
export function calcCountdown(
  weddingDate: string | null,
  weddingTime: string | null
): {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
  pastDays: number
} | null {
  if (!weddingDate) return null

  const timeStr = weddingTime && /^\d{2}:\d{2}$/.test(weddingTime) ? weddingTime : '12:00'
  const target = new Date(`${weddingDate}T${timeStr}:00`)
  const now = new Date()
  const diffMs = target.getTime() - now.getTime()

  if (diffMs <= 0) {
    const pastDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24))
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, pastDays }
  }

  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds, isPast: false, pastDays: 0 }
}
