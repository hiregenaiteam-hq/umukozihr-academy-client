import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button, Card, CardContent } from '@/components/ui'
import { PenSquare, FileText, BarChart3 } from 'lucide-react'
import type { Author, Post } from '@/types/database'

export default async function DashboardPage() {
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

  if (!author || !author.approved) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Account Pending Approval
          </h1>
          <p className="text-gray-600 mb-6">
            Your contributor application is being reviewed. You&apos;ll be notified via email once approved.
          </p>
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', author.id)
    .order('created_at', { ascending: false })
    .limit(5) as { data: Post[] | null }

  const { count: publishedCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', author.id)
    .eq('status', 'published')

  const { count: draftCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', author.id)
    .eq('status', 'draft')

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {author.name}</h1>
            <p className="text-gray-600">Manage your articles and track performance</p>
          </div>
          <Link href="/dashboard/write">
            <Button>
              <PenSquare className="w-4 h-4 mr-2" />
              Write Article
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{publishedCount || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <PenSquare className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold text-gray-900">{draftCount || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold">Recent Articles</h2>
            <Link href="/dashboard/posts" className="text-sm text-[#1B4332] hover:underline">
              View all
            </Link>
          </div>
          <CardContent className="p-0">
            {posts && posts.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/dashboard/write?id=${post.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{post.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : post.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {post.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                <p>No articles yet. Start writing!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
