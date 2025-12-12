import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/post-card'
import { getCategoryLabel } from '@/lib/utils'
import type { PostWithAuthor, PostCategory } from '@/types/database'
import { Users, TrendingUp, BookOpen, Sparkles } from 'lucide-react'

const validCategories = ['hr', 'talent', 'team']

const categoryIcons: Record<string, typeof Users> = {
  hr: Users,
  talent: TrendingUp,
  team: BookOpen,
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  if (!validCategories.includes(slug)) {
    return { title: 'Category Not Found' }
  }
  return {
    title: getCategoryLabel(slug),
    description: `Browse ${getCategoryLabel(slug)} articles on UmukoziHR Academy`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  if (!validCategories.includes(slug)) {
    notFound()
  }

  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, authors(*)')
    .eq('status', 'published')
    .eq('category', slug as PostCategory)
    .order('published_at', { ascending: false }) as { data: PostWithAuthor[] | null }

  const Icon = categoryIcons[slug] || BookOpen

  return (
    <div className="py-16 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-80 h-80 bg-[var(--primary)] opacity-15 -top-20 -left-20" />
        <div className="floating-orb w-64 h-64 bg-[var(--accent)] opacity-10 top-1/2 right-0 animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm mb-6">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-[var(--text-muted)]">Category</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-xl flex items-center justify-center shadow-lg">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
              {getCategoryLabel(slug)}
            </h1>
          </div>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
            {slug === 'hr' && 'Strategic insights for HR professionals and leaders building world-class organizations.'}
            {slug === 'talent' && 'Practical advice for job seekers and professionals looking to advance their careers.'}
            {slug === 'team' && 'Updates, insights, and news from the UmukoziHR team.'}
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="glass-card text-center py-16 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <p className="text-[var(--text-secondary)]">No articles in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
