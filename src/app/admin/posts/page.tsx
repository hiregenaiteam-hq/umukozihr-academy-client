'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Card, CardContent } from '@/components/ui'
import { ArrowLeft, FileText, Search, Eye, PenSquare, Check, X, ExternalLink, Loader2, Trash2 } from 'lucide-react'
import type { Author, Post, PostWithAuthor, PostStatus } from '@/types/database'

export default function AdminPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [filteredPosts, setFilteredPosts] = useState<PostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | PostStatus>('all')
  const [currentUser, setCurrentUser] = useState<Author | null>(null)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: author } = await supabase
      .from('authors')
      .select('*')
      .eq('supabase_user_id', user.id)
      .single() as { data: Author | null }

    if (!author || (author.role !== 'admin' && author.role !== 'editor')) {
      router.push('/dashboard')
      return
    }

    setCurrentUser(author)

    const { data: postsList } = await supabase
      .from('posts')
      .select('*, authors(*)')
      .order('created_at', { ascending: false })

    setPosts((postsList || []) as PostWithAuthor[])
    setLoading(false)
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    let result = posts
    
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.authors?.name?.toLowerCase().includes(query)
      )
    }
    
    setFilteredPosts(result)
  }, [posts, statusFilter, searchQuery])

  const updatePostStatus = async (postId: string, status: PostStatus) => {
    setActionLoading(postId)
    const supabase = createClient()
    
    const updates: Partial<Post> = { status }
    if (status === 'published') {
      updates.published_at = new Date().toISOString()
    }
    
    await supabase
      .from('posts')
      .update(updates as never)
      .eq('id', postId)
    
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, ...updates } : p
    ))
    setActionLoading(null)
  }

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }
    
    setActionLoading(postId)
    const supabase = createClient()
    
    await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
    
    setPosts(prev => prev.filter(p => p.id !== postId))
    setActionLoading(null)
  }

  const toggleFeatured = async (postId: string, featured: boolean) => {
    setActionLoading(postId)
    const supabase = createClient()
    
    const { error } = await supabase
      .from('posts')
      .update({ featured: !featured } as never)
      .eq('id', postId)
    
    if (error) {
      console.error('Failed to toggle featured:', error)
      alert('Failed to update featured status. Please try again.')
      setActionLoading(null)
      return
    }
    
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, featured: !featured } : p
    ))
    setActionLoading(null)
  }

  const getStatusBadgeColor = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'hr':
        return 'HR Leadership'
      case 'talent':
        return 'Talent Guidance'
      case 'team':
        return 'From the Team'
      default:
        return category
    }
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#40916C]" />
          </div>
        </div>
      </div>
    )
  }

  const publishedCount = posts.filter(p => p.status === 'published').length
  const pendingCount = posts.filter(p => p.status === 'pending').length
  const draftCount = posts.filter(p => p.status === 'draft').length

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Posts</h1>
              <p className="text-gray-600">Manage and moderate all articles</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1B4332]">{posts.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
                <p className="text-sm text-gray-600">Published</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{draftCount}</p>
                <p className="text-sm text-gray-600">Drafts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40916C] focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'published', 'pending', 'draft'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status 
                        ? 'bg-[#1B4332] text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredPosts.length > 0 ? (
          <Card>
            <div className="divide-y divide-gray-100">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 truncate">
                        {post.title || 'Untitled'}
                      </p>
                      {post.featured && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{post.authors?.name || 'Unknown Author'}</span>
                      <span>•</span>
                      <span>{getCategoryLabel(post.category)}</span>
                      <span>•</span>
                      <span>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(post.status)}`}>
                      {post.status}
                    </span>
                    
                    {post.status === 'published' && (
                      <Link 
                        href={`/post/${post.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-[#1B4332] transition-colors"
                        title="View post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    
                    {post.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updatePostStatus(post.id, 'published')}
                          disabled={actionLoading === post.id}
                          title="Approve & Publish"
                        >
                          {actionLoading === post.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updatePostStatus(post.id, 'draft')}
                          disabled={actionLoading === post.id}
                          title="Reject to Draft"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    {post.status === 'published' && (
                      <button
                        onClick={() => toggleFeatured(post.id, post.featured)}
                        disabled={actionLoading === post.id}
                        className={`p-2 rounded transition-colors ${
                          post.featured 
                            ? 'text-purple-600 bg-purple-50 hover:bg-purple-100' 
                            : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                        title={post.featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        ★
                      </button>
                    )}
                    
                    <button
                      onClick={() => deletePost(post.id)}
                      disabled={actionLoading === post.id}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try a different search term.' : 'No posts match the current filter.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
