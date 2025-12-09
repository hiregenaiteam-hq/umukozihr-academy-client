'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { Button, Input, Select, Card, CardContent, CardHeader } from '@/components/ui'
import { generateSlug } from '@/lib/utils'
import { ArrowLeft, Save, Send, Eye, Upload, Loader2, X } from 'lucide-react'
import Link from 'next/link'

import type { Post } from '@/types/database'

const TiptapEditor = dynamic(
  () => import('@/components/editor/tiptap-editor').then((mod) => mod.TiptapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="border border-gray-200 rounded-lg bg-white min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#40916C] animate-spin mx-auto mb-2" />
          <p className="text-gray-500">Loading editor...</p>
        </div>
      </div>
    ),
  }
)

const AUTOSAVE_KEY = 'umukozihr_draft_'

const categoryOptions = [
  { value: 'hr', label: 'HR Leadership' },
  { value: 'talent', label: 'Talent Guidance' },
  { value: 'team', label: 'From the Team' },
]

function WritePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')
  const { author, isEditor, isLoading: authLoading, user } = useAuth()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    category: 'hr' as 'hr' | 'talent' | 'team',
    thumbnail_url: '',
  })

  const storageKey = `${AUTOSAVE_KEY}${postId || 'new'}`

  // Load from localStorage on mount (before DB load)
  useEffect(() => {
    const savedDraft = localStorage.getItem(storageKey)
    if (savedDraft && !postId) {
      try {
        const parsed = JSON.parse(savedDraft)
        setFormData(parsed)
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [storageKey, postId])

  // Auto-save to localStorage with debounce
  useEffect(() => {
    if (!formData.title && !formData.body) return

    const timeoutId = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(formData))
      setLastSaved(new Date())
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [formData, storageKey])

  // Clear localStorage after successful save to DB
  const clearLocalDraft = useCallback(() => {
    localStorage.removeItem(storageKey)
  }, [storageKey])

  useEffect(() => {
    if (postId) {
      loadPost()
    }
  }, [postId])

  const loadPost = async () => {
    if (!postId) return
    setIsLoading(true)

    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single() as { data: Post | null; error: unknown }

    setIsLoading(false)

    if (error || !post) {
      setError('Failed to load post')
      return
    }

    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      body: post.body || '',
      category: post.category || 'hr',
      thumbnail_url: post.thumbnail_url || '',
    })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: postId ? prev.slug : generateSlug(title),
    }))
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    if (!author) throw new Error('Not authenticated')

    const fileExt = file.name.split('.').pop()
    const fileName = `${author.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from('media').getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !author) return

    setIsUploadingThumbnail(true)
    setUploadProgress(0)
    setError('')

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${author.id}/${Date.now()}.${fileExt}`

      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const uploadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/media/${fileName}`

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100)
            setUploadProgress(percent)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error('Upload failed'))
          }
        })

        xhr.addEventListener('error', () => reject(new Error('Upload failed')))

        xhr.open('POST', uploadUrl)
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.setRequestHeader('x-upsert', 'true')
        xhr.send(file)
      })

      const { data } = supabase.storage.from('media').getPublicUrl(fileName)
      setFormData((prev) => ({ ...prev, thumbnail_url: data.publicUrl }))
    } catch {
      setError('Failed to upload thumbnail')
    } finally {
      setIsUploadingThumbnail(false)
      setUploadProgress(0)
    }
  }

  const savePost = async (status: 'draft' | 'pending' | 'published') => {
    if (!author) {
      setError('You must be logged in')
      return
    }

    if (!formData.title || !formData.body) {
      setError('Title and content are required')
      return
    }

    setIsSaving(true)
    setError('')

    const postData = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.excerpt || formData.body.replace(/<[^>]*>/g, '').slice(0, 200),
      body: formData.body,
      category: formData.category,
      thumbnail_url: formData.thumbnail_url || null,
      author_id: author.id,
      status: isEditor && status === 'pending' ? 'published' : status,
    }

    let result

    if (postId) {
      result = await supabase
        .from('posts')
        .update(postData as never)
        .eq('id', postId)
        .select()
        .single()
    } else {
      result = await supabase
        .from('posts')
        .insert(postData as never)
        .select()
        .single()
    }

    if (result.error) {
      setError('Failed to save post')
      setIsSaving(false)
      return
    }

    setIsSaving(false)
    clearLocalDraft()

    if (status === 'pending' || status === 'published') {
      router.push('/dashboard')
    } else if (!postId && result.data) {
      router.replace(`/dashboard/write?id=${(result.data as { id: string }).id}`)
    }
  }

  // Redirect to login if not authenticated after loading
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/dashboard/write' + (postId ? `?id=${postId}` : ''))
    }
  }, [authLoading, user, router, postId])

  if (authLoading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="w-8 h-8 text-[#40916C] animate-spin mx-auto mb-2" />
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    )
  }

  if (!author) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="w-8 h-8 text-[#40916C] animate-spin mx-auto mb-2" />
        <p className="text-gray-600">Loading author profile...</p>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => savePost('draft')}
              isLoading={isSaving}
              disabled={isLoading || !formData.title}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            {(formData.title && formData.body) && (
              <Button variant="ghost" onClick={() => setShowPreview(true)}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            )}
            <Button
              onClick={() => savePost(isEditor ? 'published' : 'pending')}
              isLoading={isSaving}
              disabled={isLoading || !formData.title || !formData.body}
            >
              <Send className="w-4 h-4 mr-2" />
              {isEditor ? 'Publish' : 'Submit for Review'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {lastSaved && (
          <div className="mb-4 text-xs text-gray-500">
            Auto-saved locally at {lastSaved.toLocaleTimeString()}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Input
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Article title..."
              className="text-2xl font-bold border-0 border-b rounded-none px-0 focus:ring-0"
            />

            <TiptapEditor
              content={formData.body}
              onChange={(content) => setFormData((prev) => ({ ...prev, body: content }))}
              onImageUpload={handleImageUpload}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Post Settings</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  id="slug"
                  label="URL Slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="article-url-slug"
                />

                <Select
                  id="category"
                  label="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value as 'hr' | 'talent' | 'team',
                    }))
                  }
                  options={categoryOptions}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail
                  </label>
                  {isUploadingThumbnail ? (
                    <div className="w-full h-32 border-2 border-dashed border-[#40916C] rounded-lg flex flex-col items-center justify-center bg-[#ecfdf5]">
                      <Loader2 className="w-8 h-8 text-[#40916C] animate-spin mb-2" />
                      <span className="text-sm text-[#40916C] font-medium">{uploadProgress}%</span>
                      <div className="w-3/4 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-[#40916C] transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : formData.thumbnail_url ? (
                    <div className="relative">
                      <img
                        src={formData.thumbnail_url}
                        alt="Thumbnail"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, thumbnail_url: '' }))
                        }
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#40916C] transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Upload thumbnail</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold">Excerpt</h3>
              </CardHeader>
              <CardContent>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  placeholder="Brief description of your article..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-lg">Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <article className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {formData.title || 'Untitled Article'}
                </h1>
                {formData.thumbnail_url && (
                  <img
                    src={formData.thumbnail_url}
                    alt="Thumbnail"
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                )}
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.body || '<p>No content yet...</p>' }}
                />
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="py-12 text-center"><p className="text-gray-600">Loading...</p></div>}>
      <WritePageContent />
    </Suspense>
  )
}
