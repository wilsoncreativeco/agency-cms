import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService } from '@/services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId) => {
    try {
      const data = await authService.getProfile(userId)
      setProfile(data)
    } catch {
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    // Safety net: never hang on the loading spinner forever
    const timeout = setTimeout(() => setLoading(false), 5000)

    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        }
        clearTimeout(timeout)
        setLoading(false)
      } else if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        await loadProfile(session.user.id)
        // Also clear loading here — on some Supabase versions SIGNED_IN
        // fires instead of INITIAL_SESSION on a hard refresh
        clearTimeout(timeout)
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        clearTimeout(timeout)
        setLoading(false)
      } else if (event === 'USER_UPDATED' && session?.user) {
        setUser(session.user)
        await loadProfile(session.user.id)
      }
    })
    return () => { subscription.unsubscribe(); clearTimeout(timeout) }
  }, [loadProfile])

  const signIn = async (email, password) => {
    const data = await authService.signIn(email, password)
    return data
  }

  const signOut = async () => {
    await authService.signOut()
  }

  const refreshProfile = () => user && loadProfile(user.id)

  const isAdmin  = profile?.role === 'admin'
  const isClient = profile?.role === 'client'
  const clientId = profile?.client_id ?? null
  const client   = profile?.clients  ?? null

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isAdmin,
      isClient,
      clientId,
      client,
      signIn,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
