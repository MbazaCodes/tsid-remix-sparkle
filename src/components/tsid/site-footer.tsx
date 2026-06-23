import { Link } from "@tanstack/react-router";
import { ASSETS } from "@/lib/tsid";
import { useTheme } from "@/lib/theme";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";

export function SiteFooter() {
  const { theme, t } = useTheme();
  const isDark = theme === "dark";
  const bg     = isDark ? "#0a1628" : "#003366";
  const sub    = "#a3c4dd";
  const border = "rgba(255,255,255,.10)";

  const NAV_LINKS = [
    { label: t("verify"),  to: "/search" },
    { label: "School portal",      to: "/school" },
    { label: "Government portal",  to: "/gov" },
    { label: "Student portal",     to: "/student" },
    { label: t("signin"),          to: "/auth" },
  ];

  const CONTACT = [
    { icon: <MapPin style={{ width: 13, height: 13, flexShrink: 0 }} />, text: "Wizara ya Elimu, Sayansi na Teknolojia, P.O. Box 10, Dodoma" },
    { icon: <Mail   style={{ width: 13, height: 13, flexShrink: 0 }} />, text: "support@tsid.go.tz" },
    { icon: <Phone  style={{ width: 13, height: 13, flexShrink: 0 }} />, text: "+255 22 211 0399" },
  ];

  return (
    <footer style={{ background: bg, color: "#fff" }}>
      {/* TZ flag stripe at top */}
      <div className="tz-flag-stripe" />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 24px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 48 }}
          className="footer-grid">

          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <img src={ASSETS.logo} alt="TSID" style={{ width: 60, height: 60, objectFit: "contain", filter: "drop-shadow(0 2px 8px rgba(0,0,0,.3))" }} />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 22, color: "#fff", letterSpacing: -0.3 }}>TSID</div>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: "#1EB53A", letterSpacing: 1, marginTop: 3, textTransform: "uppercase" }}>
                  Tanzania Student ID
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: sub, lineHeight: 1.75, maxWidth: 360, marginBottom: 20 }}>
              One verifiable identity for every learner in Tanzania.
              Issued by registered schools, overseen by the Ministry of Education.
            </p>
            {/* TZ flag strip */}
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <img src={ASSETS.coat} alt="" style={{ width: 28, height: 28 }} />
              <span style={{ fontSize: 11, color: sub, fontWeight: 600 }}>Uhuru na Umoja</span>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 18 }}>
              {t("footer_platform")}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {NAV_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} style={{ fontSize: 13.5, color: sub, textDecoration: "none", fontWeight: 500, transition: "color .15s", display: "flex", alignItems: "center", gap: 5 }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = sub; }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 18 }}>
              {t("footer_contact")}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {CONTACT.map(({ icon, text }) => (
                <li key={text} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: "#1EB53A", marginTop: 1 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: sub, lineHeight: 1.5 }}>{text}</span>
                </li>
              ))}
            </ul>
            <a href="https://verify.tsid.go.tz" target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 18, fontSize: 12, color: "#007AFF", fontWeight: 700, textDecoration: "none" }}>
              <ExternalLink style={{ width: 12, height: 12 }} /> verify.tsid.go.tz
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${border}`, paddingTop: 20, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: sub }}>© {new Date().getFullYear()} {t("footer_copy")}</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Use", "Accessibility"].map((label) => (
              <a key={label} href="#" style={{ fontSize: 12, color: sub, textDecoration: "none", transition: "color .15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = sub; }}>
                {label}
              </a>
            ))}
          </div>
          <span style={{ fontSize: 12, color: "rgba(163,196,221,.5)", fontFamily: "ui-monospace" }}>TSID v2.0 · Phase 1</span>
        </div>
      </div>
    </footer>
  );
}
