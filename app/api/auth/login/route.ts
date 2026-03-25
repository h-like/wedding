import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const provider = searchParams.get('provider') as 'google' | 'kakao'

  if (provider !== 'google' && provider !== 'kakao') {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
  }

  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_BASE_URL
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error || !data.url) {
    return NextResponse.json({ error: error?.message ?? 'OAuth error' }, { status: 500 })
  }

  return NextResponse.redirect(data.url)
}
