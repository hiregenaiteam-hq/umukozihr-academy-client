'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ChevronDown, User, LogOut, Settings, PenSquare } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'HR Leadership', href: '/category/hr' },
  { name: 'Talent Guidance', href: '/category/talent' },
  { name: 'From the Team', href: '/category/team' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, author, isApprovedAuthor, isAdmin, signOut } = useAuth()

  return (
    <header className="glass-nav sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow overflow-hidden">
                <Image
                  src="/media/logo.png"
                  alt="UmukoziHR"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-bold text-xl text-[var(--text-primary)] tracking-tight">UmukoziHR</span>
                <span className="text-[#3B82F6] text-xs font-semibold tracking-wide">Academy</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-[var(--glass-bg)] backdrop-blur-sm rounded-full px-2 py-1.5 border border-[var(--glass-border)]">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200',
                  pathname === item.href
                    ? 'bg-[var(--primary)] text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)]'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--primary)] transition-all text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center">
                    {author?.avatar_url ? (
                      <img src={author.avatar_url} alt={author.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="max-w-[120px] truncate">{author?.name || user.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-card py-2 z-50">
                    {isApprovedAuthor && (
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)] transition-colors"
                      >
                        <PenSquare className="w-4 h-4" />
                        Dashboard
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)] transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut() }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--glass-bg-hover)] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="btn-ghost">Sign in</Button>
                </Link>
                <Link href="/apply">
                  <Button size="sm" className="btn-primary">Become a Contributor</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--glass-border)] bg-[var(--background-secondary)]">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-xl text-base font-medium transition-all',
                  pathname === item.href
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)]'
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-[var(--glass-border)] space-y-2">
              {user ? (
                <>
                  {isApprovedAuthor && (
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--glass-bg)]">
                      Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--glass-bg)]">
                      Admin
                    </Link>
                  )}
                  <button onClick={() => { setMobileMenuOpen(false); signOut() }} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-[var(--accent)] hover:bg-[var(--glass-bg)]">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--glass-bg)]">
                    Sign in
                  </Link>
                  <Link href="/apply" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium bg-[var(--accent)] text-white text-center">
                    Become a Contributor
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
