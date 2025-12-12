import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button, Card, CardContent } from '@/components/ui'
import { PenSquare, FileText, BarChart3, Sparkles, BookOpen } from 'lucide-react'
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

  if (!author?.approved) {
    return (
      <div className="py-16 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="floating-orb w-72 h-72 bg-[var(--primary)] opacity-15 top-10 -left-10" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            Account Pending Approval
          </h1>
          <p className="text-[var(--text-secondary)] mb-8 text-lg">
            Your contributor application is being reviewed. You&apos;ll be notified via email once approved.
          </p>
          <Link href="/">
            <Button variant="secondary">Return to Home</Button>
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
    <div className="py-10 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-80 h-80 bg-[var(--primary)] opacity-10 -top-20 -left-20" />
        <div className="floating-orb w-64 h-64 bg-[var(--accent)] opacity-10 top-1/3 right-0 animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 glass-card rounded-full text-xs mb-3">
              <BookOpen className="w-3 h-3 text-[var(--accent)]" />
              <span className="text-[var(--text-muted)]">Contributor Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome, {author.name}</h1>
            <p className="text-[var(--text-secondary)]">Manage your articles and track performance</p>
          </div>
          <Link href="/dashboard/write">
            <Button>
              <PenSquare className="w-4 h-4 mr-2" />
              Write Article
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="hover:-translate-y-1 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Published</p>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">{publishedCount || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:-translate-y-1 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] rounded-xl flex items-center justify-center shadow-lg">
                  <PenSquare className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Drafts</p>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">{draftCount || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:-translate-y-1 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-light)] rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Total Views</p>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <div className="px-6 py-5 border-b border-[var(--glass-border)] flex items-center justify-between">
            <h2 className="font-semibold text-[var(--text-primary)]">Recent Articles</h2>
            <Link href="/dashboard/posts" className="text-sm text-[var(--primary-light)] hover:underline">
              View all
            </Link>
          </div>
          <CardContent className="p-0">
            {posts && posts.length > 0 ? (
              <div className="divide-y divide-[var(--glass-border)]">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={'/dashboard/write?id=' + post.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[var(--glass-bg)] transition-colors"
                  >
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{post.title}</p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
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
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-[var(--text-muted)]">
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
