'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button, Card, CardContent } from '@/components/ui'
import { ArrowLeft, Users, Shield, UserCheck, UserX, Search, Mail, ExternalLink, Loader2 } from 'lucide-react'
import type { Author, UserRole } from '@/types/database'

export default function AdminAuthorsPage() {
  const router = useRouter()
  const [authors, setAuthors] = useState<Author[]>([])
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all')
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

    setCurrentUser(author as Author)

    const { data: authorsList } = await supabase
      .from('authors')
      .select('*')
      .order('created_at', { ascending: false })

    setAuthors((authorsList || []) as Author[])
    setLoading(false)
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    let result = authors
    
    if (filter === 'approved') {
      result = result.filter(a => a.approved)
    } else if (filter === 'pending') {
      result = result.filter(a => !a.approved)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(a => 
        a.name.toLowerCase().includes(query) || 
        a.email.toLowerCase().includes(query) ||
        (a.organization?.toLowerCase().includes(query) ?? false)
      )
    }
    
    setFilteredAuthors(result)
  }, [authors, filter, searchQuery])

  const updateAuthor = async (authorId: string, updates: Partial<Author>) => {
    setActionLoading(authorId)
    const supabase = createClient()
    
    await supabase
      .from('authors')
      .update(updates as never)
      .eq('id', authorId)
    
    setAuthors(prev => prev.map(a => 
      a.id === authorId ? { ...a, ...updates } : a
    ))
    setActionLoading(null)
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700'
      case 'editor':
        return 'bg-blue-100 text-blue-700'
      case 'author':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
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

  const approvedCount = authors.filter(a => a.approved).length
  const pendingCount = authors.filter(a => !a.approved).length

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
              <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
              <p className="text-gray-600">Manage contributor accounts</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1B4332]">{authors.length}</p>
                <p className="text-sm text-gray-600">Total Authors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                <p className="text-sm text-gray-600">Pending Approval</p>
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
                  placeholder="Search by name, email, or organization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40916C] focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-[#1B4332] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('approved')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'approved' 
                      ? 'bg-[#1B4332] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'pending' 
                      ? 'bg-[#1B4332] text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredAuthors.length > 0 ? (
          <Card>
            <div className="divide-y divide-gray-100">
              {filteredAuthors.map((author) => (
                <div
                  key={author.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#D8F3DC] rounded-full flex items-center justify-center">
                      {author.avatar_url ? (
                        <img
                          src={author.avatar_url}
                          alt={author.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-[#1B4332] font-semibold text-lg">
                          {author.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{author.name}</p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(author.role)}`}>
                          {author.role}
                        </span>
                        {!author.approved && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{author.email}</span>
                        {author.organization && (
                          <>
                            <span>•</span>
                            <span>{author.organization}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {author.linkedin_url && (
                      <a
                        href={author.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="LinkedIn Profile"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={`mailto:${author.email}`}
                      className="p-2 text-gray-400 hover:text-[#1B4332] transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    
                    {currentUser?.role === 'admin' && author.id !== currentUser.id && (
                      <>
                        {!author.approved ? (
                          <Button
                            size="sm"
                            onClick={() => updateAuthor(author.id, { approved: true })}
                            disabled={actionLoading === author.id}
                          >
                            {actionLoading === author.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                        ) : (
                          <select
                            value={author.role}
                            onChange={(e) => updateAuthor(author.id, { role: e.target.value as UserRole })}
                            disabled={actionLoading === author.id}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40916C]"
                          >
                            <option value="author">Author</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No authors found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try a different search term.' : 'No authors match the current filter.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
