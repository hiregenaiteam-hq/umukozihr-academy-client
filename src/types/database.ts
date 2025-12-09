export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'editor' | 'author' | 'reader'
export type PostStatus = 'draft' | 'pending' | 'published'
export type PostCategory = 'hr' | 'talent' | 'team'
export type EventType = 'post_opened' | 'post_scrolled' | 'post_shared' | 'cta_clicked'

export interface Database {
  public: {
    Tables: {
      authors: {
        Row: {
          id: string
          supabase_user_id: string | null
          name: string
          email: string
          bio: string | null
          avatar_url: string | null
          approved: boolean
          role: UserRole
          linkedin_url: string | null
          organization: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supabase_user_id?: string | null
          name: string
          email: string
          bio?: string | null
          avatar_url?: string | null
          approved?: boolean
          role?: UserRole
          linkedin_url?: string | null
          organization?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supabase_user_id?: string | null
          name?: string
          email?: string
          bio?: string | null
          avatar_url?: string | null
          approved?: boolean
          role?: UserRole
          linkedin_url?: string | null
          organization?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          slug: string
          title: string
          body: string
          excerpt: string | null
          status: PostStatus
          author_id: string
          category: PostCategory
          thumbnail_url: string | null
          featured: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          body: string
          excerpt?: string | null
          status?: PostStatus
          author_id: string
          category: PostCategory
          thumbnail_url?: string | null
          featured?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          body?: string
          excerpt?: string | null
          status?: PostStatus
          author_id?: string
          category?: PostCategory
          thumbnail_url?: string | null
          featured?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: number
          event_type: EventType
          post_id: string | null
          author_id: string | null
          anon_id: string | null
          meta: Json | null
          created_at: string
        }
        Insert: {
          id?: number
          event_type: EventType
          post_id?: string | null
          author_id?: string | null
          anon_id?: string | null
          meta?: Json | null
          created_at?: string
        }
        Update: {
          id?: number
          event_type?: EventType
          post_id?: string | null
          author_id?: string | null
          anon_id?: string | null
          meta?: Json | null
          created_at?: string
        }
      }
      post_aggregates: {
        Row: {
          post_id: string
          day: string
          views: number
          uniques: number
          avg_time: number | null
          scroll_50: number
          shares: number
          cta_clicks: number
        }
        Insert: {
          post_id: string
          day: string
          views?: number
          uniques?: number
          avg_time?: number | null
          scroll_50?: number
          shares?: number
          cta_clicks?: number
        }
        Update: {
          post_id?: string
          day?: string
          views?: number
          uniques?: number
          avg_time?: number | null
          scroll_50?: number
          shares?: number
          cta_clicks?: number
        }
      }
      submission_queue: {
        Row: {
          id: string
          name: string
          email: string
          bio: string | null
          linkedin_url: string | null
          organization: string | null
          reason: string | null
          status: 'pending' | 'approved' | 'rejected'
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          bio?: string | null
          linkedin_url?: string | null
          organization?: string | null
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          bio?: string | null
          linkedin_url?: string | null
          organization?: string | null
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      post_status: PostStatus
      post_category: PostCategory
      event_type: EventType
    }
  }
}

export type Author = Database['public']['Tables']['authors']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type PostAggregate = Database['public']['Tables']['post_aggregates']['Row']
export type SubmissionQueue = Database['public']['Tables']['submission_queue']['Row']

export type PostWithAuthor = Post & {
  authors: Author
}
