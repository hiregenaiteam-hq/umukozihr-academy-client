import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/post-card'
import { Linkedin, User } from 'lucide-react'
import type { Author, PostWithAuthor } from '@/types/database'

interface AuthorPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: AuthorPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: author } = await supabase
    .from('authors')
    .select('*')
    .eq('id', id)
    .eq('approved', true)
    .single() as { data: Author | null }

  if (!author) {
    return { title: 'Author Not Found' }
  }

  return {
    title: author.name,
    description: author.bio || `Articles by ${author.name} on UmukoziHR Academy`,
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: author } = await supabase
    .from('authors')
    .select('*')
    .eq('id', id)
    .eq('approved', true)
    .single() as { data: Author | null }

  if (!author) {
    notFound()
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('*, authors(*)')
    .eq('status', 'published')
    .eq('author_id', id)
    .order('published_at', { ascending: false }) as { data: PostWithAuthor[] | null }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {author.avatar_url ? (
              <Image
                src={author.avatar_url}
                alt={author.name}
                width={120}
                height={120}
                className="rounded-full"
              />
            ) : (
              <div className="w-30 h-30 bg-[#D8F3DC] rounded-full flex items-center justify-center">
                <User className="w-16 h-16 text-[#1B4332]" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{author.name}</h1>
              {author.organization && (
                <p className="text-lg text-[#40916C] mb-4">{author.organization}</p>
              )}
              {author.bio && (
                <p className="text-gray-600 mb-6 max-w-2xl">{author.bio}</p>
              )}
              <div className="flex items-center gap-4">
                {author.linkedin_url && (
                  <a
                    href={author.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#0077b5] hover:underline"
                  >
                    <Linkedin className="w-5 h-5" />
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Articles by {author.name}
        </h2>

        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-600">No articles published yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
