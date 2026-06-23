import { Link } from "@tanstack/react-router";
import { ASSETS } from "@/lib/tsid";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
      <div className="tz-flag-stripe" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={ASSETS.logo} alt="TSID" className="h-11 w-11 object-contain" />
          <div className="leading-tight">
            <div className="font-display font-bold text-base text-primary" style={{ fontFamily: "var(--font-display)" }}>TSID</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Jamhuri ya Tanzania</div>
          </div>
        </Link>
        <nav className="ml-auto hidden md:flex items-center gap-1 text-sm">
          <Link to="/" className="px-3 py-2 rounded hover:bg-muted" activeOptions={{ exact: true }} activeProps={{ className: "px-3 py-2 rounded bg-muted text-primary font-semibold" }}>Home</Link>
          <Link to="/search" className="px-3 py-2 rounded hover:bg-muted" activeProps={{ className: "px-3 py-2 rounded bg-muted text-primary font-semibold" }}>Verify ID</Link>
          <a href="#features" className="px-3 py-2 rounded hover:bg-muted">Features</a>
          <a href="#roles" className="px-3 py-2 rounded hover:bg-muted">For schools & gov</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90"><Link to="/auth" search={{ mode: "signup" } as never}>Get started</Link></Button>
        </div>
      </div>
    </header>
  );
}