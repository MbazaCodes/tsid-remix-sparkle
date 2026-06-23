import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ASSETS } from "@/lib/tsid";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/tsid/site-header";
import { SiteFooter } from "@/components/tsid/site-footer";
import { IdCardFrontOnly, IdCardBackOnly } from "@/components/tsid/id-card";
import { ShieldCheck, GraduationCap, Building2, Search, QrCode, FileCheck2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "TSID — Tanzania Student Identification System" }] }),
  component: Index,
});

const DEMO_DATA = {
  tsid_no: "TSID-2025-A1234567", full_name: "Juma A. Mwanza",
  school_name: "Shule Ya Msingi Mwanga", school_code: "PS1234",
  region: "Dar es Salaam", district: "Kinondoni",
  dob: "2014-05-15", gender: "Male", nationality: "Tanzanian",
  photo_url: null, status: "active", level: "Primary School",
  blood_group: "O+", enrollment_date: "2020-01-10", issue_date: "2025-05-20",
  parent_name: "Aishatu Juma", parent_nida: "19901234567890123",
  relationship: "Mother", parent_phone: "+255 712 345 678",
};

const CARD_W = 204, CARD_H = 324, SCALE = 0.90;

function HeroCardPreview() {
  const [qr, setQr] = useState("");
  useEffect(() => {
    import("qrcode").then((M) =>
      M.default.toDataURL("https://verify.tsid.go.tz/id/TSID-2025-A1234567", {
        margin: 1, width: 200, color: { dark: "#000", light: "#fff" },
      }).then(setQr).catch(() => {}));
  }, []);
  return (
    <div style={{ width: Math.round((CARD_W*2+16)*SCALE), height: Math.round(CARD_H*SCALE), position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 0, left: 0, display: "flex", gap: 16, transformOrigin: "top left", transform: `scale(${SCALE})` }}>
        <IdCardFrontOnly data={DEMO_DATA} qr={qr} />
        <IdCardBackOnly data={DEMO_DATA} />
      </div>
    </div>
  );
}

