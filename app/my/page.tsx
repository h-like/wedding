import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Invitation } from '@/types/invitation'
import LogoutButton from './LogoutButton'

export default async function MyPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 비로그인이면 로그인 UI 표시
  if (!user) {
    return <LoginView />
  }

  // 내 청첩장 목록 조회
  const { data: invitations } = await supabase
    .from('invitations')
    .select('id, slug, is_published, groom_name, bride_name, wedding_date, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <DashboardView user={user} invitations={(invitations as Partial<Invitation>[]) ?? []} />
}

// ─── 로그인 화면 ────────────────────────────────────────────
function LoginView() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 block mb-10">← 홈으로</Link>

        <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">My Wedding</p>
        <h1 className="text-2xl font-light text-gray-900 mb-2">내 청첩장</h1>
        <p className="text-sm text-gray-400 mb-10">소셜 계정으로 로그인하면 청첩장을 저장하고 언제든 수정할 수 있어요.</p>

        <div className="space-y-3">
          <SocialLoginButton provider="google" label="Google로 계속하기" />
          <SocialLoginButton provider="kakao" label="카카오로 계속하기" />
        </div>
      </div>
    </div>
  )
}

// ─── 소셜 로그인 버튼 (Client Action) ──────────────────────
function SocialLoginButton({ provider, label }: { provider: 'google' | 'kakao'; label: string }) {
  const isKakao = provider === 'kakao'
  return (
    <form action={`/api/auth/login?provider=${provider}`} method="POST">
      <button
        type="submit"
        className={`w-full flex items-center justify-center gap-3 py-3.5 text-sm font-medium transition-colors ${
          isKakao
            ? 'bg-[#FEE500] text-[#191919] hover:bg-[#F5DC00]'
            : 'border border-gray-200 text-gray-700 hover:border-gray-400'
        }`}
      >
        {isKakao ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M9 1.5C4.858 1.5 1.5 4.134 1.5 7.37c0 2.07 1.37 3.888 3.444 4.944l-.877 3.244c-.077.285.26.513.51.347L8.5 13.77c.165.012.332.018.5.018 4.142 0 7.5-2.634 7.5-5.87S13.142 1.5 9 1.5z" fill="#191919"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
        )}
        {label}
      </button>
    </form>
  )
}

// ─── 대시보드 화면 ──────────────────────────────────────────
function DashboardView({ user, invitations }: { user: { email?: string }, invitations: Partial<Invitation>[] }) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Link href="/" className="text-lg font-light tracking-wider text-gray-900">청첩장</Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden sm:block">{user.email}</span>
          <LogoutButton />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-light text-gray-900">내 청첩장</h1>
          <Link
            href="/create"
            className="px-5 py-2.5 bg-gray-900 text-white text-xs font-medium hover:bg-gray-700 transition-colors"
          >
            + 새로 만들기
          </Link>
        </div>

        {invitations.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm mb-6">아직 만든 청첩장이 없어요.</p>
            <Link href="/create" className="text-sm text-gray-700 underline underline-offset-4">
              첫 청첩장 만들기 →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {invitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between border border-gray-100 px-5 py-4 hover:border-gray-300 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {inv.groom_name} · {inv.bride_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {inv.wedding_date ?? '날짜 미정'} &nbsp;·&nbsp;
                    {inv.is_published ? (
                      <span className="text-green-600">공개중</span>
                    ) : (
                      <span>비공개</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {inv.is_published && inv.slug && (
                    <Link
                      href={`/i/${inv.slug}`}
                      className="text-xs text-gray-400 hover:text-gray-700"
                      target="_blank"
                    >
                      보기
                    </Link>
                  )}
                  <Link
                    href={`/editor/${inv.id}`}
                    className="text-xs text-gray-700 border border-gray-200 px-3 py-1.5 hover:border-gray-500 transition-colors"
                  >
                    편집
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
