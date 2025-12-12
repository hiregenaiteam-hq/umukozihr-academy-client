import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui'
import { ArrowRight, BookOpen, Users, TrendingUp } from 'lucide-react'
import type { PostWithAuthor } from '@/types/database'

const categories = [
  {
    id: 'hr',
    name: 'HR Leadership',
    description: 'Strategic insights for HR professionals and leaders',
    icon: Users,
    href: '/category/hr',
  },
  {
    id: 'talent',
    name: 'Talent Guidance',
    description: 'Practical advice for job seekers and career growth',
    icon: TrendingUp,
    href: '/category/talent',
  },
  {
    id: 'team',
    name: 'From the Team',
    description: 'Updates and insights from UmukoziHR',
    icon: BookOpen,
    href: '/category/team',
  },
]

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredPost } = await supabase
    .from('posts')
    .select('*, authors(*)')
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle() as { data: PostWithAuthor | null }

  const { data: recentPosts } = await supabase
    .from('posts')
    .select('*, authors(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6) as { data: PostWithAuthor[] | null }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Africa&apos;s HR Knowledge Commons
            </h1>
            <p className="text-xl text-[#D8F3DC] mb-8">
              Expert insights on hiring, talent development, and workplace
              leadership. Built by HR professionals, for Africa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/category/hr">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-[#1B4332] hover:bg-[#D8F3DC]"
                >
                  Explore Articles
                </Button>
              </Link>
              <Link href="/apply">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-[#1B4332]"
                >
                  Become a Contributor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Explore by Category</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className="group p-6 rounded-xl border border-gray-100 hover:border-[#2563eb] hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-[#ecfdf5] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#d1fae5] transition-colors">
                    <Icon className="w-6 h-6 text-[#40916C]" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#2563eb] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured</h2>
            </div>
            <PostCard post={featuredPost} featured />
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            <Link
              href="/category/hr"
              className="text-[#2563eb] font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentPosts && recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No articles yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to share your HR expertise with Africa.
              </p>
              <Link href="/apply">
                <Button>Become a Contributor</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#ecfdf5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-4">
            Apply to Become a Recognised HR Voice in Africa
          </h2>
          <p className="text-lg text-[#40916C] mb-8 max-w-2xl mx-auto">
            Share your expertise with thousands of HR professionals and job
            seekers across the continent. Join our community of thought leaders.
          </p>
          <Link href="/apply">
            <Button size="lg">Apply Now</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
