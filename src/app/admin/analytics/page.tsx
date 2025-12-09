import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui'
import { ArrowLeft, TrendingUp, Eye, Share2, MousePointer } from 'lucide-react'
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
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Scroll Depth (50%+)',
      value: totalScrolls || 0,
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Shares',
      value: totalShares || 0,
      icon: Share2,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'CTA Clicks',
      value: totalCTAs || 0,
      icon: MousePointer,
      color: 'bg-orange-100 text-orange-600',
    },
  ]

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track platform performance and engagement</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <h2 className="font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardContent className="p-0">
            {recentEvents && recentEvents.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          event.event_type === 'post_opened'
                            ? 'bg-blue-100 text-blue-700'
                            : event.event_type === 'post_scrolled'
                            ? 'bg-green-100 text-green-700'
                            : event.event_type === 'post_shared'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {event.event_type.replace('_', ' ')}
                      </span>
                      {event.posts && (
                        <span className="ml-3 text-gray-700">{event.posts.title}</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(event.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                No analytics data yet. Events will appear here once users start reading articles.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
