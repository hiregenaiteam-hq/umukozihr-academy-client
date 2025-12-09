import Link from 'next/link'
import { Linkedin, Twitter } from 'lucide-react'

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
    <footer className="bg-[#1B4332] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#1B4332] font-bold text-lg">U</span>
              </div>
              <div>
                <span className="font-bold text-xl">UmukoziHR</span>
                <span className="text-[#D8F3DC] text-sm ml-1">Academy</span>
              </div>
            </div>
            <p className="text-[#B7E4C7] text-sm">
              Africa&apos;s HR knowledge commons. Educating talent and empowering recruiters.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://linkedin.com/company/umukozihr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B7E4C7] hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/umukozihr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B7E4C7] hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#B7E4C7] hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">UmukoziHR</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B7E4C7] hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#B7E4C7] hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#40916C] mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#B7E4C7] text-sm">
            © {new Date().getFullYear()} UmukoziHR. All rights reserved.
          </p>
          <Link
            href="/apply"
            className="text-[#D8F3DC] hover:text-white transition-colors text-sm font-medium"
          >
            Apply to Become a Recognised HR Voice in Africa →
          </Link>
        </div>
      </div>
    </footer>
  )
}
