import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, Button } from '@/components/ui'
import { ArrowLeft, TrendingUp, Eye, Share2, MousePointer, Activity } from 'lucide-react'
import type { Author } from '@/types/database'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: author } = await supabase
    .from('authors')
    .select('*')
    .eq('supabase_user_id', user.id)
    .single() as { data: Author | null }

  if (!author || (author.role !== 'admin' && author.role !== 'editor')) {
    redirect('/dashboard')
  }

  const { count: totalViews } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'post_opened')

  const { count: totalScrolls } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'post_scrolled')

  const { count: totalShares } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'post_shared')

  const { count: totalCTAs } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'cta_clicked')

  const { data: recentEvents } = await supabase
    .from('events')
    .select('*, posts(title, slug)')
    .order('created_at', { ascending: false })
    .limit(20) as { data: Array<{
      id: number
      event_type: string
      created_at: string
      posts: { title: string; slug: string } | null
    }> | null }

  const stats = [
    {
      title: 'Total Views',
      value: totalViews || 0,
      icon: Eye,
      gradient: 'from-blue-500 to-blue-400',
    },
    {
      title: 'Scroll Depth (50%+)',
      value: totalScrolls || 0,
      icon: TrendingUp,
      gradient: 'from-[var(--primary)] to-[var(--primary-light)]',
    },
    {
      title: 'Shares',
      value: totalShares || 0,
      icon: Share2,
      gradient: 'from-purple-500 to-purple-400',
    },
    {
      title: 'CTA Clicks',
      value: totalCTAs || 0,
      icon: MousePointer,
      gradient: 'from-[var(--accent)] to-[var(--accent-light)]',
    },
  ]

  return (
    <div className="min-h-screen py-8 relative">
      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-80 h-80 bg-[var(--primary)] opacity-10 -top-10 -right-10" />
        <div className="floating-orb w-64 h-64 bg-[var(--accent)] opacity-10 bottom-40 left-10 animation-delay-2000" />
        <div className="floating-orb w-48 h-48 bg-blue-500 opacity-10 top-1/2 right-1/4 animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics</h1>
            <p className="text-[var(--text-secondary)]">Track platform performance and engagement</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="hover:border-[var(--primary)] transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">{stat.title}</p>
                      <p className="text-3xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader className="border-b border-[var(--glass-border)]">
            <h2 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--primary)]" />
              Recent Activity
            </h2>
          </CardHeader>
          <CardContent className="p-0">
            {recentEvents && recentEvents.length > 0 ? (
              <div className="divide-y divide-[var(--glass-border)]">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          event.event_type === 'post_opened'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : event.event_type === 'post_scrolled'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : event.event_type === 'post_shared'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30'
                        }`}
                      >
                        {event.event_type.replace('_', ' ')}
                      </span>
                      {event.posts && (
                        <span className="text-[var(--text-secondary)]">{event.posts.title}</span>
                      )}
                    </div>
                    <span className="text-sm text-[var(--text-muted)]">
                      {new Date(event.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <p className="text-[var(--text-muted)]">No analytics data yet. Events will appear here once users start reading articles.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
