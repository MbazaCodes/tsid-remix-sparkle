import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ASSETS } from "@/lib/tsid";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/tsid/site-header";
import { SiteFooter } from "@/components/tsid/site-footer";
import { IdCard } from "@/components/tsid/id-card";
import { ShieldCheck, GraduationCap, Building2, Search, QrCode, FileCheck2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TSID — Tanzania Student Identification System" },
      { name: "description", content: "One verifiable student ID for every learner in Tanzania. Issue, verify and manage student identification online." },
      { property: "og:title", content: "TSID — Tanzania Student Identification System" },
      { property: "og:description", content: "Issue, verify and manage student identification across Tanzania." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="tsid-card">
          <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
                <img src={ASSETS.coat} alt="" className="h-4 w-4" />
                Official · Wizara ya Elimu, Sayansi na Teknolojia
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-primary leading-[1.05]" style={{ fontFamily: "var(--font-display)" }}>
                One verifiable ID for every student in Tanzania.
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl">
                TSID is the national platform that lets schools issue, students carry, and the government verify student identification — instantly and securely.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link to="/auth" search={{ mode: "signup" } as never}>Create an account</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/search"><Search className="h-4 w-4 mr-2" /> Verify a student ID</Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[color:var(--tz-green)]" /> RLS-secured</div>
                <div className="flex items-center gap-2"><QrCode className="h-4 w-4 text-[color:var(--tz-blue)]" /> Tamper-evident QR</div>
                <div className="flex items-center gap-2"><img src={ASSETS.flag} alt="" className="h-3" /> Made for Tanzania</div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <IdCard data={{
                tsid_no: "TSID-26-100482",
                full_name: "Asha Mwanga Juma",
                school_name: "Azania Secondary School",
                region: "Dar es Salaam",
                dob: "2008-03-14",
                gender: "F",
                status: "active",
                photo_url: null,
              }} />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center max-w-2xl mx-auto" style={{ fontFamily: "var(--font-display)" }}>
            Built for the whole identification lifecycle
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { icon: GraduationCap, title: "Schools issue", body: "Register students, attach photos, generate official TSID numbers and print plastic-ready ID cards." },
              { icon: Search, title: "Anyone verifies", body: "A public, anonymous lookup that returns only sanitized information — no leaks of personal data." },
              { icon: FileCheck2, title: "Government oversees", body: "Live KPIs across regions, audit logs of every action, and one-click approvals for applications." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><f.icon className="h-5 w-5" /></div>
                <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Roles */}
        <section id="roles" className="bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 py-20">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center" style={{ fontFamily: "var(--font-display)" }}>One platform · three portals</h2>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {[
                { tag: "Schools", icon: Building2, body: "Manage your student database, process applications, accept payments and print cards.", color: "var(--tz-green)" },
                { tag: "Government", icon: ShieldCheck, body: "Verify schools, audit every issuance, monitor regional KPIs and approve escalations.", color: "var(--tz-blue)" },
                { tag: "Students", icon: GraduationCap, body: "Carry your ID on your phone, download a printable copy, request letters and certificates.", color: "var(--tz-gold)" },
              ].map((r) => (
                <div key={r.tag} className="rounded-2xl bg-card border p-6 shadow-sm">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center text-white" style={{ background: `color-mix(in oklch, ${r.color} 80%, black 20%)` }}>
                    <r.icon className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">For {r.tag}</div>
                  <p className="mt-2 text-sm text-foreground">{r.body}</p>
                  <Button asChild variant="link" className="px-0 mt-3 text-primary"><Link to="/auth" search={{ mode: "signup" } as never}>Open the {r.tag.toLowerCase()} portal →</Link></Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
