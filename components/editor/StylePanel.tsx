'use client'

import { ThemeConfig, SectionVisibility } from '@/types/invitation'
import GalleryPanel from './GalleryPanel'
import AccountPanel from './AccountPanel'
import { AccountInfo } from '@/types/invitation'

const HEADING_FONTS = [
  { label: '명조체 (기본)', value: 'Noto Serif KR' },
  { label: '고딕체', value: 'Noto Sans KR' },
  { label: 'Playfair', value: 'Playfair Display' },
  { label: 'Cormorant', value: 'Cormorant Garamond' },
]

const BODY_FONTS = [
  { label: '고딕 (기본)', value: 'Noto Sans KR' },
  { label: '명조체', value: 'Noto Serif KR' },
  { label: 'Lato', value: 'Lato' },
]

interface StylePanelProps {
  theme: ThemeConfig
  sections: SectionVisibility
  onThemeChange: (patch: Partial<ThemeConfig>) => void
  onSectionToggle: (key: keyof SectionVisibility) => void
  onShare: () => void
  invitationId: string
  galleryImages: string[]
  onGalleryChange: (images: string[]) => void
  groomAccount: AccountInfo | null
  brideAccount: AccountInfo | null
  onGroomAccountChange: (account: AccountInfo | null) => void
  onBrideAccountChange: (account: AccountInfo | null) => void
}

export default function StylePanel({ theme, sections, onThemeChange, onSectionToggle, onShare, invitationId, galleryImages, onGalleryChange, groomAccount, brideAccount, onGroomAccountChange, onBrideAccountChange }: StylePanelProps) {
  return (
    <div className="h-full overflow-y-auto p-5 space-y-7">

      {/* 색상 */}
      <section>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">색상</h3>
        <div className="space-y-3">
          <ColorRow label="포인트" value={theme.primaryColor} onChange={v => onThemeChange({ primaryColor: v })} />
          <ColorRow label="서브" value={theme.secondaryColor} onChange={v => onThemeChange({ secondaryColor: v })} />
          <ColorRow label="배경" value={theme.backgroundColor} onChange={v => onThemeChange({ backgroundColor: v })} />
          <ColorRow label="텍스트" value={theme.textColor} onChange={v => onThemeChange({ textColor: v })} />
        </div>
      </section>

      {/* 폰트 */}
      <section>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">폰트</h3>
        <div className="space-y-2.5">
          <div>
            <label className="text-xs text-gray-400 block mb-1">제목 폰트</label>
            <select
              value={theme.headingFont}
              onChange={e => onThemeChange({ headingFont: e.target.value })}
              className="w-full border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-400"
            >
              {HEADING_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">본문 폰트</label>
            <select
              value={theme.bodyFont}
              onChange={e => onThemeChange({ bodyFont: e.target.value })}
              className="w-full border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-400"
            >
              {BODY_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">글자 크기</label>
            <div className="flex gap-2">
              {(['sm', 'md', 'lg'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => onThemeChange({ fontSize: size })}
                  className="flex-1 py-2 border text-xs transition-colors"
                  style={{
                    borderColor: theme.fontSize === size ? '#1a1a1a' : '#e5e7eb',
                    backgroundColor: theme.fontSize === size ? '#1a1a1a' : 'white',
                    color: theme.fontSize === size ? 'white' : '#6b7280',
                  }}
                >
                  {size === 'sm' ? '작게' : size === 'md' ? '기본' : '크게'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 표시 */}
      <section>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">섹션 표시</h3>
        <div className="space-y-2">
          {(Object.entries(sections) as [keyof SectionVisibility, boolean][]).map(([key, val]) => (
            <label key={key} className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-sm text-gray-700">
                {key === 'map' ? '오시는 길' : key === 'gallery' ? '갤러리' : key === 'rsvp' ? 'RSVP' : '계좌번호'}
              </span>
              <button
                onClick={() => onSectionToggle(key)}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{ backgroundColor: val ? '#1a1a1a' : '#d1d5db' }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm"
                  style={{ transform: val ? 'translateX(22px)' : 'translateX(2px)' }}
                />
              </button>
            </label>
          ))}
        </div>
      </section>

      {/* 계좌번호 */}
      <AccountPanel
        groomAccount={groomAccount}
        brideAccount={brideAccount}
        onGroomChange={onGroomAccountChange}
        onBrideChange={onBrideAccountChange}
      />

      {/* 갤러리 */}
      <GalleryPanel
        invitationId={invitationId}
        images={galleryImages}
        onGalleryChange={onGalleryChange}
      />

      {/* 공유 버튼 */}
      <button
        onClick={onShare}
        className="w-full py-3.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        공유하기
      </button>
    </div>
  )
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-mono">{value}</span>
        <label className="relative w-8 h-8 cursor-pointer overflow-hidden rounded border border-gray-200">
          <div className="w-full h-full" style={{ backgroundColor: value }} />
          <input
            type="color" value={value}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>
    </div>
  )
}
