import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui'
import { ArrowRight, BookOpen, Users, TrendingUp, Sparkles, GraduationCap, Globe } from 'lucide-react'
import type { PostWithAuthor } from '@/types/database'

const categories = [
  {
    id: 'hr',
    name: 'HR Leadership',
    description: 'Strategic insights for HR professionals and leaders',
    icon: Users,
    href: '/category/hr',
    gradient: 'from-[var(--primary)] to-[var(--primary-light)]',
  },
  {
    id: 'talent',
    name: 'Talent Guidance',
    description: 'Practical advice for job seekers and career growth',
    icon: TrendingUp,
    href: '/category/talent',
    gradient: 'from-[var(--accent)] to-[var(--accent-light)]',
  },
  {
    id: 'team',
    name: 'From the Team',
    description: 'Updates and insights from UmukoziHR',
    icon: BookOpen,
    href: '/category/team',
    gradient: 'from-[var(--secondary)] to-[var(--secondary-light)]',
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-orb w-96 h-96 bg-[var(--primary)] opacity-20 -top-20 -left-20" />
          <div className="floating-orb w-72 h-72 bg-[var(--accent)] opacity-15 top-1/3 right-0 animation-delay-2000" />
          <div className="floating-orb w-48 h-48 bg-[var(--secondary)] opacity-10 bottom-10 left-1/4 animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm mb-8">
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-[var(--text-secondary)]">Africa&apos;s Premier HR Knowledge Platform</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[var(--text-primary)]">The </span>
              <span className="gradient-text">HR Knowledge Commons</span>
              <br />
              <span className="text-[var(--text-primary)]">for Africa</span>
            </h1>

            <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Expert insights on hiring, talent development, and workplace leadership. 
              Built by HR professionals, for Africa.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/category/hr">
                <button className="btn-primary flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Explore Articles
                </button>
              </Link>
              <Link href="/apply">
                <button className="btn-secondary flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Become a Contributor
                </button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto">
            {[
              { label: 'Articles', value: '50+' },
              { label: 'HR Experts', value: '20+' },
              { label: 'Countries', value: '10+' },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 text-center">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Explore by Category</h2>
            <p className="text-[var(--text-secondary)]">Curated content for every stage of your HR journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link key={category.id} href={category.href} className="group">
                  <div className="glass-card rounded-2xl p-8 h-full hover:border-[var(--primary)] transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-14 h-14 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-[var(--text-primary)] mb-3 group-hover:text-[var(--primary-light)] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                      {category.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-[var(--primary-light)] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Browse articles <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-20 relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="floating-orb w-64 h-64 bg-[var(--accent)] opacity-10 -top-10 right-1/4" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 glass-card rounded-full text-xs mb-3">
                  <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                  <span className="text-[var(--text-muted)]">Featured Article</span>
                </div>
                <h2 className="text-3xl font-bold text-[var(--text-primary)]">Editor&apos;s Pick</h2>
              </div>
            </div>
            <PostCard post={featuredPost} featured />
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Latest Articles</h2>
              <p className="text-[var(--text-secondary)]">Fresh perspectives from across Africa</p>
            </div>
            <Link
              href="/category/hr"
              className="hidden md:flex items-center gap-2 text-[var(--primary-light)] font-medium hover:gap-3 transition-all"
            >
              View all <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {recentPosts && recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl text-center py-16 px-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">No articles yet</h3>
              <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                Be the first to share your HR expertise with Africa.
              </p>
              <Link href="/apply">
                <button className="btn-primary">Become a Contributor</button>
              </Link>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/category/hr" className="btn-secondary inline-flex items-center gap-2">
              View all articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-orb w-80 h-80 bg-[var(--primary)] opacity-15 -bottom-20 -left-20" />
          <div className="floating-orb w-60 h-60 bg-[var(--accent)] opacity-10 top-0 right-10 animation-delay-2000" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="glass-card rounded-3xl p-10 md:p-16 text-center border-[var(--primary)]/30">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm mb-6">
              <Globe className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-[var(--text-muted)]">Join Our Community</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
              Apply to Become a Recognised<br />
              <span className="gradient-text">HR Voice in Africa</span>
            </h2>

            <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-xl mx-auto">
              Share your expertise with thousands of HR professionals and job seekers 
              across the continent. Join our community of thought leaders.
            </p>

            <Link href="/apply">
              <button className="btn-primary text-lg px-8 py-4 flex items-center gap-2 mx-auto">
                <GraduationCap className="w-5 h-5" />
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
