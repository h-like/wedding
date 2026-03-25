import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { Invitation } from '@/types/invitation'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('invitations')
    .select('groom_name, bride_name, wedding_date, venue_name')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!data) return { title: '청첩장' }

  const title = `${data.groom_name} ♥ ${data.bride_name} 결혼합니다`
  const description = `${data.wedding_date ? new Date(data.wedding_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''} | ${data.venue_name}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export default async function InvitationViewPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !data) notFound()

  const invitation = data as Invitation

  return (
    <main className="min-h-screen">
      <TemplateRenderer invitation={invitation} editorMode={false} />
    </main>
  )
}
