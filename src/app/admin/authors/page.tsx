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
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
      case 'editor':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      case 'author':
        return 'bg-green-500/20 text-green-400 border border-green-500/30'
      default:
        return 'glass-card text-[var(--text-secondary)]'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
          </div>
        </div>
      </div>
    )
  }

  const approvedCount = authors.filter(a => a.approved).length
  const pendingCount = authors.filter(a => !a.approved).length

  return (
    <div className="min-h-screen py-8 relative">
      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-80 h-80 bg-[var(--primary)] opacity-10 -top-10 -right-10" />
        <div className="floating-orb w-48 h-48 bg-[var(--accent)] opacity-10 bottom-20 left-10 animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Authors</h1>
              <p className="text-[var(--text-secondary)]">Manage contributor accounts</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--primary-light)]">{authors.length}</p>
                <p className="text-sm text-[var(--text-secondary)]">Total Authors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{approvedCount}</p>
                <p className="text-sm text-[var(--text-secondary)]">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
                <p className="text-sm text-[var(--text-secondary)]">Pending Approval</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search by name, email, or organization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 glass-card rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === 'all' 
                      ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg' 
                      : 'glass-card text-[var(--text-secondary)] hover:border-[var(--primary)]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('approved')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === 'approved' 
                      ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg' 
                      : 'glass-card text-[var(--text-secondary)] hover:border-[var(--primary)]'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === 'pending' 
                      ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg' 
                      : 'glass-card text-[var(--text-secondary)] hover:border-[var(--primary)]'
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
            <div className="divide-y divide-[var(--glass-border)]">
              {filteredAuthors.map((author) => (
                <div
                  key={author.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-full flex items-center justify-center">
                      {author.avatar_url ? (
                        <img
                          src={author.avatar_url}
                          alt={author.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-lg">
                          {author.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[var(--text-primary)]">{author.name}</p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadgeColor(author.role)}`}>
                          {author.role}
                        </span>
                        {!author.approved && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
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
                        className="p-2 text-[var(--text-muted)] hover:text-blue-400 transition-colors"
                        title="LinkedIn Profile"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={`mailto:${author.email}`}
                      className="p-2 text-[var(--text-muted)] hover:text-[var(--primary-light)] transition-colors"
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
                            className="px-3 py-1.5 text-sm glass-card rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No authors found</h3>
              <p className="text-[var(--text-secondary)]">
                {searchQuery ? 'Try a different search term.' : 'No authors match the current filter.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
