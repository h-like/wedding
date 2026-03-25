import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '청첩장 - 나만의 모바일 청첩장',
  description: '정보를 입력하고 템플릿을 골라 나만의 청첩장을 만들어 링크로 공유하세요.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500&family=Noto+Serif+KR:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Lato:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  )
}
