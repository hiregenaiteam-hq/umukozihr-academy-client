import Link from 'next/link'
import Image from 'next/image'
import { formatDate, getCategoryLabel, getCategoryColor, getReadingTime } from '@/lib/utils'
import type { PostWithAuthor } from '@/types/database'
import { Badge } from '@/components/ui'
import { Clock, User, ArrowRight, BookOpen } from 'lucide-react'

interface PostCardProps {
  post: PostWithAuthor
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link href={'/post/' + post.slug} className="group block">
        <article className="glass-card rounded-3xl overflow-hidden hover:border-[var(--primary)] transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-72 md:h-full">
              {post.thumbnail_url ? (
                <Image
                  src={post.thumbnail_url}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-5">
                <Badge className={getCategoryColor(post.category) + ' bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)]'}>
                  {getCategoryLabel(post.category)}
                </Badge>
                <span className="text-sm text-[var(--text-muted)] flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {getReadingTime(post.body)} min read
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary-light)] transition-colors mb-4 leading-tight">
                {post.title}
              </h2>
              <p className="text-[var(--text-secondary)] mb-6 line-clamp-3 leading-relaxed">
                {post.excerpt || post.body.replace(/<[^>]*>/g, '').slice(0, 200)}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                  {post.authors.avatar_url ? (
                    <Image
                      src={post.authors.avatar_url}
                      alt={post.authors.name}
                      width={44}
                      height={44}
                      className="rounded-full border-2 border-[var(--glass-border)]"
                    />
                  ) : (
                    <div className="w-11 h-11 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{post.authors.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {post.published_at && formatDate(post.published_at)}
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-[var(--primary-light)] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Read article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={'/post/' + post.slug} className="group block h-full">
      <article className="glass-card rounded-2xl overflow-hidden h-full flex flex-col hover:border-[var(--primary)] hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-52">
          {post.thumbnail_url ? (
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-white/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge className={getCategoryColor(post.category) + ' bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)]'}>
              {getCategoryLabel(post.category)}
            </Badge>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getReadingTime(post.body)} min
            </span>
          </div>
          <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--primary-light)] transition-colors mb-3 line-clamp-2 leading-snug">
            {post.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-5 line-clamp-2 flex-1">
            {post.excerpt || post.body.replace(/<[^>]*>/g, '').slice(0, 120)}
          </p>
          <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[var(--glass-border)]">
            {post.authors.avatar_url ? (
              <Image
                src={post.authors.avatar_url}
                alt={post.authors.name}
                width={36}
                height={36}
                className="rounded-full border border-[var(--glass-border)]"
              />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="text-sm">
              <p className="font-medium text-[var(--text-primary)]">{post.authors.name}</p>
              <p className="text-xs text-[var(--text-muted)]">
                {post.published_at && formatDate(post.published_at)}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
