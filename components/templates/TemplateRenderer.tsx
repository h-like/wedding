'use client'

import { Invitation } from '@/types/invitation'
import { templateRegistry } from '@/lib/templates'
import MinimalWhite from './MinimalWhite'
import SoftBlush from './SoftBlush'
import DeepForest from './DeepForest'
import GoldenElegance from './GoldenElegance'

const componentMap: Record<string, React.ComponentType<TemplateProps>> = {
  'minimal-white': MinimalWhite,
  'soft-blush': SoftBlush,
  'deep-forest': DeepForest,
  'golden-elegance': GoldenElegance,
}

export interface TemplateProps {
  invitation: Invitation
  editorMode?: boolean
  onTextChange?: (field: string, value: string) => void
}

interface TemplateRendererProps {
  invitation: Invitation
  editorMode?: boolean
  onTextChange?: (field: string, value: string) => void
}

export default function TemplateRenderer({ invitation, editorMode = false, onTextChange }: TemplateRendererProps) {
  const theme = invitation.theme
  const fontSizeMap = { sm: '14px', md: '16px', lg: '18px' }

  const cssVars = {
    '--color-primary': theme.primaryColor,
    '--color-secondary': theme.secondaryColor,
    '--color-bg': theme.backgroundColor,
    '--color-text': theme.textColor,
    '--font-heading': `'${theme.headingFont}', serif`,
    '--font-body': `'${theme.bodyFont}', sans-serif`,
    '--font-size-base': fontSizeMap[theme.fontSize] ?? '16px',
    backgroundColor: theme.backgroundColor,
  } as React.CSSProperties

  const Template = componentMap[invitation.template_id] ?? MinimalWhite

  return (
    <div style={cssVars} className="wedding-canvas w-full">
      <Template
        invitation={invitation}
        editorMode={editorMode}
        onTextChange={onTextChange}
      />
    </div>
  )
}
