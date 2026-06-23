import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ASSETS, roleHome, type Role } from "@/lib/tsid";
import { toast } from "sonner";
import { Eye, EyeOff, ShieldCheck, GraduationCap, Building2 } from "lucide-react";

const searchSchema = z.object({ role: z.enum(["gov", "school", "student"]).optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — TSID" },
      { name: "description", content: "Sign in to the Tanzania Student Identification System." },
    ],
  }),
  component: AuthPage,
});

const ROLE_LABELS: Record<Role, { label: string; desc: string; icon: typeof ShieldCheck }> = {
  gov: { label: "Government", desc: "Wizara ya Elimu officer", icon: ShieldCheck },
  school: { label: "School Admin", desc: "School administrator", icon: Building2 },
  student: { label: "Student / Parent", desc: "Student or guardian", icon: GraduationCap },
};

function AuthPage() {
  const { role: defaultRole } = Route.useSearch();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>(defaultRole ?? "school");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: roleRow } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.session.user.id)
          .maybeSingle();
        navigate({ to: roleHome(roleRow?.role as Role), replace: true });
      }
    })();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message || "Invalid email or password.");
      setLoading(false);
      return;
    }

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user!.id)
      .maybeSingle();

    const actualRole = roleRow?.role as Role | null;
    if (!actualRole) {
      toast.error("No TSID profile found. Contact your administrator.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (actualRole !== selectedRole) {
      toast.error(`This account is registered as "${actualRole}". Redirecting…`);
      setTimeout(() => navigate({ to: roleHome(actualRole), replace: true }), 900);
      setLoading(false);
      return;
    }

    navigate({ to: roleHome(actualRole), replace: true });
  }

  const RoleIcon = ROLE_LABELS[selectedRole].icon;

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between bg-sidebar text-sidebar-foreground p-10">
        <div className="tz-flag-stripe -mx-10 -mt-10" />
        <Link to="/" className="flex items-center gap-3 mt-4">
          <img src={ASSETS.logo} className="h-12 w-12" alt="" />
          <div>
            <div className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>TSID</div>
            <div className="text-xs opacity-70">Tanzania Student Identification System</div>
          </div>
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Credentials are issued<br />by your administrator.
          </h2>
          <p className="mt-3 text-sm opacity-80 max-w-md">
            There is no self-registration. Government officers create school accounts.
            Schools create student accounts. Students receive their login from their school.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            {(["gov","school","student"] as Role[]).map((r) => {
              const M = ROLE_LABELS[r];
              return (
                <div key={r} className="flex items-center gap-3 opacity-80">
                  <M.icon className="h-4 w-4 flex-shrink-0" />
                  <span><strong>{M.label}</strong> — {M.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs opacity-70">
          <img src={ASSETS.coat} className="h-10 w-10" alt="" />
          Uhuru na Umoja
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-3">
            <img src={ASSETS.logo} className="h-10 w-10" alt="" />
            <div>
              <div className="font-bold" style={{ fontFamily: "var(--font-display)" }}>TSID Portal</div>
              <div className="text-xs text-muted-foreground">Tanzania Student Identification</div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
              Sign in
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Use the credentials issued to you by your administrator.
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2">
            {(["gov","school","student"] as Role[]).map((r) => {
              const M = ROLE_LABELS[r];
              const active = selectedRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <M.icon className="h-5 w-5" />
                  {M.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Email address</Label>
              <Input
                type="email"
                autoComplete="email"
                placeholder="you@tsid.go.tz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary" disabled={loading}>
              {loading ? "Signing in…" : `Sign in as ${ROLE_LABELS[selectedRole].label}`}
            </Button>
          </form>

          <div className="rounded-xl border bg-muted/40 p-4 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Don't have credentials?</p>
            <p><strong>Schools:</strong> Contact the Ministry of Education (Gov) to register.</p>
            <p><strong>Students:</strong> Ask your school administrator for your login details.</p>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
