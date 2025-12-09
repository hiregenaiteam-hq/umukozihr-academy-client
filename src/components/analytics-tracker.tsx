'use client'

import { useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface AnalyticsTrackerProps {
  postId: string
  postSlug: string
}

export function AnalyticsTracker({ postId, postSlug }: AnalyticsTrackerProps) {
  const hasTrackedOpen = useRef(false)
  const hasTrackedScroll50 = useRef(false)
  const startTime = useRef(Date.now())

  const getAnonId = useCallback(() => {
    let anonId = document.cookie
      .split('; ')
      .find((row) => row.startsWith('anon_id='))
      ?.split('=')[1]

    if (!anonId) {
      anonId = uuidv4()
      document.cookie = `anon_id=${anonId}; path=/; max-age=${60 * 60 * 24 * 365}`
    }

    return anonId
  }, [])

  const trackEvent = useCallback(
    async (eventType: string, meta?: Record<string, unknown>) => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: eventType,
            post_id: postId,
            meta: {
              ...meta,
              slug: postSlug,
              anon_id: getAnonId(),
            },
          }),
        })
      } catch (error) {
        console.error('Failed to track event:', error)
      }
    },
    [postId, postSlug, getAnonId]
  )

  useEffect(() => {
    if (!hasTrackedOpen.current) {
      hasTrackedOpen.current = true
      trackEvent('post_opened', {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      })
    }

    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

      if (scrollPercentage >= 50 && !hasTrackedScroll50.current) {
        hasTrackedScroll50.current = true
        trackEvent('post_scrolled', {
          scroll_percent: 50,
          time_on_page: Math.round((Date.now() - startTime.current) / 1000),
        })
      }
    }

    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTime.current) / 1000)
      if (timeOnPage > 5) {
        navigator.sendBeacon(
          '/api/analytics',
          JSON.stringify({
            event_type: 'post_scrolled',
            post_id: postId,
            meta: {
              slug: postSlug,
              time_on_page: timeOnPage,
              final: true,
            },
          })
        )
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [postId, postSlug, trackEvent])

  return null
}

export function useTrackShare(postId: string, postSlug: string) {
  const trackShare = useCallback(
    async (target: string) => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'post_shared',
            post_id: postId,
            meta: {
              slug: postSlug,
              target,
            },
          }),
        })
      } catch (error) {
        console.error('Failed to track share:', error)
      }
    },
    [postId, postSlug]
  )

  return { trackShare }
}

export function useTrackCTA(postId: string, postSlug: string) {
  const trackCTA = useCallback(
    async (ctaName: string, destination?: string) => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'cta_clicked',
            post_id: postId,
            meta: {
              slug: postSlug,
              cta_name: ctaName,
              destination,
            },
          }),
        })
      } catch (error) {
        console.error('Failed to track CTA:', error)
      }
    },
    [postId, postSlug]
  )

  return { trackCTA }
}
