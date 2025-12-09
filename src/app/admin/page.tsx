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
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage UmukoziHR Academy content and contributors</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Posts</p>
                  <p className="text-3xl font-bold text-gray-900">{postCount || 0}</p>
                </div>
                <div className="w-12 h-12 bg-[#D8F3DC] rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#1B4332]" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {publishedCount || 0} published
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Contributors</p>
                  <p className="text-3xl font-bold text-gray-900">{authorCount || 0}</p>
                </div>
                <div className="w-12 h-12 bg-[#D8F3DC] rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#1B4332]" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
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
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-[#D8F3DC] rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#1B4332]" />
                      </div>
                      {item.count !== undefined && (
                        <span
                          className={`px-2 py-1 text-sm rounded-full ${
                            item.highlight
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
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
