import Link from 'next/link'
import { Linkedin, Twitter, BookOpen, Sparkles, ArrowUpRight } from 'lucide-react'

const footerLinks = {
  categories: [
    { name: 'HR Leadership', href: '/category/hr' },
    { name: 'Talent Guidance', href: '/category/talent' },
    { name: 'From the Team', href: '/category/team' },
  ],
  company: [
    { name: 'About UmukoziHR', href: 'https://umukozihr.com' },
    { name: 'Tailor', href: 'https://tailor.umukozihr.com' },
    { name: 'Jobs', href: 'https://jobs.umukozihr.com' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Floating Orb Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[var(--primary)] rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-10 right-1/4 w-48 h-48 bg-[var(--accent)] rounded-full opacity-10 blur-3xl" />
      </div>

      {/* Main Footer */}
      <div className="glass-card border-t border-b-0 border-x-0 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <div className="relative w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[var(--accent-glow)] transition-shadow duration-300">
                  <BookOpen className="w-6 h-6 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--secondary)] rounded-full flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <span className="font-bold text-xl text-[var(--text-primary)] block">UmukoziHR</span>
                  <span className="text-[var(--secondary-light)] text-sm font-medium">Academy</span>
                </div>
              </Link>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                Africa&apos;s HR knowledge commons. Educating talent and empowering recruiters with world-class insights.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://linkedin.com/company/umukozihr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--secondary-light)] hover:border-[var(--secondary)] transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/umukozihr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--secondary-light)] hover:border-[var(--secondary)] transition-all duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--primary)] rounded-full" />
                Categories
              </h3>
              <ul className="space-y-3">
                {footerLinks.categories.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[var(--text-secondary)] hover:text-[var(--primary-light)] transition-colors text-sm flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* UmukoziHR Products */}
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
                UmukoziHR
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-secondary)] hover:text-[var(--accent-light)] transition-colors text-sm flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--secondary)] rounded-full" />
                Legal
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[var(--text-secondary)] hover:text-[var(--secondary-light)] transition-colors text-sm flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="glass-card rounded-2xl mt-12 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[var(--text-muted)] text-sm">
              © {new Date().getFullYear()} UmukoziHR. All rights reserved.
            </p>
            <Link
              href="/apply"
              className="px-5 py-2.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] text-white font-medium rounded-xl text-sm hover:shadow-[var(--accent-glow)] transition-all duration-300 flex items-center gap-2"
            >
              Become a Recognised HR Voice in Africa
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
