import type { Metadata } from 'next'
import { Shield, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'UmukoziHR Academy Privacy Policy - How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="py-16 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-72 h-72 bg-[var(--primary)] opacity-15 -top-10 -left-10" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm mb-6">
            <Shield className="w-4 h-4 text-[var(--primary-light)]" />
            <span className="text-[var(--text-muted)]">Legal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">Privacy Policy</h1>
          <p className="text-[var(--text-muted)]">Last updated: December 2024</p>
        </div>

        <div className="prose">
          <section className="glass-card rounded-2xl p-8 mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">1. Introduction</h2>
            <p className="text-[var(--text-secondary)]">
              UmukoziHR Academy (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website academy.umukozihr.com.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-8 mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Personal Information</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              When you register as a contributor or interact with our platform, we may collect:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] mb-4 space-y-2">
              <li>Name and email address</li>
              <li>Professional information (organization, LinkedIn profile)</li>
              <li>Biography and professional background</li>
              <li>Content you submit (articles, comments)</li>
            </ul>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Automatically Collected Information</h3>
            <p className="text-[var(--text-secondary)] mb-4">When you visit our website, we automatically collect:</p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2">
              <li>Browser type and version</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Anonymous analytics data (page views, scroll depth)</li>
            </ul>
          </section>

          <section className="glass-card rounded-2xl p-8 mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">3. How We Use Your Information</h2>
            <p className="text-[var(--text-secondary)] mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2">
              <li>Provide, operate, and maintain our platform</li>
              <li>Process contributor applications and manage author accounts</li>
              <li>Publish and attribute content to authors</li>
              <li>Improve our website and user experience</li>
              <li>Communicate with you about your account or content</li>
              <li>Analyze usage patterns to improve our content strategy</li>
            </ul>
          </section>

          <section className="glass-card rounded-2xl p-8 mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">4. Information Sharing</h2>
            <p className="text-[var(--text-secondary)] mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2">
              <li>With your consent</li>
              <li>To display your public author profile and published content</li>
              <li>With service providers who assist in operating our platform</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="glass-card rounded-2xl p-8 mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">5. Data Security</h2>
            <p className="text-[var(--text-secondary)]">
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-8 mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">6. Your Rights</h2>
            <p className="text-[var(--text-secondary)] mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section className="glass-card rounded-2xl p-8 mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">7. Cookies</h2>
            <p className="text-[var(--text-secondary)]">
              We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and maintain session information. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-8 mb-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">8. Changes to This Policy</h2>
            <p className="text-[var(--text-secondary)]">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="glass-card rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">9. Contact Us</h2>
            <p className="text-[var(--text-secondary)]">
              If you have any questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:team@umukozihr.com" className="text-[var(--secondary-light)] hover:underline">team@umukozihr.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
