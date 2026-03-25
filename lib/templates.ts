import { ThemeConfig } from '@/types/invitation'

export interface TemplateMetadata {
  id: string
  name: string
  description: string
  thumbnail: string
  defaultTheme: ThemeConfig
}

export const TEMPLATES: TemplateMetadata[] = [
  {
    id: 'minimal-white',
    name: '미니멀 화이트',
    description: '깔끔하고 모던한 흰 배경 디자인',
    thumbnail: '/template-thumbs/minimal-white.jpg',
    defaultTheme: {
      primaryColor: '#1a1a1a',
      secondaryColor: '#666666',
      backgroundColor: '#ffffff',
      textColor: '#1a1a1a',
      headingFont: 'Noto Serif KR',
      bodyFont: 'Noto Sans KR',
      fontSize: 'md',
    },
  },
  {
    id: 'soft-blush',
    name: '소프트 블러쉬',
    description: '따뜻한 핑크 파스텔 로맨틱 디자인',
    thumbnail: '/template-thumbs/soft-blush.jpg',
    defaultTheme: {
      primaryColor: '#8b4a6b',
      secondaryColor: '#c9899b',
      backgroundColor: '#fdf6f8',
      textColor: '#4a2d3a',
      headingFont: 'Noto Serif KR',
      bodyFont: 'Noto Sans KR',
      fontSize: 'md',
    },
  },
  {
    id: 'deep-forest',
    name: '딥 포레스트',
    description: '짙은 그린 계열의 자연적인 감성',
    thumbnail: '/template-thumbs/deep-forest.jpg',
    defaultTheme: {
      primaryColor: '#2d4a3e',
      secondaryColor: '#5a8a7a',
      backgroundColor: '#f5f9f7',
      textColor: '#1a2e28',
      headingFont: 'Noto Serif KR',
      bodyFont: 'Noto Sans KR',
      fontSize: 'md',
    },
  },
  {
    id: 'golden-elegance',
    name: '골든 엘레강스',
    description: '골드 라인의 고급스럽고 우아한 디자인',
    thumbnail: '/template-thumbs/golden-elegance.jpg',
    defaultTheme: {
      primaryColor: '#b8860b',
      secondaryColor: '#d4a843',
      backgroundColor: '#fdfbf5',
      textColor: '#2a2010',
      headingFont: 'Noto Serif KR',
      bodyFont: 'Noto Sans KR',
      fontSize: 'md',
    },
  },
]

export const templateRegistry: Record<string, TemplateMetadata> = Object.fromEntries(
  TEMPLATES.map(t => [t.id, t])
)

export function getTemplateById(id: string): TemplateMetadata {
  return templateRegistry[id] ?? TEMPLATES[0]
}
