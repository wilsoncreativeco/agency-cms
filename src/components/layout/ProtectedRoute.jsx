import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, profile, loading, isClient } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner />

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  // Clients who land on /dashboard get sent to the clean editor instead
  if (isClient && location.pathname.startsWith('/dashboard')) {
    return <Navigate to="/edit" replace />
  }

  return children
}

export function PublicOnlyRoute({ children }) {
  const { user, loading, isClient } = useAuth()

  if (loading) return <Spinner />

  // Already logged in — send to the right place for their role
  if (user) {
    return <Navigate to={isClient ? '/edit' : '/dashboard'} replace />
  }

  return children
}
