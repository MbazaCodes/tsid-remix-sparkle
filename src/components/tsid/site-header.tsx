import { Link } from "@tanstack/react-router";
import { ASSETS } from "@/lib/tsid";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40" style={{
      background: "#ffffff",
      borderBottom: "1px solid #e2e8f0",
      boxShadow: "0 1px 8px rgba(0,0,0,.06)",
    }}>
      {/* Tanzania flag stripe at very top */}
      <div className="tz-flag-stripe" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center gap-4">

        {/* Logo + wordmark */}
        <Link to="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          {/* Logo — full sharpness, no blend, larger */}
          <img
            src={ASSETS.logo}
            alt="TSID"
            style={{
              width: 56,
              height: 56,
              objectFit: "contain",
              imageRendering: "crisp-edges",
              flexShrink: 0,
            }}
          />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: 22,
              color: "#003366",
              letterSpacing: -0.4,
              lineHeight: 1,
            }}>
              TSID
            </div>
            <div style={{
              fontSize: 9.5,
              fontWeight: 600,
              color: "#64748b",
              letterSpacing: 0.3,
              marginTop: 3,
              lineHeight: 1,
            }}>
              Jamhuri ya Tanzania
            </div>
          </div>
        </Link>

        {/* Right side: secondary branding (like screenshot) */}
        <div className="hidden lg:flex items-center gap-3 ml-6 pl-6"
          style={{ borderLeft: "1px solid #e2e8f0" }}>
          <img src={ASSETS.coat} alt="" style={{ width: 38, height: 38, objectFit: "contain" }} />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#003366", letterSpacing: 0.2 }}>
              JAMHURI YA MUUNGANO WA TANZANIA
            </div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
              United Republic of Tanzania · Wizara ya Elimu
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="ml-auto hidden md:flex items-center gap-1 text-sm">
          {[
            { to: "/",       label: "Home",      exact: true },
            { to: "/search", label: "Verify ID" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={item.exact ? { exact: true } : undefined}
              style={{ padding: "6px 12px", borderRadius: 6, fontWeight: 600, fontSize: 13, textDecoration: "none", color: "#475569", transition: "all .15s" }}
              activeProps={{ style: { padding: "6px 12px", borderRadius: 6, fontWeight: 700, fontSize: 13, textDecoration: "none", color: "#003366", background: "#f0f4fa" } }}
              inactiveProps={{ className: "hover:text-primary hover:bg-muted" }}
            >
              {item.label}
            </Link>
          ))}
          <a href="#features"
            style={{ padding: "6px 12px", borderRadius: 6, fontWeight: 600, fontSize: 13, color: "#475569", textDecoration: "none" }}
            className="hover:text-primary hover:bg-muted">
            Features
          </a>
          <a href="#roles"
            style={{ padding: "6px 12px", borderRadius: 6, fontWeight: 600, fontSize: 13, color: "#475569", textDecoration: "none" }}
            className="hover:text-primary hover:bg-muted">
            Portals
          </a>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-2 ml-3">
          <Button asChild variant="outline" size="sm"
            style={{ fontSize: 13, fontWeight: 600, color: "#003366", borderColor: "#003366" }}
            className="hidden md:inline-flex hover:bg-primary/5">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild size="sm"
            style={{ background: "#003366", color: "#fff", fontWeight: 700, fontSize: 13, border: "none" }}
            className="hover:opacity-90">
            <Link to="/auth">Get started</Link>
          </Button>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded text-slate-600 hover:text-primary hover:bg-muted"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background: "#fff", borderTop: "1px solid #e2e8f0" }}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {[
              { to: "/",       label: "Home" },
              { to: "/search", label: "Verify ID" },
              { to: "/auth",   label: "Sign in" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                style={{ color: "#003366", padding: "9px 12px", borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: "none", display: "block" }}
                className="hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
