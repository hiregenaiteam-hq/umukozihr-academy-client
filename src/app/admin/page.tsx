import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui'
import { FileText, Users, UserCheck, BarChart3 } from 'lucide-react'
import type { Author } from '@/types/database'

export default async function AdminPage() {
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

  const { count: postCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })

  const { count: publishedCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const { count: authorCount } = await supabase
    .from('authors')
    .select('*', { count: 'exact', head: true })
    .eq('approved', true)

  const { count: pendingApplications } = await supabase
    .from('submission_queue')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const menuItems = [
    {
      title: 'All Posts',
      description: 'Manage and moderate all articles',
      href: '/admin/posts',
      icon: FileText,
      count: postCount || 0,
    },
    {
      title: 'Authors',
      description: 'Manage contributor accounts',
      href: '/admin/authors',
      icon: Users,
      count: authorCount || 0,
    },
    {
      title: 'Applications',
      description: 'Review contributor applications',
      href: '/admin/applications',
      icon: UserCheck,
      count: pendingApplications || 0,
      highlight: (pendingApplications || 0) > 0,
    },
    {
      title: 'Analytics',
      description: 'View platform performance',
      href: '/admin/analytics',
      icon: BarChart3,
    },
  ]

  return (
    <div className="min-h-screen py-8 relative">
      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-96 h-96 bg-[var(--primary)] opacity-10 -top-20 -right-20" />
        <div className="floating-orb w-64 h-64 bg-[var(--accent)] opacity-10 bottom-40 -left-10 animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
          <p className="text-[var(--text-secondary)]">Manage UmukoziHR Academy content and contributors</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Total Posts</p>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">{postCount || 0}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-2">
                {publishedCount || 0} published
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Active Contributors</p>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">{authorCount || 0}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-2">
                {pendingApplications || 0} pending applications
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.title} href={item.href}>
                <Card className="h-full hover:border-[var(--primary)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {item.count !== undefined && (
                        <span
                          className={`px-2.5 py-1 text-sm rounded-full font-medium ${
                            item.highlight
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'glass-card text-[var(--text-secondary)]'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--primary-light)] transition-colors">{item.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
