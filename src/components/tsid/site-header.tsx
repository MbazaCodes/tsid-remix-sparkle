import { Link } from "@tanstack/react-router";
import { ASSETS } from "@/lib/tsid";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40" style={{ background: "#003366" }}>
      {/* Tanzania flag stripe */}
      <div className="tz-flag-stripe" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center gap-4">
        {/* Logo + wordmark — logo blends into navy bg via mix-blend-mode */}
        <Link to="/" className="flex items-center gap-3 group" style={{ textDecoration: "none" }}>
          <div style={{
            position: "relative",
            width: 44, height: 44,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* The logo PNG has a white/light bg — multiply blend removes it */}
            <img
              src={ASSETS.logo}
              alt="TSID"
              style={{
                width: 44, height: 44,
                objectFit: "contain",
                mixBlendMode: "luminosity",
                filter: "brightness(1.4) contrast(0.9)",
              }}
            />
          </div>
          <div style={{ lineHeight: 1 }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: 20,
              color: "#ffffff",
              letterSpacing: -0.3,
              lineHeight: 1,
            }}>
              TSID
            </div>
            <div style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#a3c4dd",
              textTransform: "uppercase",
              letterSpacing: 1.2,
              marginTop: 2,
            }}>
              Jamhuri ya Tanzania
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="ml-auto hidden md:flex items-center gap-1 text-sm">
          {[
            { to: "/", label: "Home", exact: true },
            { to: "/search", label: "Verify ID" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={item.exact ? { exact: true } : undefined}
              style={{ color: "#a3c4dd", padding: "6px 12px", borderRadius: 6, fontWeight: 600, fontSize: 13, textDecoration: "none", transition: "color .15s, background .15s" }}
              activeProps={{ style: { color: "#fff", background: "rgba(255,255,255,.12)", padding: "6px 12px", borderRadius: 6, fontWeight: 600, fontSize: 13, textDecoration: "none" } }}
              inactiveProps={{ className: "hover:text-white hover:bg-white/10" }}
            >
              {item.label}
            </Link>
          ))}
          <a href="#features" style={{ color: "#a3c4dd", padding: "6px 12px", borderRadius: 6, fontWeight: 600, fontSize: 13, textDecoration: "none" }}
            className="hover:text-white hover:bg-white/10">
            Features
          </a>
          <a href="#roles" style={{ color: "#a3c4dd", padding: "6px 12px", borderRadius: 6, fontWeight: 600, fontSize: 13, textDecoration: "none" }}
            className="hover:text-white hover:bg-white/10">
            Portals
          </a>
        </nav>

        {/* CTA buttons */}
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"
            style={{ color: "#a3c4dd", border: "1px solid rgba(255,255,255,.2)", fontSize: 13 }}
            className="hidden md:inline-flex hover:bg-white/10 hover:text-white">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild size="sm"
            style={{ background: "#1B8F3A", color: "#fff", fontWeight: 700, fontSize: 13, border: "none" }}
            className="hover:opacity-90">
            <Link to="/auth">Get started</Link>
          </Button>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "#002550", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/search", label: "Verify ID" },
              { to: "/auth", label: "Sign in" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                style={{ color: "#a3c4dd", padding: "9px 12px", borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: "none", display: "block" }}
                className="hover:text-white hover:bg-white/10"
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
