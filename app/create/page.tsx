'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import VenueSearch, { type VenueInfo } from '@/components/VenueSearch'

export default function CreatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    groom_name: '',
    bride_name: '',
    wedding_date: '',
    wedding_time: '',
    message: '',
  })
  const [venue, setVenue] = useState<VenueInfo | null>(null)

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          venue_name: venue?.venue_name ?? '',
          venue_address: venue?.venue_address ?? null,
          venue_map_url: venue?.venue_map_url ?? null,
          venue_lat: venue?.venue_lat ?? null,
          venue_lng: venue?.venue_lng ?? null,
        }),
      })
      const data = await res.json()
      if (data.id) router.push(`/editor/${data.id}`)
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = form.groom_name && form.bride_name && venue

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-6 py-12">
        <div className="mb-10">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600">← 돌아가기</a>
          <h1 className="text-2xl font-light text-gray-900 mt-4">청첩장 정보 입력</h1>
          <p className="text-sm text-gray-400 mt-2">기본 정보를 입력하면 템플릿으로 시안을 확인할 수 있습니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 이름 */}
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">신랑 · 신부 <span className="text-red-400">*</span></h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="신랑 이름" value={form.groom_name} onChange={set('groom_name')} required placeholder="홍길동" />
              <Field label="신부 이름" value={form.bride_name} onChange={set('bride_name')} required placeholder="김영희" />
            </div>
          </section>

          {/* 일시 */}
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">예식 일시</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="날짜" type="date" value={form.wedding_date} onChange={set('wedding_date')} />
              <Field label="시간" type="time" value={form.wedding_time} onChange={set('wedding_time')} />
            </div>
          </section>

          {/* 장소 */}
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              예식 장소 <span className="text-red-400">*</span>
            </h2>
            <VenueSearch value={venue} onChange={setVenue} />
          </section>

          {/* 메시지 */}
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">인사말</h2>
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">추가 메시지 (선택)</label>
              <textarea
                value={form.message}
                onChange={set('message')}
                placeholder="하객에게 전하고 싶은 말을 입력하세요"
                rows={3}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400 resize-none"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full py-4 bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40"
          >
            {loading ? '생성 중...' : '시안 확인하기 →'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, required, placeholder, type = 'text' }: {
  label: string; value: string; onChange: React.ChangeEventHandler<HTMLInputElement>; required?: boolean; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label className="text-xs text-gray-500 block mb-1.5">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input
        type={type} value={value} onChange={onChange} required={required} placeholder={placeholder}
        className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
      />
    </div>
  )
}
