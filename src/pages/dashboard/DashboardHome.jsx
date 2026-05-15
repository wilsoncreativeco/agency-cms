import { FileText, Image, Users, Globe, ArrowUpRight, Activity } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/utils'

const statsClient = [
  { label: 'Pages',        icon: FileText, value: '—', href: '/dashboard/pages',  color: 'text-blue-500'   },
  { label: 'Media files',  icon: Image,    value: '—', href: '/dashboard/media',  color: 'text-purple-500' },
  { label: 'Team members', icon: Users,    value: '—', href: '/dashboard/users',  color: 'text-emerald-500'},
]

export default function DashboardHome() {
  const { profile, client, isAdmin } = useAuth()
  const greeting = getGreeting()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {greeting}, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isAdmin
            ? 'Here\'s an overview of your agency.'
            : `Managing ${client?.business_name ?? 'your website'}.`
          }
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statsClient.map(stat => (
          <Card key={stat.label} className="group hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Link
                to={stat.href}
                className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What would you like to do?</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            <Link to="/dashboard/pages" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Edit my pages</p>
                <p className="text-xs text-muted-foreground mt-0.5">Update text, images and content on your website</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto shrink-0" />
            </Link>
            <Link to="/dashboard/media" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Image className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Upload images</p>
                <p className="text-xs text-muted-foreground mt-0.5">Add new photos and media to your library</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto shrink-0" />
            </Link>
            {client?.custom_domain && (
              <a href={`https://${client.custom_domain}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">View my website</p>
                  <p className="text-xs text-muted-foreground mt-0.5">See your live site as visitors see it</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto shrink-0" />
              </a>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity feed will appear here as you make changes.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Site status */}
      {client && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Site details</CardTitle>
              <Badge variant={client.is_active ? 'success' : 'secondary'}>
                {client.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Business',  value: client.business_name },
              { label: 'Slug',      value: client.slug },
              { label: 'Domain',    value: client.custom_domain ?? 'Not set' },
              { label: 'Plan',      value: client.plan },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-0.5 text-sm font-medium truncate">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
