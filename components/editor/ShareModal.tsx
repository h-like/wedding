'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface ShareModalProps {
  invitationId: string
  onClose: () => void
}

export default function ShareModal({ invitationId, onClose }: ShareModalProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handlePublish = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: invitationId }),
      })
      const data = await res.json()
      setUrl(data.url)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-t-2xl sm:rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">청첩장 공유하기</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {!url ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-6">공유 링크를 생성하면 누구나 청첩장을 볼 수 있습니다.</p>
            <button
              onClick={handlePublish}
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? '링크 생성 중...' : '공유 링크 생성'}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* URL 복사 */}
            <div className="flex gap-2">
              <input
                readOnly value={url}
                className="flex-1 border border-gray-200 px-3 py-2 text-sm text-gray-600 bg-gray-50 truncate"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-gray-900 text-white text-sm whitespace-nowrap hover:bg-gray-700 transition-colors"
              >
                {copied ? '복사됨!' : '복사'}
              </button>
            </div>

            {/* QR 코드 */}
            <div className="flex justify-center py-2">
              <QRCodeSVG value={url} size={140} />
            </div>

            <p className="text-xs text-gray-400 text-center">QR코드를 스캔하거나 링크를 공유하세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
