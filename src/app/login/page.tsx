'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button, Input, Card, CardContent } from '@/components/ui'
import { BookOpen, Sparkles } from 'lucide-react'

function LoginPageContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    router.push(redirect)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative">
      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-72 h-72 bg-[var(--primary)] opacity-20 -top-10 -left-10" />
        <div className="floating-orb w-48 h-48 bg-[var(--accent)] opacity-15 bottom-20 right-10 animation-delay-2000" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-[var(--text-primary)]">UmukoziHR</span>
              <span className="text-[var(--secondary-light)] text-sm ml-1">Academy</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Welcome back</h1>
          <p className="text-[var(--text-secondary)]">Sign in to your UmukoziHR Academy account</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 glass-card border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Input
                id="email"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />

              <Input
                id="password"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign in
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
              Not a contributor yet?{' '}
              <Link href="/apply" className="text-[var(--primary-light)] font-medium hover:underline">
                Apply to contribute
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><p className="text-[var(--text-secondary)]">Loading...</p></div>}>
      <LoginPageContent />
    </Suspense>
  )
}
