import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Image, Settings, Users,
  Building2, ChevronRight, X,
} from 'lucide-react'
import { useAuth }           from '@/contexts/AuthContext'
import { ClientSelector }    from './ClientSelector'
import { cn }                from '@/lib/utils'

const clientNav = [
  { label: 'Dashboard', href: '/dashboard',          icon: LayoutDashboard, end: true },
  { label: 'Pages',     href: '/dashboard/pages',    icon: FileText },
  { label: 'Media',     href: '/dashboard/media',    icon: Image },
  { label: 'Users',     href: '/dashboard/users',    icon: Users },
  { label: 'Settings',  href: '/dashboard/settings', icon: Settings },
]

const adminNav = [
  { label: 'Clients',  href: '/admin/clients', icon: Building2 },
]

function NavItem({ href, icon: Icon, label, end, onClick }) {
  return (
    <NavLink
      to={href}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-background))] font-semibold'
            : 'text-[hsl(var(--sidebar-foreground))] hover:bg-white/8 hover:text-white'
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </NavLink>
  )
}

export function Sidebar({ open, onClose }) {
  const { profile, isAdmin } = useAuth()

  return (
    <aside
      className={cn(
        'flex flex-col bg-[hsl(var(--sidebar-background))] shrink-0',
        // Mobile: fixed overlay sliding in from left
        'fixed inset-y-0 left-0 z-30 w-72 transition-transform duration-200',
        // Desktop: static inline
        'lg:static lg:z-auto lg:transition-all lg:duration-200',
        open
          ? 'translate-x-0 lg:w-60'
          : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'
      )}
    >
      {/* Logo + Close button */}
      <div className="flex h-14 items-center justify-between px-5 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--brand-gold)/0.15)]">
            <span className="text-xs font-bold text-[hsl(var(--brand-gold))]" style={{ fontFamily: 'Georgia, serif' }}>W</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-bold tracking-widest text-white uppercase">Wilson Creative</span>
            <span className="text-[9px] tracking-widest text-[hsl(var(--brand-gold))] uppercase">Co.</span>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {/* Admin: client switcher */}
        {isAdmin && (
          <div className="mb-2">
            <ClientSelector />
          </div>
        )}

        {/* Main nav */}
        <nav className="space-y-0.5">
          {clientNav.map(item => (
            <NavItem key={item.href} {...item} onClick={onClose} />
          ))}
        </nav>

        {/* Admin section */}
        {isAdmin && (
          <>
            <div className="my-2 border-t border-[hsl(var(--sidebar-border))]" />
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">
              Admin
            </p>
            <nav className="space-y-0.5">
              {adminNav.map(item => (
                <NavItem key={item.href} {...item} onClick={onClose} />
              ))}
            </nav>
          </>
        )}
      </div>

      {/* Profile footer */}
      {profile && (
        <div className="border-t border-[hsl(var(--sidebar-border))] p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white">
              {(profile.full_name ?? profile.email)?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">
                {profile.full_name ?? profile.email}
              </p>
              <p className="text-[10px] capitalize text-white/40">{profile.role}</p>
            </div>
            <ChevronRight className="h-3 w-3 text-white/30" />
          </div>
        </div>
      )}
    </aside>
  )
}
