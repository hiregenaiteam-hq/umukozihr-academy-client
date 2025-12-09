import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    hr: 'HR Leadership',
    talent: 'Talent Guidance',
    team: 'From the Team',
  }
  return labels[category] || category
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    hr: 'bg-[#dbeafe] text-[#1d4ed8]',
    talent: 'bg-[#d1fae5] text-[#047857]',
    team: 'bg-[#ffedd5] text-[#c2410c]',
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}
