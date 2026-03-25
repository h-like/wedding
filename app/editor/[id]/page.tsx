'use client'

import { useEffect, useReducer, useCallback, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import TemplateGrid from '@/components/editor/TemplateGrid'
import StylePanel from '@/components/editor/StylePanel'
import ShareModal from '@/components/editor/ShareModal'
import { Invitation, ThemeConfig, SectionVisibility, ContentOverrides, AccountInfo } from '@/types/invitation'
import { getTemplateById } from '@/lib/templates'

type EditorAction =
  | { type: 'INIT'; invitation: Invitation }
  | { type: 'SET_TEMPLATE'; templateId: string }
  | { type: 'SET_THEME'; patch: Partial<ThemeConfig> }
  | { type: 'SET_SECTION'; key: keyof SectionVisibility }
  | { type: 'SET_CONTENT'; patch: Partial<ContentOverrides> }
  | { type: 'SET_GALLERY'; images: string[] }
  | { type: 'SET_ACCOUNT'; side: 'groom' | 'bride'; account: AccountInfo | null }

function reducer(state: Invitation | null, action: EditorAction): Invitation | null {
  if (action.type === 'INIT') return action.invitation
  if (!state) return state

  switch (action.type) {
    case 'SET_TEMPLATE': {
      const meta = getTemplateById(action.templateId)
      return { ...state, template_id: action.templateId, theme: meta.defaultTheme }
    }
    case 'SET_THEME':
      return { ...state, theme: { ...state.theme, ...action.patch } }
    case 'SET_SECTION':
      return {
        ...state,
        section_visibility: {
          ...state.section_visibility,
          [action.key]: !state.section_visibility[action.key],
        },
      }
    case 'SET_CONTENT':
      return { ...state, content_overrides: { ...state.content_overrides, ...action.patch } }
    case 'SET_GALLERY':
      return { ...state, gallery_images: action.images }
    case 'SET_ACCOUNT':
      return action.side === 'groom'
        ? { ...state, groom_account: action.account }
        : { ...state, bride_account: action.account }
    default:
      return state
  }
}

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const [invitation, dispatch] = useReducer(reducer, null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [saving, setSaving] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    fetch(`/api/invitations/${id}`)
      .then(r => r.json())
      .then(data => dispatch({ type: 'INIT', invitation: data }))
  }, [id])

  // 자동저장 (debounce 1초)
  const autosave = useCallback(async (data: Invitation) => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      try {
        await fetch(`/api/invitations/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            template_id: data.template_id,
            theme: data.theme,
            section_visibility: data.section_visibility,
            content_overrides: data.content_overrides,
            groom_account: data.groom_account,
            bride_account: data.bride_account,
          }),
        })
      } finally {
        setSaving(false)
      }
    }, 1000)
  }, [id])

  useEffect(() => {
    if (invitation) autosave(invitation)
  }, [invitation, autosave])

  const handleTextChange = useCallback((field: string, value: string) => {
    dispatch({ type: 'SET_CONTENT', patch: { [field]: value } as Partial<ContentOverrides> })
  }, [])

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 상단 바 */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 z-20">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-600">← 나가기</a>
        <span className="text-xs text-gray-400">{saving ? '저장 중...' : '저장됨'}</span>
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="text-sm text-gray-700 font-medium md:hidden"
        >
          편집
        </button>
      </header>

      {/* 템플릿 선택 바 */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 z-10">
        <TemplateGrid
          currentTemplateId={invitation.template_id}
          onSelect={(tid) => dispatch({ type: 'SET_TEMPLATE', templateId: tid })}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 캔버스 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[480px] mx-auto my-4 shadow-sm">
            <TemplateRenderer
              invitation={invitation}
              editorMode
              onTextChange={handleTextChange}
            />
          </div>
        </div>

        {/* 스타일 패널 - 데스크탑 */}
        <div className="hidden md:flex flex-col w-72 bg-white border-l border-gray-100">
          <StylePanel
            theme={invitation.theme}
            sections={invitation.section_visibility}
            onThemeChange={(patch) => dispatch({ type: 'SET_THEME', patch })}
            onSectionToggle={(key) => dispatch({ type: 'SET_SECTION', key })}
            onShare={() => setShowShare(true)}
            invitationId={id}
            galleryImages={invitation.gallery_images}
            onGalleryChange={(images) => dispatch({ type: 'SET_GALLERY', images })}
            groomAccount={invitation.groom_account}
            brideAccount={invitation.bride_account}
            onGroomAccountChange={(account) => dispatch({ type: 'SET_ACCOUNT', side: 'groom', account })}
            onBrideAccountChange={(account) => dispatch({ type: 'SET_ACCOUNT', side: 'bride', account })}
          />
        </div>
      </div>

      {/* 모바일 하단 드로어 */}
      {panelOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setPanelOpen(false)} />
          <div className="relative bg-white rounded-t-2xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h3 className="font-medium text-gray-900">디자인 편집</h3>
              <button onClick={() => setPanelOpen(false)} className="text-gray-400 text-xl">×</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <StylePanel
                theme={invitation.theme}
                sections={invitation.section_visibility}
                onThemeChange={(patch) => dispatch({ type: 'SET_THEME', patch })}
                onSectionToggle={(key) => dispatch({ type: 'SET_SECTION', key })}
                onShare={() => { setPanelOpen(false); setShowShare(true) }}
                invitationId={id}
                galleryImages={invitation.gallery_images}
                onGalleryChange={(images) => dispatch({ type: 'SET_GALLERY', images })}
                groomAccount={invitation.groom_account}
                brideAccount={invitation.bride_account}
                onGroomAccountChange={(account) => dispatch({ type: 'SET_ACCOUNT', side: 'groom', account })}
                onBrideAccountChange={(account) => dispatch({ type: 'SET_ACCOUNT', side: 'bride', account })}
              />
            </div>
          </div>
        </div>
      )}

      {/* 모바일 하단 공유 버튼 */}
      <div className="md:hidden fixed bottom-4 right-4 z-20">
        <button
          onClick={() => setShowShare(true)}
          className="px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-full shadow-lg"
        >
          공유하기
        </button>
      </div>

      {/* 공유 모달 */}
      {showShare && (
        <ShareModal invitationId={id} onClose={() => setShowShare(false)} />
      )}
    </div>
  )
}
