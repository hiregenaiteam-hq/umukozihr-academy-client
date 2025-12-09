import { createClient } from '@/lib/supabase/server'
import type { MetadataRoute } from 'next'

const siteUrl = 'https://academy.umukozihr.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/category/hr`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/category/talent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/category/team`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/apply`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false }) as { data: Array<{ slug: string; updated_at: string; published_at: string }> | null }

  const postPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${siteUrl}/post/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const { data: authors } = await supabase
    .from('authors')
    .select('id, updated_at')
    .eq('approved', true) as { data: Array<{ id: string; updated_at: string }> | null }

  const authorPages: MetadataRoute.Sitemap = (authors || []).map((author) => ({
    url: `${siteUrl}/author/${author.id}`,
    lastModified: new Date(author.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...postPages, ...authorPages]
}
