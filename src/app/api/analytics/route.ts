import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_type, post_id, meta } = body

    if (!event_type) {
      return NextResponse.json({ error: 'event_type is required' }, { status: 400 })
    }

    const validEventTypes = ['post_opened', 'post_scrolled', 'post_shared', 'cta_clicked']
    if (!validEventTypes.includes(event_type)) {
      return NextResponse.json({ error: 'Invalid event_type' }, { status: 400 })
    }

    const anon_id = request.cookies.get('anon_id')?.value || null

    const supabase = await createServiceClient()

    const { error } = await supabase.from('events').insert({
      event_type,
      post_id: post_id || null,
      anon_id,
      meta: meta || null,
    } as never)

    if (error) {
      console.error('Analytics insert error:', error)
      return NextResponse.json({ error: 'Failed to record event' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
