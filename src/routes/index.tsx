import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ASSETS } from "@/lib/tsid";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/tsid/site-header";
import { SiteFooter } from "@/components/tsid/site-footer";
import { IdCardFrontOnly, IdCardBackOnly } from "@/components/tsid/id-card";
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

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section style={{
          background: "linear-gradient(135deg, #eef4fb 0%, #dceeff 45%, #e8f5ec 100%)",
          minHeight: "calc(100vh - 72px)",
          display: "flex",
          alignItems: "center",
        }}>
          <div style={{
            maxWidth: 1280,
            margin: "0 auto",
            width: "100%",
            padding: "40px 32px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "center",
          }}>

            {/* Left: text */}
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "5px 14px", borderRadius: 999,
                background: "rgba(0,51,102,.09)", color: "#003366",
                fontSize: 12, fontWeight: 700, marginBottom: 22,
              }}>
                <img src={ASSETS.coat} alt="" style={{ height: 16, width: 16 }} />
                Official · Wizara ya Elimu, Sayansi na Teknolojia
              </div>

              <h1 style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(2.2rem, 3.6vw, 3.5rem)",
                color: "#003366",
                lineHeight: 1.06,
                letterSpacing: -1,
                marginBottom: 22,
              }}>
                One verifiable ID for every student in Tanzania.
              </h1>

              <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
                TSID is the national platform that lets schools issue, students carry,
                and the government verify student identification — instantly and securely.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
                <Button asChild size="lg" style={{ background: "#003366", color: "#fff", fontWeight: 700, fontSize: 15, height: 48, paddingLeft: 28, paddingRight: 28 }}>
                  <Link to="/auth">Sign in to the portal</Link>
                </Button>
                <Button asChild size="lg" variant="outline" style={{ fontWeight: 600, fontSize: 15, borderColor: "#003366", color: "#003366", height: 48, paddingLeft: 24, paddingRight: 24 }}>
                  <Link to="/search"><Search style={{ width: 16, height: 16, marginRight: 8 }} /> Verify a student ID</Link>
                </Button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
                {[
                  { icon: <ShieldCheck style={{ width: 14, height: 14, color: "#1B8F3A" }} />, label: "RLS-secured" },
                  { icon: <QrCode style={{ width: 14, height: 14, color: "#007AFF" }} />, label: "Tamper-evident QR" },
                  { icon: <img src={ASSETS.flag} alt="" style={{ height: 12 }} />, label: "Made for Tanzania" },
                ].map(({ icon, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                    {icon} {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: logo badge + ID cards */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}>
              {/* TSID logo + wordmark */}
              <div style={{
                display: "flex", alignItems: "center", gap: 16,
                background: "rgba(255,255,255,.65)",
                backdropFilter: "blur(8px)",
                borderRadius: 16,
                padding: "14px 22px",
                boxShadow: "0 2px 16px rgba(0,51,102,.10)",
                border: "1px solid rgba(0,51,102,.08)",
              }}>
                <img
                  src={ASSETS.logo}
                  alt="TSID"
                  style={{
                    width: 80, height: 80,
                    objectFit: "contain",
                    filter: "drop-shadow(0 3px 8px rgba(0,51,102,.20))",
                  }}
                />
                <div>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900, fontSize: 32,
                    color: "#003366", letterSpacing: -0.5, lineHeight: 1,
                  }}>TSID</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#1B8F3A", letterSpacing: 1, marginTop: 4, textTransform: "uppercase" }}>
                    Tanzania Student Identification System
                  </div>
                  <div style={{ fontSize: 9.5, fontWeight: 600, color: "#64748b", marginTop: 2 }}>
                    Jamhuri ya Muungano wa Tanzania
                  </div>
                </div>
              </div>

              {/* ID Cards */}
              <HeroCardPreview />
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────────── */}
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

        {/* ── ROLES ────────────────────────────────────────────────────── */}
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
                  <Button asChild variant="link" className="px-0 mt-3 text-primary">
                    <Link to="/auth">Open the {r.tag.toLowerCase()} portal →</Link>
                  </Button>
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

// ── Demo card data ────────────────────────────────────────────────────────────
const DEMO_DATA = {
  tsid_no: "TSID-2025-A1234567",
  full_name: "Juma A. Mwanza",
  school_name: "Shule Ya Msingi Mwanga",
  school_code: "PS1234",
  region: "Dar es Salaam",
  district: "Kinondoni",
  dob: "2014-05-15",
  gender: "Male",
  nationality: "Tanzanian",
  photo_url: null,
  status: "active",
  level: "Primary School",
  blood_group: "O+",
  enrollment_date: "2020-01-10",
  issue_date: "2025-05-20",
  parent_name: "Aishatu Juma",
  parent_nida: "19901234567890123",
  relationship: "Mother",
  parent_phone: "+255 712 345 678",
};

// ── Hero card preview
// Cards are 204×324px native — scale up to 0.90 for visibility
// Two cards side by side: (204×2 + 16gap) × 0.90 ≈ 382px wide
const CARD_W = 204;
const CARD_H = 324;
const SCALE  = 0.90;

function HeroCardPreview() {
  return (
    <div style={{
      width:  Math.round((CARD_W * 2 + 16) * SCALE),
      height: Math.round(CARD_H * SCALE),
      position: "relative",
      flexShrink: 0,
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: 0,
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        transformOrigin: "top left",
        transform: `scale(${SCALE})`,
      }}>
        <HeroFront />
        <HeroBack />
      </div>
    </div>
  );
}

function HeroFront() {
  const [qr, setQr] = useState("");
  useEffect(() => {
    import("qrcode").then((QRCode) =>
      QRCode.default.toDataURL("https://verify.tsid.go.tz/id/TSID-2025-A1234567", {
        margin: 1, width: 200, color: { dark: "#000", light: "#fff" },
      }).then(setQr).catch(() => {})
    );
  }, []);
  return <IdCardFrontOnly data={DEMO_DATA} qr={qr} />;
}

function HeroBack() {
  return <IdCardBackOnly data={DEMO_DATA} />;
}
