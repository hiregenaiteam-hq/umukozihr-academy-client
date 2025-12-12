'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Textarea, Card, CardContent, CardHeader } from '@/components/ui'
import { CheckCircle, BookOpen, Sparkles, Users, Target, PenTool, Linkedin } from 'lucide-react'

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
      <div className="flex-1 flex items-center justify-center py-16 px-4 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="floating-orb w-72 h-72 bg-[var(--primary)] opacity-20 top-10 -left-10" />
          <div className="floating-orb w-48 h-48 bg-[var(--accent)] opacity-15 bottom-20 right-10 animation-delay-2000" />
        </div>
        <div className="w-full max-w-md text-center relative">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <p className="text-[var(--text-secondary)] mb-6 text-lg">
            Thank you for your interest in becoming a contributor. We&apos;ll review your application and get back to you within 5 business days.
          </p>
          <p className="text-sm text-[var(--text-muted)] glass-card rounded-xl px-4 py-3 inline-block">
            Check your email at <strong className="text-[var(--primary-light)]">{formData.email}</strong> for updates.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-4 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-80 h-80 bg-[var(--primary)] opacity-15 -top-20 -left-20" />
        <div className="floating-orb w-64 h-64 bg-[var(--accent)] opacity-10 top-1/3 right-0 animation-delay-2000" />
      </div>

      <div className="max-w-2xl mx-auto relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm mb-6">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-[var(--text-muted)]">Join Our Expert Community</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Apply to Become a Recognised <span className="gradient-text">HR Voice in Africa</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            Share your expertise with thousands of HR professionals and job seekers across the continent. Join our community of thought leaders.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Contributor Application</h2>
                <p className="text-sm text-[var(--text-muted)]">
                  We review all applications within 5 business days.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 glass-card border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-5">
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

              <div className="grid md:grid-cols-2 gap-5">
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

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-[var(--primary-light)]" />
                  <strong className="text-[var(--text-primary)]">What we look for:</strong>
                </div>
                <ul className="grid md:grid-cols-2 gap-3">
                  {[
                    { icon: Users, text: '10+ years of HR experience' },
                    { icon: Sparkles, text: 'Unique insights on African hiring practices' },
                    { icon: PenTool, text: 'Clear, practical writing style' },
                    { icon: Linkedin, text: 'Active LinkedIn presence' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <item.icon className="w-4 h-4 text-[var(--accent)]" />
                      {item.text}
                    </li>
                  ))}
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
