import { FileText, Image, Globe, ArrowUpRight, ExternalLink, Pencil } from 'lucide-react'
import { useAuth }  from '@/contexts/AuthContext'
import { usePages } from '@/hooks/usePages'
import { useClient } from '@/hooks/useClient'
import { Badge }   from '@/components/ui/badge'
import { Button }  from '@/components/ui/button'
import { Link }    from 'react-router-dom'

export default function DashboardHome() {
  const { profile, isAdmin } = useAuth()
  const { client }           = useClient()
  const { pages }            = usePages()
  const name = profile?.full_name?.split(' ')[0] ?? 'there'
  const greeting = getGreeting()

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-2">

      {/* Welcome */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">{greeting}</p>
        <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
        {client && (
          <p className="text-muted-foreground mt-1 text-sm">
            You're managing <span className="text-foreground font-medium">{client.business_name}</span>
          </p>
        )}
      </div>

      {/* Live site card */}
      {client?.custom_domain && (
        <a
          href={`https://${client.custom_domain}`}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-2xl border bg-gradient-to-br from-background to-muted/30 p-6 hover:border-[hsl(var(--brand-gold)/0.4)] transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--brand-gold)/0.1)] text-[hsl(var(--brand-gold))]">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">View your live website</p>
              <p className="text-xs text-muted-foreground mt-0.5">{client.custom_domain}</p>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-[hsl(var(--brand-gold))] transition-colors" />
        </a>
      )}

      {/* Pages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Pages</h2>
          <Link to="/dashboard/pages">
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
              All pages <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {pages?.length ? pages.map(page => (
            <Link
              key={page.id}
              to={`/dashboard/pages/${page.id}/edit`}
              className="group flex items-center justify-between rounded-xl border bg-card p-5 hover:border-[hsl(var(--brand-gold)/0.4)] transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-[hsl(var(--brand-gold)/0.1)] group-hover:text-[hsl(var(--brand-gold))] transition-colors">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{page.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">/{page.slug || 'home'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={page.status === 'published' ? 'success' : 'secondary'} className="text-[10px]">
                  {page.status}
                </Badge>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          )) : (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">No pages yet.</p>
              <Link to="/dashboard/pages">
                <Button variant="outline" size="sm" className="mt-3">Create a page</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/dashboard/media" className="group flex items-center gap-3 rounded-xl border bg-card p-4 hover:border-[hsl(var(--brand-gold)/0.4)] transition-all duration-200">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-[hsl(var(--brand-gold)/0.1)] transition-colors">
              <Image className="h-4 w-4 text-muted-foreground group-hover:text-[hsl(var(--brand-gold))]" />
            </div>
            <div>
              <p className="text-sm font-medium">Upload photos</p>
              <p className="text-xs text-muted-foreground">Add images to your library</p>
            </div>
          </Link>
          {client?.custom_domain && (
            <a href={`https://${client.custom_domain}`} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-xl border bg-card p-4 hover:border-[hsl(var(--brand-gold)/0.4)] transition-all duration-200">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-[hsl(var(--brand-gold)/0.1)] transition-colors">
                <Globe className="h-4 w-4 text-muted-foreground group-hover:text-[hsl(var(--brand-gold))]" />
              </div>
              <div>
                <p className="text-sm font-medium">View live site</p>
                <p className="text-xs text-muted-foreground">{client.custom_domain}</p>
              </div>
            </a>
          )}
        </div>
      </div>

    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
