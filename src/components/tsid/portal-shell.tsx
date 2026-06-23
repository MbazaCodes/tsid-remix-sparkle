import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { ASSETS } from "@/lib/tsid";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

export type NavItem = { to: string; label: string; icon?: ReactNode };

export function PortalShell({
  title, items, subtitle,
}: { title: string; subtitle?: string; items: NavItem[] }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground">
        <div className="tz-flag-stripe" aria-hidden />
        <Link to="/" className="px-5 py-5 flex items-center gap-3 border-b border-sidebar-border">
          <img src={ASSETS.logo} alt="" className="h-10 w-10 object-contain" />
          <div>
            <div className="font-display font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>{title}</div>
            {subtitle && <div className="text-[10px] uppercase tracking-widest opacity-70">{subtitle}</div>}
          </div>
        </Link>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((it) => {
            const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to + "/"));
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "opacity-80 hover:opacity-100 hover:bg-sidebar-accent/60"
                }`}
              >
                <span className="w-4 h-4 inline-flex items-center justify-center">{it.icon}</span>
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <Button onClick={signOut} variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="md:hidden tz-flag-stripe" />
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}