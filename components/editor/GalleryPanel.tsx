'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

interface GalleryPanelProps {
  invitationId: string
  images: string[]
  onGalleryChange: (images: string[]) => void
}

export default function GalleryPanel({ invitationId, images, onGalleryChange }: GalleryPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          setError('파일 크기는 5MB 이하만 가능합니다.')
          continue
        }
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch(`/api/invitations/${invitationId}/gallery`, {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? '업로드 실패')
        } else {
          onGalleryChange(data.gallery_images)
        }
      }
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDelete = async (url: string) => {
    const res = await fetch(`/api/invitations/${invitationId}/gallery`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    const data = await res.json()
    if (res.ok) onGalleryChange(data.gallery_images)
  }

  return (
    <section>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">갤러리 이미지</h3>

      {/* 이미지 그리드 */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {images.map((url) => (
            <div key={url} className="relative aspect-square group">
              <Image
                src={url}
                alt="gallery"
                fill
                className="object-cover"
                sizes="80px"
              />
              <button
                onClick={() => handleDelete(url)}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 업로드 버튼 */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading || images.length >= 10}
        className="w-full py-2.5 border border-dashed border-gray-300 text-xs text-gray-500 hover:border-gray-500 hover:text-gray-700 transition-colors disabled:opacity-40"
      >
        {uploading ? '업로드 중...' : images.length >= 10 ? '최대 10장' : '+ 사진 추가'}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />

      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      <p className="text-xs text-gray-400 mt-1.5">최대 10장 · 장당 5MB 이하</p>
    </section>
  )
}
