'use client'

import { TemplateProps } from './TemplateRenderer'
import DdayCounter from './DdayCounter'
import KakaoMap from '@/components/KakaoMap'
import { formatDate, formatTime } from '@/lib/dateUtils'

export default function DeepForest({ invitation, editorMode, onTextChange }: TemplateProps) {
  const { groom_name, bride_name, wedding_date, wedding_time, venue_name, venue_address, venue_map_url, venue_lat, venue_lng, message, section_visibility, content_overrides, groom_account, bride_account, gallery_images } = invitation

  const EditableText = ({ field, value, className }: {
    field: string; value: string; className?: string
  }) => (
    <span
      className={editorMode ? `${className} outline-none cursor-text hover:bg-white/10 rounded px-1 -mx-1 transition-colors` : className}
      {...(editorMode ? {
        contentEditable: true as const,
        suppressContentEditableWarning: true,
        onBlur: (e: React.FocusEvent<HTMLSpanElement>) => onTextChange?.(field, e.currentTarget.textContent ?? ''),
      } : {})}
    >
      {value}
    </span>
  )

  const greetingTitle = content_overrides.greetingTitle ?? '우리의 봄날'
  const greetingBody = content_overrides.greetingBody ?? `자연 속에서 시작하는 우리의 이야기\n따뜻한 봄날 함께해 주세요.`
  const primary = invitation.theme.primaryColor
  const secondary = invitation.theme.secondaryColor
  const bg = invitation.theme.backgroundColor

  return (
    <div className="max-w-[480px] mx-auto min-h-screen" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', backgroundColor: bg }}>

      {/* 헤더 - 진한 그린 배경 */}
      <div className="px-8 py-14 text-center" style={{ backgroundColor: primary }}>
        <div className="text-3xl mb-6 opacity-70">🌿</div>
        <h1 className="text-3xl font-light tracking-wider mb-2 text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          {groom_name}
        </h1>
        <p className="text-white/60 text-lg my-2">&amp;</p>
        <h1 className="text-3xl font-light tracking-wider text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          {bride_name}
        </h1>
        {(wedding_date || wedding_time) && (
          <div className="mt-8 pt-6 border-t border-white/20">
            {wedding_date && <p className="text-white/80 text-sm">{formatDate(wedding_date)}</p>}
            {wedding_time && <p className="text-white/60 text-sm mt-1">{formatTime(wedding_time)}</p>}
            <DdayCounter weddingDate={wedding_date} weddingTime={wedding_time} primaryColor="white" secondaryColor="rgba(255,255,255,0.6)" />
          </div>
        )}
      </div>

      {/* 인사말 */}
      <div className="px-8 py-12 text-center">
        <h2 className="text-lg mb-5 font-medium" style={{ color: primary, fontFamily: 'var(--font-heading)' }}>
          <EditableText field="greetingTitle" value={greetingTitle} className="text-lg" />
        </h2>
        <p className="text-sm leading-8 whitespace-pre-line" style={{ color: secondary }}>{greetingBody}</p>
        {message && <p className="mt-5 text-xs italic" style={{ color: secondary }}>{message}</p>}
      </div>

      {/* 날짜 & 장소 - 카드 스타일 */}
      <div className="mx-8 my-2 p-6" style={{ backgroundColor: primary, color: 'white' }}>
        <p className="text-xs tracking-widest uppercase mb-4 opacity-60">Venue</p>
        <p className="text-base font-medium" style={{ fontFamily: 'var(--font-heading)' }}>{venue_name}</p>
        {venue_address && <p className="text-xs mt-1 opacity-70">{venue_address}</p>}
        {wedding_date && <p className="text-sm mt-4 opacity-80">{formatDate(wedding_date)}{wedding_time ? ` ${formatTime(wedding_time)}` : ''}</p>}
      </div>

      {/* 지도 */}
      {section_visibility.map && (venue_lat && venue_lng ? (
        <div className="px-8 py-4">
          <KakaoMap venueName={venue_name} lat={venue_lat} lng={venue_lng} mapUrl={venue_map_url} primaryColor={primary} secondaryColor={secondary} />
        </div>
      ) : venue_map_url ? (
        <div className="px-8 py-4">
          <a href={venue_map_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 border text-sm"
            style={{ borderColor: primary, color: primary }}>
            📍 {content_overrides.mapDirections ?? '오시는 길'}
          </a>
        </div>
      ) : null)}

      {/* 갤러리 */}
      {section_visibility.gallery && gallery_images.length > 0 && (
        <div className="px-8 py-8">
          <p className="text-xs tracking-widest uppercase text-center mb-4" style={{ color: secondary }}>Gallery</p>
          <div className="grid grid-cols-3 gap-1">
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
        <div className="px-8 py-8" style={{ borderTop: `1px solid ${primary}30` }}>
          <p className="text-xs tracking-widest uppercase text-center mb-5" style={{ color: secondary }}>마음 전하기</p>
          <div className="space-y-3">
            {groom_account && (
              <div className="p-4 border text-center" style={{ borderColor: primary }}>
                <p className="text-xs mb-1" style={{ color: secondary }}>신랑측</p>
                <p className="text-sm font-medium" style={{ color: primary }}>{groom_account.bank} {groom_account.number}</p>
                <p className="text-xs mt-0.5" style={{ color: secondary }}>{groom_account.name}</p>
              </div>
            )}
            {bride_account && (
              <div className="p-4 border text-center" style={{ borderColor: primary }}>
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

      <div className="py-14 text-center" style={{ backgroundColor: primary }}>
        <div className="text-2xl opacity-70">🌿</div>
      </div>
    </div>
  )
}
