import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button, Card, CardContent } from '@/components/ui'
import { PenSquare, Eye, ArrowLeft, Trash2, ExternalLink } from 'lucide-react'
import type { Author, Post } from '@/types/database'

export default async function DashboardPostsPage() {
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
    redirect('/dashboard')
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', author.id)
    .order('created_at', { ascending: false }) as { data: Post[] | null }

  const publishedPosts = posts?.filter(p => p.status === 'published') || []
  const draftPosts = posts?.filter(p => p.status === 'draft') || []
  const pendingPosts = posts?.filter(p => p.status === 'pending') || []

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Articles</h1>
              <p className="text-gray-600">{posts?.length || 0} total articles</p>
            </div>
          </div>
          <Link href="/dashboard/write">
            <Button>
              <PenSquare className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{publishedPosts.length}</p>
                <p className="text-sm text-gray-600">Published</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{pendingPosts.length}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{draftPosts.length}</p>
                <p className="text-sm text-gray-600">Drafts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {posts && posts.length > 0 ? (
          <Card>
            <div className="divide-y divide-gray-100">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <Link 
                      href={`/dashboard/write?id=${post.id}`}
                      className="block group"
                    >
                      <p className="font-medium text-gray-900 truncate group-hover:text-[#1B4332]">
                        {post.title || 'Untitled'}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500 capitalize">
                          {post.category === 'hr' ? 'HR Leadership' : 
                           post.category === 'talent' ? 'Talent Guidance' : 'From the Team'}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : post.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {post.status}
                    </span>
                    {post.status === 'published' && (
                      <Link 
                        href={`/post/${post.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-[#1B4332] transition-colors"
                        title="View published article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    <Link 
                      href={`/dashboard/write?id=${post.id}`}
                      className="p-2 text-gray-400 hover:text-[#1B4332] transition-colors"
                      title="Edit article"
                    >
                      <PenSquare className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="max-w-sm mx-auto">
                <PenSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
                <p className="text-gray-600 mb-6">
                  Start sharing your HR expertise with the community.
                </p>
                <Link href="/dashboard/write">
                  <Button>Write Your First Article</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
