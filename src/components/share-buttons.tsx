'use client'

import { Linkedin, Twitter, Link2, Check } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[var(--text-muted)] mr-2">Share:</span>
      <button
        onClick={shareOnLinkedIn}
        className="p-2.5 glass-card rounded-xl text-[var(--text-muted)] hover:text-blue-400 hover:border-blue-400/50 transition-all"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </button>
      <button
        onClick={shareOnTwitter}
        className="p-2.5 glass-card rounded-xl text-[var(--text-muted)] hover:text-sky-400 hover:border-sky-400/50 transition-all"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-5 h-5" />
      </button>
      <button
        onClick={copyLink}
        className="p-2.5 glass-card rounded-xl text-[var(--text-muted)] hover:text-[var(--primary-light)] hover:border-[var(--primary)]/50 transition-all"
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-400" />
        ) : (
          <Link2 className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}
