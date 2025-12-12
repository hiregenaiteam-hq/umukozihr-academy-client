import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button, Card, CardContent } from '@/components/ui'
import { PenSquare, ArrowLeft, ExternalLink, FileText } from 'lucide-react'
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

  if (!author?.approved) {
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
    <div className="py-10 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-72 h-72 bg-[var(--primary)] opacity-10 -top-10 -left-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Articles</h1>
              <p className="text-[var(--text-secondary)]">{posts?.length || 0} total articles</p>
            </div>
          </div>
          <Link href="/dashboard/write">
            <Button>
              <PenSquare className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Card>
            <CardContent className="py-5">
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--primary-light)]">{publishedPosts.length}</p>
                <p className="text-sm text-[var(--text-muted)]">Published</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-5">
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--accent-light)]">{pendingPosts.length}</p>
                <p className="text-sm text-[var(--text-muted)]">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-5">
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--text-secondary)]">{draftPosts.length}</p>
                <p className="text-sm text-[var(--text-muted)]">Drafts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {posts && posts.length > 0 ? (
          <Card>
            <div className="divide-y divide-[var(--glass-border)]">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[var(--glass-bg)] transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <Link
                      href={'/dashboard/write?id=' + post.id}
                      className="block group"
                    >
                      <p className="font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--primary-light)] transition-colors">
                        {post.title || 'Untitled'}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-[var(--text-muted)]">
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-sm text-[var(--text-muted)]/50">•</span>
                        <span className="text-sm text-[var(--text-muted)] capitalize">
                          {post.category === 'hr' ? 'HR Leadership' :
                           post.category === 'talent' ? 'Talent Guidance' : 'From the Team'}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={'px-3 py-1 text-xs font-medium rounded-full ' +
                        (post.status === 'published'
                          ? 'bg-[var(--primary)]/20 text-[var(--primary-light)]'
                          : post.status === 'pending'
                          ? 'bg-[var(--accent)]/20 text-[var(--accent-light)]'
                          : 'bg-[var(--glass-bg)] text-[var(--text-muted)]')
                      }
                    >
                      {post.status}
                    </span>
                    {post.status === 'published' && (
                      <Link
                        href={'/post/' + post.slug}
                        target="_blank"
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--primary-light)] transition-colors"
                        title="View published article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    <Link
                      href={'/dashboard/write?id=' + post.id}
                      className="p-2 text-[var(--text-muted)] hover:text-[var(--primary-light)] transition-colors"
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
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No articles yet</h3>
                <p className="text-[var(--text-secondary)] mb-6">
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
