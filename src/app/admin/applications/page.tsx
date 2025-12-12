import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button, Badge, Card, CardContent } from '@/components/ui'
import { ArrowLeft, Check, X, Linkedin, UserPlus } from 'lucide-react'
import type { Author, SubmissionQueue } from '@/types/database'

async function approveApplication(formData: FormData) {
  'use server'

  const id = formData.get('id') as string
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: adminAuthor } = await supabase
    .from('authors')
    .select('id')
    .eq('supabase_user_id', user.id)
    .single() as { data: { id: string } | null }

  if (!adminAuthor) return

  const { data: application } = await supabase
    .from('submission_queue')
    .select('*')
    .eq('id', id)
    .single() as { data: SubmissionQueue | null }

  if (!application) return

  await supabase.from('authors').insert({
    name: application.name,
    email: application.email,
    bio: application.bio,
    linkedin_url: application.linkedin_url,
    organization: application.organization,
    approved: true,
    role: 'author',
  } as never)

  await supabase
    .from('submission_queue')
    .update({
      status: 'approved',
      reviewed_by: adminAuthor.id,
      reviewed_at: new Date().toISOString(),
    } as never)
    .eq('id', id)
}

async function rejectApplication(formData: FormData) {
  'use server'

  const id = formData.get('id') as string
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: adminAuthor } = await supabase
    .from('authors')
    .select('id')
    .eq('supabase_user_id', user.id)
    .single() as { data: { id: string } | null }

  if (!adminAuthor) return

  await supabase
    .from('submission_queue')
    .update({
      status: 'rejected',
      reviewed_by: adminAuthor.id,
      reviewed_at: new Date().toISOString(),
    } as never)
    .eq('id', id)
}

export default async function ApplicationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: author } = await supabase
    .from('authors')
    .select('*')
    .eq('supabase_user_id', user.id)
    .single() as { data: Author | null }

  if (!author || (author.role !== 'admin' && author.role !== 'editor')) {
    redirect('/dashboard')
  }

  const { data: applications } = await supabase
    .from('submission_queue')
    .select('*')
    .order('created_at', { ascending: false }) as { data: SubmissionQueue[] | null }

  const pendingApps = applications?.filter((a) => a.status === 'pending') || []
  const reviewedApps = applications?.filter((a) => a.status !== 'pending') || []

  return (
    <div className="min-h-screen py-8 relative">
      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-80 h-80 bg-[var(--primary)] opacity-10 -top-10 -right-10" />
        <div className="floating-orb w-48 h-48 bg-[var(--accent)] opacity-10 bottom-20 left-10 animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Contributor Applications</h1>
            <p className="text-[var(--text-secondary)]">Review and approve new contributors</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Pending ({pendingApps.length})
            </h2>
            {pendingApps.length > 0 ? (
              <div className="space-y-4">
                {pendingApps.map((app) => (
                  <Card key={app.id} className="hover:border-[var(--primary)] transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-[var(--text-primary)]">{app.name}</h3>
                            <Badge variant="warning">Pending</Badge>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] mb-2">{app.email}</p>
                          {app.organization && (
                            <p className="text-sm text-[var(--text-muted)] mb-2">{app.organization}</p>
                          )}
                          {app.linkedin_url && (
                            <a
                              href={app.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 mb-3 transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                              LinkedIn Profile
                            </a>
                          )}
                          {app.bio && (
                            <p className="text-sm text-[var(--text-secondary)] mb-3">{app.bio}</p>
                          )}
                          {app.reason && (
                            <div className="glass-card rounded-xl p-4">
                              <p className="text-xs text-[var(--text-muted)] mb-1">Why they want to contribute:</p>
                              <p className="text-sm text-[var(--text-secondary)]">{app.reason}</p>
                            </div>
                          )}
                          <p className="text-xs text-[var(--text-muted)] mt-3">
                            Applied: {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <form action={approveApplication}>
                            <input type="hidden" name="id" value={app.id} />
                            <Button type="submit" size="sm">
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          </form>
                          <form action={rejectApplication}>
                            <input type="hidden" name="id" value={app.id} />
                            <Button type="submit" variant="outline" size="sm">
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </form>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-[var(--text-muted)]">No pending applications</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Reviewed ({reviewedApps.length})
            </h2>
            {reviewedApps.length > 0 ? (
              <div className="space-y-4">
                {reviewedApps.map((app) => (
                  <Card key={app.id} className="opacity-75">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-[var(--text-primary)]">{app.name}</h3>
                            <Badge
                              variant={app.status === 'approved' ? 'success' : 'danger'}
                            >
                              {app.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">{app.email}</p>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                          {app.reviewed_at &&
                            new Date(app.reviewed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-[var(--text-muted)]">
                  No reviewed applications yet
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
