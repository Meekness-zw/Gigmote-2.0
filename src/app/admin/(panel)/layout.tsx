import Link from "next/link";
import { Briefcase, Users, LayoutDashboard, LogOut, ExternalLink } from "lucide-react";

/**
 * Admin panel chrome — sidebar nav + top bar. Dark-cinematic, lighter on
 * motion than the marketing surface (no WebGL canvases here — this is a
 * tool, not a brochure).
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-cream-line bg-ink-1 md:flex md:flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2.5 border-b border-cream-line px-6">
            <span className="relative grid h-6 w-6 place-items-center">
              <span className="absolute inset-0 rounded-full border border-gold/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            <span className="font-display text-base font-medium tracking-tight">
              Gigmote
            </span>
            <span className="ml-1 rounded-full border border-gold/40 bg-gold/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
              Admin
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 px-3 py-6">
            <SidebarLink href="/admin" icon={LayoutDashboard}>
              Dashboard
            </SidebarLink>
            <SidebarLink href="/admin/jobs" icon={Briefcase}>
              Jobs
            </SidebarLink>
            <SidebarLink href="/admin/applications" icon={Users}>
              Applications
            </SidebarLink>
          </nav>

          {/* Footer */}
          <div className="border-t border-cream-line p-4 space-y-2">
            <Link
              href="/"
              data-cursor="link"
              className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-cream-dim transition-colors hover:bg-cream-faint hover:text-cream"
            >
              <ExternalLink size={14} />
              <span>View site</span>
            </Link>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                data-cursor="link"
                className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-cream-dim transition-colors hover:bg-cream-faint hover:text-cream"
              >
                <LogOut size={14} />
                <span>Sign out</span>
              </button>
            </form>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Top bar — mobile-only logo */}
          <header className="flex h-14 items-center justify-between border-b border-cream-line bg-ink-1 px-6 md:hidden">
            <div className="flex items-center gap-2.5">
              <span className="relative grid h-5 w-5 place-items-center">
                <span className="absolute inset-0 rounded-full border border-gold/60" />
                <span className="h-1 w-1 rounded-full bg-gold" />
              </span>
              <span className="font-display text-sm font-medium tracking-tight">
                Gigmote Admin
              </span>
            </div>
            <Link
              href="/"
              data-cursor="link"
              className="text-[10px] font-mono uppercase tracking-[0.22em] text-cream-mute hover:text-cream"
            >
              Site →
            </Link>
          </header>

          {/* Mobile nav strip */}
          <nav className="flex border-b border-cream-line bg-ink-1 md:hidden">
            <MobileLink href="/admin">Dashboard</MobileLink>
            <MobileLink href="/admin/jobs">Jobs</MobileLink>
            <MobileLink href="/admin/applications">Applications</MobileLink>
          </nav>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof Briefcase;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-cursor="link"
      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream-dim transition-colors hover:bg-cream-faint hover:text-cream"
    >
      <Icon size={15} className="text-cream-mute transition-colors group-hover:text-gold" />
      <span>{children}</span>
    </Link>
  );
}

function MobileLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-cursor="link"
      className="flex-1 py-3 text-center text-xs font-medium text-cream-dim transition-colors hover:text-cream"
    >
      {children}
    </Link>
  );
}
