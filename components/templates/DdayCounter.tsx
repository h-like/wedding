'use client'

import { useEffect, useState } from 'react'
import { calcCountdown } from '@/lib/dateUtils'

interface Props {
  weddingDate: string | null
  weddingTime: string | null
  primaryColor: string
  secondaryColor: string
}

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

export default function DdayCounter({ weddingDate, weddingTime, primaryColor, secondaryColor }: Props) {
  const [countdown, setCountdown] = useState(() => calcCountdown(weddingDate, weddingTime))

  useEffect(() => {
    setCountdown(calcCountdown(weddingDate, weddingTime))
    const timer = setInterval(() => {
      setCountdown(calcCountdown(weddingDate, weddingTime))
    }, 1000)
    return () => clearInterval(timer)
  }, [weddingDate, weddingTime])

  if (!countdown) return null

  if (countdown.isPast) {
    const msg =
      countdown.pastDays === 0
        ? '오늘 두 사람의 결혼식이 있습니다'
        : `두 사람이 결혼한 지 ${countdown.pastDays}일이 지났습니다`
    return (
      <div className="flex flex-col items-center mt-4 gap-1">
        <span className="text-sm font-light tracking-wide" style={{ color: secondaryColor }}>
          {msg}
        </span>
      </div>
    )
  }

  const { days, hours, minutes, seconds } = countdown

  const parts: string[] = []
  if (days > 0) parts.push(`${days}일`)
  parts.push(`${pad(hours)}시간`)
  parts.push(`${pad(minutes)}분`)
  parts.push(`${pad(seconds)}초`)

  return (
    <div className="flex flex-col items-center mt-4 gap-1">
      <span
        className="text-base font-light tracking-wide tabular-nums"
        style={{ color: primaryColor, fontVariantNumeric: 'tabular-nums' }}
      >
        {parts.join(' ')}
      </span>
      <span className="text-xs tracking-widest" style={{ color: secondaryColor }}>
        후에 결혼식이 시작됩니다
      </span>
    </div>
  )
}
