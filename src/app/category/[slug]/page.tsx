import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/post-card'
import { getCategoryLabel } from '@/lib/utils'
import type { PostWithAuthor, PostCategory } from '@/types/database'

const validCategories = ['hr', 'talent', 'team']

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

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {getCategoryLabel(slug)}
          </h1>
          <p className="text-lg text-gray-600">
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
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-600">No articles in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
