import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ASSETS, roleHome, type Role } from "@/lib/tsid";
import { toast } from "sonner";
import { Eye, EyeOff, ShieldCheck, GraduationCap, Building2 } from "lucide-react";

const searchSchema = z.object({ role: z.enum(["gov","school","student"]).optional() });
export const Route = createFileRoute("/auth")({ validateSearch: searchSchema, component: AuthPage });

function AuthPage() {
  const { role: defaultRole } = Route.useSearch();
  const navigate = useNavigate();
  const { t, theme } = useTheme();
  const isDark = theme === "dark";
  const [selectedRole, setSelectedRole] = useState<Role>(defaultRole ?? "school");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false); const [loading, setLoading] = useState(false);

  const ROLE_DEFS: Record<Role, { label: string; desc: string; icon: typeof ShieldCheck }> = {
    gov:     { label: t("role_gov"),     desc: t("role_gov_desc"),     icon: ShieldCheck },
    school:  { label: t("role_school"),  desc: t("role_school_desc"),  icon: Building2 },
    student: { label: t("role_student"), desc: t("role_student_desc"), icon: GraduationCap },
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id).maybeSingle();
        navigate({ to: roleHome(r?.role as Role), replace: true });
      }
    })();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { toast.error(error.message); setLoading(false); return; }
    const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.user!.id).maybeSingle();
    const actualRole = r?.role as Role | null;
    if (!actualRole) { toast.error("No TSID profile found. Contact your administrator."); await supabase.auth.signOut(); setLoading(false); return; }
    if (actualRole !== selectedRole) { toast.error(`Account is "${actualRole}". Redirecting…`); setTimeout(() => navigate({ to: roleHome(actualRole), replace: true }), 900); setLoading(false); return; }
    navigate({ to: roleHome(actualRole), replace: true });
  }

  const bg   = isDark ? "#0f172a" : "#f0f4fa";
  const card = isDark ? "#1e293b" : "#fff";
  const text = isDark ? "#e2e8f0" : "#003366";
  const sub  = isDark ? "#94a3b8" : "#64748b";
  const bdr  = isDark ? "rgba(255,255,255,.08)" : "#e2e8f0";

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", background: bg }}>
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between" style={{ background: "#003366", color: "#fff", padding: 40 }}>
        <div className="tz-flag-stripe -mx-10 -mt-10" />
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", marginTop: 16 }}>
          <img src={ASSETS.logo} alt="" style={{ height: 52, width: 52, objectFit: "contain" }} />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 20, color: "#fff" }}>TSID</div>
            <div style={{ fontSize: 10, color: "#a3c4dd", letterSpacing: 0.8 }}>Tanzania Student ID</div>
          </div>
        </Link>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(1.6rem,2.5vw,2.2rem)", lineHeight: 1.15, marginBottom: 14 }}>
            {t("auth_subtitle")}
          </h2>
          <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.7, maxWidth: 380 }}>
            {t("auth_no_cred")} {t("auth_schools_hint")}
          </p>
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
            {(["gov","school","student"] as Role[]).map((r) => {
              const M = ROLE_DEFS[r];
              return (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.8 }}>
                  <M.icon style={{ width: 15, height: 15, flexShrink: 0 }} />
                  <span style={{ fontSize: 13 }}><strong>{M.label}</strong> — {M.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.6, fontSize: 12 }}>
          <img src={ASSETS.coat} style={{ height: 32, width: 32 }} alt="" />
          {t("uhuru")}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px", background: bg }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-3 mb-6">
            <img src={ASSETS.logo} style={{ height: 44, width: 44 }} alt="" />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 18, color: text }}>TSID</div>
              <div style={{ fontSize: 10, color: sub }}>Tanzania Student ID</div>
            </div>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 26, color: text, marginBottom: 6 }}>{t("auth_title")}</h1>
          <p style={{ fontSize: 13.5, color: sub, marginBottom: 24 }}>{t("auth_subtitle")}</p>

          {/* Role selector */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
            {(["gov","school","student"] as Role[]).map((r) => {
              const M = ROLE_DEFS[r]; const active = selectedRole === r;
              return (
                <button key={r} type="button" onClick={() => setSelectedRole(r)} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                  padding: "12px 6px", borderRadius: 12,
                  border: `2px solid ${active ? "#003366" : bdr}`,
                  background: active ? (isDark ? "rgba(0,51,102,.3)" : "#eef4fb") : card,
                  color: active ? text : sub,
                  cursor: "pointer", fontSize: 11.5, fontWeight: active ? 700 : 500,
                  transition: "all .15s",
                }}>
                  <M.icon style={{ width: 18, height: 18 }} />
                  {M.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <Label style={{ color: sub, fontSize: 12, fontWeight: 700, marginBottom: 6, display: "block" }}>{t("email_label")}</Label>
              <Input type="email" autoComplete="email" placeholder="you@tsid.go.tz" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{ background: card, borderColor: bdr, color: text, height: 44 }} />
            </div>
            <div>
              <Label style={{ color: sub, fontSize: 12, fontWeight: 700, marginBottom: 6, display: "block" }}>{t("password_label")}</Label>
              <div style={{ position: "relative" }}>
                <Input type={showPass ? "text" : "password"} autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
                  style={{ background: card, borderColor: bdr, color: text, height: 44, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} aria-label={showPass ? "Hide password" : "Show password"} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: sub }}>
                  {showPass ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} style={{ background: "#003366", color: "#fff", fontWeight: 700, height: 46, fontSize: 14 }}>
              {loading ? t("signing_in") : `${t("sign_in_as")} ${ROLE_DEFS[selectedRole].label}`}
            </Button>
          </form>

          <div style={{ marginTop: 20, borderRadius: 12, border: `1px solid ${bdr}`, background: isDark ? "#1e293b" : "#f8fafc", padding: 16, fontSize: 12.5, color: sub, lineHeight: 1.6 }}>
            <p style={{ fontWeight: 700, color: text, marginBottom: 6 }}>{t("auth_no_cred")}</p>
            <p>{t("auth_schools_hint")}</p>
            <p>{t("auth_students_hint")}</p>
          </div>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/" style={{ fontSize: 12, color: sub, textDecoration: "none" }}>{t("auth_back_home")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
