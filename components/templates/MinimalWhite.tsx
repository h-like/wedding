'use client'

import { useState } from 'react'
import { TemplateProps } from './TemplateRenderer'
import DdayCounter from './DdayCounter'
import KakaoMap from '@/components/KakaoMap'
import { formatDate, formatTime } from '@/lib/dateUtils'

export default function MinimalWhite({ invitation, editorMode, onTextChange }: TemplateProps) {
  const { groom_name, bride_name, wedding_date, wedding_time, venue_name, venue_address, venue_map_url, venue_lat, venue_lng, message, section_visibility, content_overrides, groom_account, bride_account, gallery_images } = invitation

  const EditableText = ({ field, value, className, multiline = false }: {
    field: string; value: string; className?: string; multiline?: boolean
  }) => {
    const shared = {
      className: editorMode
        ? `${className} outline-none cursor-text hover:bg-black/5 rounded px-1 -mx-1 transition-colors`
        : className,
      ...(editorMode ? {
        contentEditable: true as const,
        suppressContentEditableWarning: true,
        onBlur: (e: React.FocusEvent<HTMLElement>) => onTextChange?.(field, e.currentTarget.textContent ?? ''),
      } : {}),
    }
    if (multiline) return <p {...shared}>{value}</p>
    return <span {...shared}>{value}</span>
  }

  const greetingTitle = content_overrides.greetingTitle ?? '저희 결혼합니다'
  const greetingBody = content_overrides.greetingBody ?? `소중한 분들을 모시고\n새로운 시작을 함께하고자 합니다.\n부디 오셔서 자리를 빛내주세요.`
  const primary = invitation.theme.primaryColor
  const secondary = invitation.theme.secondaryColor

  return (
    <div
      className="max-w-[480px] mx-auto min-h-screen"
      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', backgroundColor: 'var(--color-bg)' }}
    >
      {/* 헤더 */}
      <div className="pt-16 pb-12 px-8 text-center border-b" style={{ borderColor: primary }}>
        <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: secondary }}>
          Wedding Invitation
        </p>
        <h1 className="text-4xl font-light mb-2 tracking-wide" style={{ fontFamily: 'var(--font-heading)', color: primary }}>
          {groom_name}
        </h1>
        <p className="text-lg my-3" style={{ color: secondary }}>&amp;</p>
        <h1 className="text-4xl font-light tracking-wide" style={{ fontFamily: 'var(--font-heading)', color: primary }}>
          {bride_name}
        </h1>
        {(wedding_date || wedding_time) && (
          <div className="mt-8 space-y-1">
            {wedding_date && <p className="text-sm" style={{ color: secondary }}>{formatDate(wedding_date)}</p>}
            {wedding_time && <p className="text-sm" style={{ color: secondary }}>{formatTime(wedding_time)}</p>}
          </div>
        )}
        <DdayCounter weddingDate={wedding_date} weddingTime={wedding_time} primaryColor={primary} secondaryColor={secondary} />
      </div>

      {/* 인사말 */}
      <div className="px-8 py-12 text-center">
        <h2 className="text-xl mb-6 font-normal" style={{ fontFamily: 'var(--font-heading)', color: primary }}>
          <EditableText field="greetingTitle" value={greetingTitle} />
        </h2>
        <p className="text-sm leading-8 whitespace-pre-line" style={{ color: secondary }}>{greetingBody}</p>
        {message && <p className="mt-6 text-sm italic" style={{ color: secondary }}>{message}</p>}
      </div>

      {/* 구분선 */}
      <div className="flex items-center justify-center gap-4 px-8 py-4">
        <div className="h-px flex-1" style={{ backgroundColor: primary, opacity: 0.2 }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }} />
        <div className="h-px flex-1" style={{ backgroundColor: primary, opacity: 0.2 }} />
      </div>

      {/* 날짜 & 장소 */}
      <div className="px-8 py-10 text-center">
        <p className="text-xs tracking-[0.2em] uppercase mb-5" style={{ color: secondary }}>Date &amp; Venue</p>
        {wedding_date && (
          <p className="text-base mb-1" style={{ fontFamily: 'var(--font-heading)', color: primary }}>
            {formatDate(wedding_date)} {wedding_time ? formatTime(wedding_time) : ''}
          </p>
        )}
        <p className="text-base font-medium mt-3" style={{ color: primary }}>{venue_name}</p>
        {venue_address && <p className="text-sm mt-1" style={{ color: secondary }}>{venue_address}</p>}
      </div>

      {/* 지도 */}
      {section_visibility.map && (venue_lat && venue_lng ? (
        <div className="px-8 py-6">
          <KakaoMap
            venueName={venue_name}
            lat={venue_lat}
            lng={venue_lng}
            mapUrl={venue_map_url}
            primaryColor={primary}
            secondaryColor={secondary}
          />
        </div>
      ) : venue_map_url ? (
        <div className="px-8 py-6">
          <a href={venue_map_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 border text-sm transition-colors hover:opacity-70"
            style={{ borderColor: primary, color: primary }}>
            <span>📍</span>
            <span>{content_overrides.mapDirections ?? '오시는 길'}</span>
          </a>
        </div>
      ) : null)}

      {/* 갤러리 */}
      {section_visibility.gallery && gallery_images.length > 0 && (
        <div className="px-8 py-8">
          <p className="text-xs tracking-[0.2em] uppercase text-center mb-5" style={{ color: secondary }}>Gallery</p>
          <div className="grid grid-cols-3 gap-1">
            {gallery_images.map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`갤러리 ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 계좌번호 */}
      {section_visibility.account && (groom_account || bride_account) && (
        <div className="px-8 py-8" style={{ borderTop: `1px solid ${primary}20` }}>
          <p className="text-xs tracking-[0.2em] uppercase text-center mb-6" style={{ color: secondary }}>마음 전하기</p>
          <div className="space-y-4">
            {groom_account && (
              <div className="text-center p-4 border" style={{ borderColor: primary }}>
                <p className="text-xs mb-1" style={{ color: secondary }}>신랑측</p>
                <p className="text-sm font-medium" style={{ color: primary }}>{groom_account.bank} {groom_account.number}</p>
                <p className="text-xs mt-1" style={{ color: secondary }}>{groom_account.name}</p>
              </div>
            )}
            {bride_account && (
              <div className="text-center p-4 border" style={{ borderColor: primary }}>
                <p className="text-xs mb-1" style={{ color: secondary }}>신부측</p>
                <p className="text-sm font-medium" style={{ color: primary }}>{bride_account.bank} {bride_account.number}</p>
                <p className="text-xs mt-1" style={{ color: secondary }}>{bride_account.name}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RSVP */}
      {section_visibility.rsvp && (
        editorMode
          ? <RsvpPlaceholder primary={primary} secondary={secondary} message={content_overrides.rsvpMessage} />
          : <RsvpForm invitationId={invitation.id} message={content_overrides.rsvpMessage} primary={primary} secondary={secondary} />
      )}

      <div className="py-16 text-center">
        <p className="text-xs" style={{ color: secondary, opacity: 0.5 }}>with love</p>
      </div>
    </div>
  )
}

function RsvpPlaceholder({ primary, secondary, message }: { primary: string; secondary: string; message?: string }) {
  return (
    <div className="px-8 py-8" style={{ borderTop: `1px solid ${primary}20` }}>
      <p className="text-xs tracking-[0.2em] uppercase text-center mb-4" style={{ color: secondary }}>RSVP</p>
      <p className="text-sm text-center mb-4" style={{ color: secondary }}>{message ?? '참석 여부를 알려주세요.'}</p>
      <div className="text-center text-xs py-3 border" style={{ borderColor: primary, color: primary }}>
        RSVP 폼 (공개 페이지에서 활성화됩니다)
      </div>
    </div>
  )
}

function RsvpForm({ invitationId, message, primary, secondary }: {
  invitationId: string; message?: string; primary: string; secondary: string
}) {
  const [name, setName] = useState('')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [count, setCount] = useState(1)
  const [msg, setMsg] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || attending === null) return
    setLoading(true)
    try {
      await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitation_id: invitationId, guest_name: name, attending, guest_count: count, message: msg }),
      })
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="px-8 py-8 text-center" style={{ borderTop: `1px solid ${primary}20` }}>
        <p className="text-sm" style={{ color: primary }}>참석 의사를 전달해주셔서 감사합니다 💌</p>
      </div>
    )
  }

  return (
    <div className="px-8 py-8" style={{ borderTop: `1px solid ${primary}20` }}>
      <p className="text-xs tracking-[0.2em] uppercase text-center mb-4" style={{ color: secondary }}>RSVP</p>
      <p className="text-sm text-center mb-6" style={{ color: secondary }}>{message ?? '참석 여부를 알려주세요.'}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="성함" required
          className="w-full border-b bg-transparent py-2 text-sm outline-none placeholder:opacity-50"
          style={{ borderColor: primary, color: primary }}
        />
        <div className="flex gap-3">
          {([true, false] as const).map(val => (
            <button key={String(val)} type="button" onClick={() => setAttending(val)}
              className="flex-1 py-2 text-sm border transition-colors"
              style={{
                borderColor: primary,
                backgroundColor: attending === val ? primary : 'transparent',
                color: attending === val ? 'white' : primary,
              }}
            >
              {val ? '참석' : '불참'}
            </button>
          ))}
        </div>
        {attending && (
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: secondary }}>인원</span>
            <input type="number" min={1} max={10} value={count} onChange={e => setCount(Number(e.target.value))}
              className="w-16 border-b bg-transparent py-1 text-sm text-center outline-none"
              style={{ borderColor: primary, color: primary }}
            />
            <span className="text-sm" style={{ color: secondary }}>명</span>
          </div>
        )}
        <textarea value={msg} onChange={e => setMsg(e.target.value)}
          placeholder="축하 메시지 (선택)" rows={3}
          className="w-full border bg-transparent p-3 text-sm outline-none placeholder:opacity-50 resize-none"
          style={{ borderColor: primary, color: primary }}
        />
        <button type="submit" disabled={!name || attending === null || loading}
          className="w-full py-3 text-sm transition-colors disabled:opacity-40"
          style={{ backgroundColor: primary, color: 'white' }}
        >
          {loading ? '전송 중...' : '전달하기'}
        </button>
      </form>
    </div>
  )
}
