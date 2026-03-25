'use client'

import { TemplateProps } from './TemplateRenderer'
import DdayCounter from './DdayCounter'
import KakaoMap from '@/components/KakaoMap'
import { formatDate, formatTime } from '@/lib/dateUtils'

export default function GoldenElegance({ invitation, editorMode, onTextChange }: TemplateProps) {
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

  const greetingTitle = content_overrides.greetingTitle ?? '영원한 사랑의 시작'
  const greetingBody = content_overrides.greetingBody ?? `빛나는 날, 소중한 분들과\n영원한 약속을 나누고 싶습니다.`
  const primary = invitation.theme.primaryColor
  const secondary = invitation.theme.secondaryColor

  return (
    <div className="max-w-[480px] mx-auto min-h-screen" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', backgroundColor: 'var(--color-bg)' }}>

      {/* 골든 테두리 헤더 */}
      <div className="pt-10 px-6">
        <div className="border-2 p-8 text-center" style={{ borderColor: primary }}>
          <div className="border p-6" style={{ borderColor: `${primary}60` }}>
            <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: primary, fontFamily: 'var(--font-body)' }}>
              Wedding Invitation
            </p>
            <h1 className="text-3xl font-light mb-1 tracking-wider" style={{ fontFamily: 'var(--font-heading)', color: primary }}>
              {groom_name}
            </h1>
            <div className="my-3 text-lg" style={{ color: secondary }}>✦</div>
            <h1 className="text-3xl font-light tracking-wider" style={{ fontFamily: 'var(--font-heading)', color: primary }}>
              {bride_name}
            </h1>
            {(wedding_date || wedding_time) && (
              <div className="mt-6 pt-5 border-t" style={{ borderColor: `${primary}50` }}>
                {wedding_date && <p className="text-sm" style={{ color: secondary }}>{formatDate(wedding_date)}</p>}
                {wedding_time && <p className="text-sm mt-1" style={{ color: secondary }}>{formatTime(wedding_time)}</p>}
                <DdayCounter weddingDate={wedding_date} weddingTime={wedding_time} primaryColor={primary} secondaryColor={secondary} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 골든 구분선 */}
      <div className="px-8 py-8 flex items-center gap-3">
        <div className="h-px flex-1" style={{ backgroundColor: primary, opacity: 0.3 }} />
        <span style={{ color: primary }}>✦</span>
        <div className="h-px flex-1" style={{ backgroundColor: primary, opacity: 0.3 }} />
      </div>

      {/* 인사말 */}
      <div className="px-10 pb-10 text-center">
        <h2 className="text-lg mb-5" style={{ fontFamily: 'var(--font-heading)', color: primary }}>
          <EditableText field="greetingTitle" value={greetingTitle} className="text-lg" />
        </h2>
        <p className="text-sm leading-8 whitespace-pre-line" style={{ color: secondary }}>{greetingBody}</p>
        {message && <p className="mt-5 text-xs italic" style={{ color: secondary }}>{message}</p>}
      </div>

      {/* 날짜 & 장소 */}
      <div className="mx-6 py-8 text-center" style={{ borderTop: `1px solid ${primary}50`, borderBottom: `1px solid ${primary}50` }}>
        <p className="text-xs tracking-[0.3em] uppercase mb-5" style={{ color: primary }}>Date &amp; Venue</p>
        {wedding_date && <p className="text-base mb-1" style={{ fontFamily: 'var(--font-heading)', color: primary }}>{formatDate(wedding_date)}</p>}
        {wedding_time && <p className="text-sm mb-4" style={{ color: secondary }}>{formatTime(wedding_time)}</p>}
        <p className="text-base font-medium" style={{ color: primary }}>{venue_name}</p>
        {venue_address && <p className="text-sm mt-1" style={{ color: secondary }}>{venue_address}</p>}
      </div>

      {/* 지도 */}
      {section_visibility.map && (venue_lat && venue_lng ? (
        <div className="px-8 py-6">
          <KakaoMap venueName={venue_name} lat={venue_lat} lng={venue_lng} mapUrl={venue_map_url} primaryColor={primary} secondaryColor={secondary} />
        </div>
      ) : venue_map_url ? (
        <div className="px-8 py-6">
          <a href={venue_map_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 border-2 text-sm transition-colors hover:opacity-80"
            style={{ borderColor: primary, color: primary }}>
            ✦ {content_overrides.mapDirections ?? '오시는 길'}
          </a>
        </div>
      ) : null)}

      {/* 갤러리 */}
      {section_visibility.gallery && gallery_images.length > 0 && (
        <div className="px-8 py-8">
          <p className="text-xs tracking-[0.3em] uppercase text-center mb-5" style={{ color: primary }}>Gallery</p>
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
        <div className="px-8 py-8">
          <p className="text-xs tracking-[0.3em] uppercase text-center mb-5" style={{ color: primary }}>마음 전하기</p>
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
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: primary }}>RSVP</p>
          <p className="text-sm" style={{ color: secondary }}>{content_overrides.rsvpMessage ?? '참석 여부를 알려주세요.'}</p>
        </div>
      )}

      <div className="py-12 text-center">
        <span className="text-2xl" style={{ color: primary }}>✦</span>
      </div>
    </div>
  )
}
