import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, getCategoryLabel, getCategoryColor, getReadingTime } from '@/lib/utils'
import { Badge } from '@/components/ui'
import { PostCard } from '@/components/post-card'
import { ShareButtons } from '@/components/share-buttons'
import { AnalyticsTracker } from '@/components/analytics-tracker'
import { Clock, User, ArrowLeft } from 'lucide-react'
import type { PostWithAuthor } from '@/types/database'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*, authors(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single() as { data: PostWithAuthor | null }

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.title,
    description: post.excerpt || post.body.replace(/<[^>]*>/g, '').slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.body.replace(/<[^>]*>/g, '').slice(0, 160),
      images: post.thumbnail_url ? [post.thumbnail_url] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*, authors(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single() as { data: PostWithAuthor | null }

  if (!post) {
    notFound()
  }

  const { data: relatedPosts } = await supabase
    .from('posts')
    .select('*, authors(*)')
    .eq('status', 'published')
    .eq('category', post.category)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3) as { data: PostWithAuthor[] | null }

  return (
    <div className="py-8">
      <AnalyticsTracker postId={post.id} postSlug={post.slug} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/category/${post.category}`}
          className="inline-flex items-center gap-2 text-[#1B4332] font-medium mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {getCategoryLabel(post.category)}
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getCategoryColor(post.category)}>
                {getCategoryLabel(post.category)}
              </Badge>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {getReadingTime(post.body)} min read
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link
                href={`/author/${post.authors.id}`}
                className="flex items-center gap-3 group"
              >
                {post.authors.avatar_url ? (
                  <Image
                    src={post.authors.avatar_url}
                    alt={post.authors.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#D8F3DC] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#1B4332]" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-[#1B4332] transition-colors">
                    {post.authors.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {post.published_at && formatDate(post.published_at)}
                  </p>
                </div>
              </Link>

              <ShareButtons
                title={post.title}
                url={`${process.env.NEXT_PUBLIC_APP_URL}/post/${post.slug}`}
              />
            </div>
          </header>

          {post.thumbnail_url && (
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
              <Image
                src={post.thumbnail_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          <footer className="border-t border-gray-100 pt-8">
            <Link
              href={`/author/${post.authors.id}`}
              className="flex items-start gap-4 p-6 bg-[#D8F3DC] rounded-xl"
            >
              {post.authors.avatar_url ? (
                <Image
                  src={post.authors.avatar_url}
                  alt={post.authors.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-[#1B4332]" />
                </div>
              )}
              <div>
                <p className="text-sm text-[#40916C] font-medium mb-1">Written by</p>
                <p className="font-bold text-[#1B4332] text-lg">{post.authors.name}</p>
                {post.authors.bio && (
                  <p className="text-[#2D6A4F] mt-2 text-sm">{post.authors.bio}</p>
                )}
              </div>
            </Link>
          </footer>
        </article>

        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
