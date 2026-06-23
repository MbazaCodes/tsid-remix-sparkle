import { ASSETS } from "@/lib/tsid";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-sidebar text-sidebar-foreground">
      <div className="tz-flag-stripe" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={ASSETS.coat} alt="Coat of arms of Tanzania" className="h-16 w-16 object-contain" />
            <div>
              <div className="font-display font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>Tanzania Student ID</div>
              <div className="text-xs opacity-70">Uhuru na Umoja</div>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-80 max-w-md">
            One verifiable identity for every learner in Tanzania. Issued by registered schools, overseen by the Ministry of Education.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3 opacity-90">Platform</div>
          <ul className="space-y-2 text-sm opacity-80">
            <li>Verify a student ID</li>
            <li>School portal</li>
            <li>Government dashboard</li>
            <li>Student dashboard</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3 opacity-90">Contact</div>
          <ul className="space-y-2 text-sm opacity-80">
            <li>Wizara ya Elimu, Sayansi na Teknolojia</li>
            <li>P.O. Box 10, Dodoma</li>
            <li>support@tsid.go.tz</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sidebar-border">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs opacity-60 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Jamhuri ya Muungano wa Tanzania. All rights reserved.</span>
          <span>TSID v1.0 · Phase 1</span>
        </div>
      </div>
    </footer>
  );
}