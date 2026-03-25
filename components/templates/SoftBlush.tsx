'use client'

import { TemplateProps } from './TemplateRenderer'
import DdayCounter from './DdayCounter'
import KakaoMap from '@/components/KakaoMap'
import { formatDate, formatTime } from '@/lib/dateUtils'

export default function SoftBlush({ invitation, editorMode, onTextChange }: TemplateProps) {
  const { groom_name, bride_name, wedding_date, wedding_time, venue_name, venue_address, venue_map_url, venue_lat, venue_lng, message, section_visibility, content_overrides, groom_account, bride_account, gallery_images } = invitation

  const EditableText = ({ field, value, className }: {
    field: string; value: string; className?: string
  }) => (
    <span
      className={editorMode ? `${className} outline-none cursor-text hover:bg-black/5 rounded px-1 -mx-1 transition-colors` : className}
      {...(editorMode ? {
        contentEditable: true as const,
        suppressContentEditableWarning: true,
        onBlur: (e: React.FocusEvent<HTMLSpanElement>) => onTextChange?.(field, e.currentTarget.textContent ?? ''),
      } : {})}
    >
      {value}
    </span>
  )

  const greetingTitle = content_overrides.greetingTitle ?? '함께해 주세요'
  const greetingBody = content_overrides.greetingBody ?? `두 사람이 하나가 되는 날\n소중한 분들을 초대합니다.`
  const primary = invitation.theme.primaryColor
  const secondary = invitation.theme.secondaryColor

  return (
    <div className="max-w-[480px] mx-auto min-h-screen" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', backgroundColor: 'var(--color-bg)' }}>
      {/* 상단 플로럴 장식 */}
      <div className="pt-12 pb-6 text-center text-5xl">🌸</div>

      {/* 이름 */}
      <div className="px-8 pb-10 text-center">
        <h1 className="text-3xl font-light tracking-widest mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
          {groom_name} · {bride_name}
        </h1>
        {wedding_date && (
          <p className="text-sm mt-4" style={{ color: 'var(--color-secondary)' }}>{formatDate(wedding_date)}{wedding_time ? ` ${formatTime(wedding_time)}` : ''}</p>
        )}
        <DdayCounter weddingDate={wedding_date} weddingTime={wedding_time} primaryColor={primary} secondaryColor={secondary} />
      </div>

      {/* 물결 구분선 */}
      <div className="px-8 py-2 text-center text-xl" style={{ color: primary, opacity: 0.3 }}>～ ～ ～</div>

      {/* 인사말 */}
      <div className="px-10 py-10 text-center">
        <h2 className="text-lg mb-5 font-normal">
          <EditableText field="greetingTitle" value={greetingTitle} />
        </h2>
        <p className="text-sm leading-8 whitespace-pre-line" style={{ color: 'var(--color-secondary)' }}>{greetingBody}</p>
        {message && <p className="mt-5 text-xs italic" style={{ color: secondary }}>{message}</p>}
      </div>

      {/* 날짜 & 장소 */}
      <div className="mx-8 my-4 p-6 text-center border" style={{ borderColor: primary, borderRadius: '0' }}>
        {wedding_date && <p className="text-sm font-medium mb-1" style={{ color: primary }}>{formatDate(wedding_date)}</p>}
        {wedding_time && <p className="text-xs mb-3" style={{ color: secondary }}>{formatTime(wedding_time)}</p>}
        <p className="text-base" style={{ fontFamily: 'var(--font-heading)', color: primary }}>{venue_name}</p>
        {venue_address && <p className="text-xs mt-1" style={{ color: secondary }}>{venue_address}</p>}
      </div>

      {/* 지도 */}
      {section_visibility.map && (venue_lat && venue_lng ? (
        <div className="px-8 py-4">
          <KakaoMap venueName={venue_name} lat={venue_lat} lng={venue_lng} mapUrl={venue_map_url} primaryColor={primary} secondaryColor={secondary} />
        </div>
      ) : venue_map_url ? (
        <div className="px-8 py-4">
          <a href={venue_map_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 text-sm"
            style={{ backgroundColor: primary, color: 'white' }}>
            <span>📍</span><span>{content_overrides.mapDirections ?? '오시는 길'}</span>
          </a>
        </div>
      ) : null)}

      {/* 갤러리 */}
      {section_visibility.gallery && gallery_images.length > 0 && (
        <div className="px-8 py-8">
          <div className="text-center text-xl mb-4">🌷</div>
          <div className="grid grid-cols-2 gap-2">
            {gallery_images.map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 계좌번호 */}
      {section_visibility.account && (groom_account || bride_account) && (
        <div className="px-8 py-8">
          <p className="text-xs tracking-widest uppercase text-center mb-5" style={{ color: secondary }}>마음 전하기</p>
          <div className="space-y-3">
            {groom_account && (
              <div className="p-4 text-center" style={{ backgroundColor: primary, opacity: 0.08, borderRadius: '0' }}>
                <p className="text-xs mb-1" style={{ color: secondary }}>신랑측</p>
                <p className="text-sm font-medium" style={{ color: primary }}>{groom_account.bank} {groom_account.number}</p>
                <p className="text-xs mt-0.5" style={{ color: secondary }}>{groom_account.name}</p>
              </div>
            )}
            {bride_account && (
              <div className="p-4 text-center" style={{ backgroundColor: primary, opacity: 0.08 }}>
                <p className="text-xs mb-1" style={{ color: secondary }}>신부측</p>
                <p className="text-sm font-medium" style={{ color: primary }}>{bride_account.bank} {bride_account.number}</p>
                <p className="text-xs mt-0.5" style={{ color: secondary }}>{bride_account.name}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RSVP */}
      {section_visibility.rsvp && (
        <div className="px-8 py-6 text-center">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: secondary }}>RSVP</p>
          <p className="text-sm" style={{ color: secondary }}>{content_overrides.rsvpMessage ?? '참석 여부를 알려주세요.'}</p>
        </div>
      )}

      <div className="py-14 text-center text-3xl">🌸</div>
    </div>
  )
}