function Index() {
  const { t, theme } = useTheme();
  const isDark = theme === "dark";

  const FEATURES = [
    { icon: GraduationCap, title: t("feat_school_title"), body: t("feat_school_body") },
    { icon: Search,        title: t("feat_verify_title"), body: t("feat_verify_body") },
    { icon: FileCheck2,    title: t("feat_gov_title"),    body: t("feat_gov_body") },
  ];
  const ROLES = [
    { tag: t("role_school"), icon: Building2,  body: t("role_school_body"), color: "var(--tz-green)" },
    { tag: t("role_gov"),    icon: ShieldCheck, body: t("role_gov_body"),    color: "var(--tz-blue)" },
    { tag: t("role_student"),icon: GraduationCap, body: t("role_student_body"), color: "var(--tz-gold)" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section style={{ background: isDark ? "linear-gradient(135deg,#0a1628 0%,#0d1f3c 50%,#0a2015 100%)" : "linear-gradient(135deg,#eef4fb 0%,#dceeff 45%,#e8f5ec 100%)", minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", padding: "40px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: 48, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 999, background: isDark ? "rgba(255,255,255,.07)" : "rgba(0,51,102,.09)", color: isDark ? "#a3c4dd" : "#003366", fontSize: 12, fontWeight: 700, marginBottom: 22 }}>
                <img src={ASSETS.coat} alt="" style={{ height: 16, width: 16 }} />
                {t("official_badge")}
              </div>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2.2rem,3.6vw,3.5rem)", color: isDark ? "#e2e8f0" : "#003366", lineHeight: 1.06, letterSpacing: -1, marginBottom: 22 }}>
                {t("hero_title")}
              </h1>
              <p style={{ fontSize: 17, color: isDark ? "#94a3b8" : "#475569", lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
                {t("hero_sub")}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
                <Button asChild size="lg" style={{ background: "#003366", color: "#fff", fontWeight: 700, fontSize: 15, height: 48, paddingLeft: 28, paddingRight: 28 }}>
                  <Link to="/auth">{t("hero_signin")}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" style={{ fontWeight: 600, fontSize: 15, borderColor: isDark ? "#a3c4dd" : "#003366", color: isDark ? "#a3c4dd" : "#003366", height: 48, paddingLeft: 24, paddingRight: 24 }}>
                  <Link to="/search"><Search style={{ width: 16, height: 16, marginRight: 8 }} />{t("hero_verify")}</Link>
                </Button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: isDark ? "#64748b" : "#64748b", fontWeight: 600 }}><ShieldCheck style={{ width: 14, height: 14, color: "#1B8F3A" }} />{t("rls_secured")}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b", fontWeight: 600 }}><QrCode style={{ width: 14, height: 14, color: "#007AFF" }} />{t("tamper_qr")}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b", fontWeight: 600 }}><img src={ASSETS.flag} alt="" style={{ height: 12 }} />{t("made_tz")}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, background: isDark ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.65)", backdropFilter: "blur(8px)", borderRadius: 16, padding: "14px 22px", boxShadow: "0 2px 16px rgba(0,51,102,.10)", border: `1px solid ${isDark ? "rgba(255,255,255,.08)" : "rgba(0,51,102,.08)"}` }}>
                <img src={ASSETS.logo} alt="TSID" style={{ width: 80, height: 80, objectFit: "contain", filter: "drop-shadow(0 3px 8px rgba(0,51,102,.20))" }} />
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 32, color: isDark ? "#e2e8f0" : "#003366", letterSpacing: -0.5, lineHeight: 1 }}>TSID</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#1B8F3A", letterSpacing: 1, marginTop: 4, textTransform: "uppercase" }}>Tanzania Student Identification System</div>
                  <div style={{ fontSize: 9.5, fontWeight: 600, color: isDark ? "#64748b" : "#64748b", marginTop: 2 }}>Jamhuri ya Muungano wa Tanzania</div>
                </div>
              </div>
              <HeroCardPreview />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(1.8rem,3vw,2.5rem)", color: isDark ? "#e2e8f0" : "#003366", textAlign: "center", marginBottom: 48 }}>{t("features_title")}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ borderRadius: 20, border: `1px solid ${isDark ? "rgba(255,255,255,.08)" : "#e2e8f0"}`, background: isDark ? "#1e293b" : "#fff", padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,51,102,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#003366", marginBottom: 16 }}><f.icon style={{ width: 20, height: 20 }} /></div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: isDark ? "#e2e8f0" : "#0f172a" }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: isDark ? "#94a3b8" : "#64748b", lineHeight: 1.6 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ROLES */}
        <section id="roles" style={{ background: isDark ? "#0a1628" : "#f0f4fa" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(1.8rem,3vw,2.5rem)", color: isDark ? "#e2e8f0" : "#003366", textAlign: "center", marginBottom: 48 }}>{t("roles_title")}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
              {ROLES.map((r) => (
                <div key={r.tag} style={{ borderRadius: 20, border: `1px solid ${isDark ? "rgba(255,255,255,.08)" : "#e2e8f0"}`, background: isDark ? "#1e293b" : "#fff", padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: `color-mix(in oklch,${r.color} 80%,black 20%)`, marginBottom: 16 }}><r.icon style={{ width: 24, height: 24 }} /></div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: isDark ? "#64748b" : "#94a3b8", marginBottom: 6 }}>{t("portals")}</div>
                  <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: isDark ? "#e2e8f0" : "#0f172a" }}>{r.tag}</h3>
                  <p style={{ fontSize: 13.5, color: isDark ? "#94a3b8" : "#64748b", lineHeight: 1.6, marginBottom: 16 }}>{r.body}</p>
                  <Link to="/auth" style={{ fontSize: 13, fontWeight: 700, color: "#003366", textDecoration: "none" }}>{t("open_portal")}</Link>
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
