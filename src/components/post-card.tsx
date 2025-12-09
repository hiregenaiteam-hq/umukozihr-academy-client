import Link from 'next/link'
import Image from 'next/image'
import { formatDate, getCategoryLabel, getCategoryColor, getReadingTime } from '@/lib/utils'
import type { PostWithAuthor } from '@/types/database'
import { Badge } from '@/components/ui'
import { Clock, User } from 'lucide-react'

interface PostCardProps {
  post: PostWithAuthor
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link href={`/post/${post.slug}`} className="group block">
        <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-full">
              {post.thumbnail_url ? (
                <Image
                  src={post.thumbnail_url}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#ff6b35] to-[#ffb396] flex items-center justify-center">
                  <span className="text-white text-6xl font-bold opacity-20">U</span>
                </div>
              )}
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getCategoryColor(post.category)}>
                  {getCategoryLabel(post.category)}
                </Badge>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {getReadingTime(post.body)} min read
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-[#2563eb] transition-colors mb-3">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt || post.body.replace(/<[^>]*>/g, '').slice(0, 200)}
              </p>
              <div className="flex items-center gap-3 mt-auto">
                {post.authors.avatar_url ? (
                  <Image
                    src={post.authors.avatar_url}
                    alt={post.authors.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-[#ecfdf5] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#40916C]" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{post.authors.name}</p>
                  <p className="text-sm text-gray-500">
                    {post.published_at && formatDate(post.published_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="relative h-48">
          {post.thumbnail_url ? (
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#ff6b35] to-[#ffb396] flex items-center justify-center">
              <span className="text-white text-4xl font-bold opacity-20">U</span>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge className={getCategoryColor(post.category)}>
              {getCategoryLabel(post.category)}
            </Badge>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getReadingTime(post.body)} min
            </span>
          </div>
          <h3 className="font-bold text-gray-900 group-hover:text-[#2563eb] transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {post.excerpt || post.body.replace(/<[^>]*>/g, '').slice(0, 120)}
          </p>
          <div className="flex items-center gap-2 mt-auto">
            {post.authors.avatar_url ? (
              <Image
                src={post.authors.avatar_url}
                alt={post.authors.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-[#ecfdf5] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-[#40916C]" />
              </div>
            )}
            <div className="text-sm">
              <p className="font-medium text-gray-900">{post.authors.name}</p>
              <p className="text-xs text-gray-500">
                {post.published_at && formatDate(post.published_at)}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
