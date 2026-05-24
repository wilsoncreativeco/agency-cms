import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { ExternalLink, LogOut } from 'lucide-react'
import { useAuth }   from '@/contexts/AuthContext'
import { useClient } from '@/hooks/useClient'
import { usePages }  from '@/hooks/usePages'
import { Button }    from '@/components/ui/button'

export default function ClientEditorLayout() {
  const { signOut }  = useAuth()
  const { client }   = useClient()
  const { pages }    = usePages()
  const navigate     = useNavigate()
  const location     = useLocation()

  // Parse current pageId from /edit/:pageId
  const currentPageId = location.pathname.split('/edit/')[1] ?? ''

  const siteUrl = client?.custom_domain
    ? `https://${client.custom_domain}`
    : null

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth/login')
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 lg:px-6 gap-3">

        {/* Left: Wilson Creative logo + business name */}
        <div className="flex items-center gap-2.5 shrink-0 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--brand-gold)/0.15)]">
            <span
              className="text-xs font-bold text-[hsl(var(--brand-gold))]"
              style={{ fontFamily: 'Georgia, serif' }}
            >W</span>
          </div>
          <span className="text-sm font-semibold truncate max-w-[150px] hidden sm:block text-foreground">
            {client?.business_name ?? 'Your Site'}
          </span>
        </div>

        {/* Centre: page switcher — only shown when there are multiple pages */}
        {pages.length > 1 && (
          <nav className="flex items-center gap-1 flex-1 justify-center overflow-x-auto">
            {pages.map(page => (
              <button
                key={page.id}
                onClick={() => navigate(`/edit/${page.id}`)}
                className={[
                  'shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                  page.id === currentPageId
                    ? 'bg-[hsl(var(--brand-gold)/0.12)] text-[hsl(var(--brand-gold))]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                ].join(' ')}
              >
                {page.name}
              </button>
            ))}
          </nav>
        )}

        {/* Right: view site + sign out */}
        <div className="flex items-center gap-2 shrink-0">
          {siteUrl && (
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs hidden sm:flex" asChild>
              <a href={siteUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5" /> View site
              </a>
            </Button>
          )}
          <Button
            variant="ghost" size="sm"
            className="h-8 text-xs text-muted-foreground gap-1.5"
            onClick={handleSignOut}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </header>

      {/* ── Page content ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
