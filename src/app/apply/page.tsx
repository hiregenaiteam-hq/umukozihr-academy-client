'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Textarea, Card, CardContent, CardHeader } from '@/components/ui'
import { CheckCircle } from 'lucide-react'

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    linkedin_url: '',
    bio: '',
    reason: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { error } = await supabase.from('submission_queue').insert({
      name: formData.name,
      email: formData.email,
      organization: formData.organization,
      linkedin_url: formData.linkedin_url,
      bio: formData.bio,
      reason: formData.reason,
      status: 'pending',
    } as never)

    if (error) {
      setError('Failed to submit application. Please try again.')
      setIsLoading(false)
      return
    }

    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#1B4332]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in becoming a contributor. We&apos;ll review your
            application and get back to you within 5 business days.
          </p>
          <p className="text-sm text-gray-500">
            Check your email at <strong>{formData.email}</strong> for updates.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Apply to Become a Recognised HR Voice in Africa
          </h1>
          <p className="text-lg text-gray-600">
            Share your expertise with thousands of HR professionals and job seekers across the
            continent. Join our community of thought leaders.
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Contributor Application</h2>
            <p className="text-sm text-gray-600">
              We review all applications within 5 business days.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  id="name"
                  name="name"
                  label="Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  id="organization"
                  name="organization"
                  label="Organization *"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Company or organization"
                  required
                />
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  label="LinkedIn Profile *"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  required
                />
              </div>

              <Textarea
                id="bio"
                name="bio"
                label="Bio *"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about your HR background and expertise..."
                rows={4}
                required
              />

              <Textarea
                id="reason"
                name="reason"
                label="Why do you want to contribute? *"
                value={formData.reason}
                onChange={handleChange}
                placeholder="What topics would you like to write about? What unique perspective can you bring?"
                rows={4}
                required
              />

              <div className="bg-[#D8F3DC] rounded-lg p-4 text-sm text-[#1B4332]">
                <strong>What we look for:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>10+ years of HR experience</li>
                  <li>Unique insights on African hiring practices</li>
                  <li>Clear, practical writing style</li>
                  <li>Active LinkedIn presence</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
