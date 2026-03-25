'use client'

import { TEMPLATES } from '@/lib/templates'

interface TemplateGridProps {
  currentTemplateId: string
  onSelect: (templateId: string) => void
}

export default function TemplateGrid({ currentTemplateId, onSelect }: TemplateGridProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
      {TEMPLATES.map(t => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className="flex-shrink-0 text-center group"
        >
          <div
            className="w-16 h-24 border-2 transition-colors mb-1.5 flex items-center justify-center text-xs overflow-hidden"
            style={{
              borderColor: currentTemplateId === t.id ? '#1a1a1a' : '#e5e7eb',
              backgroundColor: t.defaultTheme.backgroundColor,
            }}
          >
            <span style={{ color: t.defaultTheme.primaryColor, fontSize: '18px' }}>
              {t.id === 'minimal-white' && '◻'}
              {t.id === 'soft-blush' && '🌸'}
              {t.id === 'deep-forest' && '🌿'}
              {t.id === 'golden-elegance' && '✦'}
            </span>
          </div>
          <span
            className="text-[10px] leading-tight block"
            style={{ color: currentTemplateId === t.id ? '#1a1a1a' : '#9ca3af' }}
          >
            {t.name}
          </span>
        </button>
      ))}
    </div>
  )
}
