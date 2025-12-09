'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import type { Author, Database } from '@/types/database'

type AuthorInsert = Database['public']['Tables']['authors']['Insert']

interface AuthContextType {
  user: User | null
  author: Author | null
  session: Session | null
  isLoading: boolean
  isAdmin: boolean
  isEditor: boolean
  isApprovedAuthor: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshAuthor: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [author, setAuthor] = useState<Author | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const fetchAuthor = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('authors')
      .select('*')
      .eq('supabase_user_id', userId)
      .single()
    
    setAuthor(data)
  }, [supabase])

  const refreshAuthor = useCallback(async () => {
    if (user?.id) {
      await fetchAuthor(user.id)
    }
  }, [user?.id, fetchAuthor])

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session error:', error)
        setIsLoading(false)
        return
      }

      // If we have a session, try to refresh it to ensure it's valid
      if (session) {
        const { data: { session: refreshedSession } } = await supabase.auth.refreshSession()
        if (refreshedSession) {
          setSession(refreshedSession)
          setUser(refreshedSession.user)
          await fetchAuthor(refreshedSession.user.id)
        } else {
          setSession(session)
          setUser(session.user)
          await fetchAuthor(session.user.id)
        }
      } else {
        setSession(null)
        setUser(null)
      }
      
      setIsLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchAuthor(session.user.id)
        } else {
          setAuthor(null)
        }

        if (event === 'SIGNED_OUT') {
          setAuthor(null)
        }
        
        // Handle token refresh
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully')
        }
      }
    )

    // Set up periodic session check every 10 minutes
    const intervalId = setInterval(async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (currentSession) {
        // Refresh if token will expire in less than 5 minutes
        const expiresAt = currentSession.expires_at
        if (expiresAt) {
          const expiresIn = expiresAt - Math.floor(Date.now() / 1000)
          if (expiresIn < 300) {
            await supabase.auth.refreshSession()
          }
        }
      }
    }, 10 * 60 * 1000) // Check every 10 minutes

    return () => {
      subscription.unsubscribe()
      clearInterval(intervalId)
    }
  }, [supabase, fetchAuthor])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error as Error | null }
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (!error && data.user) {
      const insertData: AuthorInsert = {
        supabase_user_id: data.user.id,
        email,
        name,
        approved: false,
        role: 'reader',
      }
      const { error: authorError } = await supabase.from('authors').insert(insertData as never)

      if (authorError) {
        return { error: authorError as unknown as Error }
      }
    }

    return { error: error as Error | null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAuthor(null)
    setSession(null)
  }

  const isAdmin = author?.role === 'admin' && author?.approved === true
  const isEditor = (author?.role === 'editor' || author?.role === 'admin') && author?.approved === true
  const isApprovedAuthor = author?.approved === true

  return (
    <AuthContext.Provider
      value={{
        user,
        author,
        session,
        isLoading,
        isAdmin,
        isEditor,
        isApprovedAuthor,
        signIn,
        signUp,
        signOut,
        refreshAuthor,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
