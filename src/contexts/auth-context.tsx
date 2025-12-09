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
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchAuthor(session.user.id)
      }
      
      setIsLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
      }
    )

    return () => {
      subscription.unsubscribe()
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
