import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ASSETS, roleHome, type Role } from "@/lib/tsid";
import { toast } from "sonner";

const searchSchema = z.object({ mode: z.enum(["signin", "signup"]).optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({ meta: [
    { title: "Sign in — TSID" },
    { name: "description", content: "Sign in to the Tanzania Student Identification System." },
  ]}),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>(mode === "signup" ? "signup" : "signin");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id).maybeSingle();
        navigate({ to: roleHome(roleRow?.role as Role), replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-sidebar text-sidebar-foreground p-10">
        <div className="tz-flag-stripe -mx-10 -mt-10" />
        <Link to="/" className="flex items-center gap-3">
          <img src={ASSETS.logo} className="h-12 w-12" alt="" />
          <div>
            <div className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>TSID</div>
            <div className="text-xs opacity-70">Tanzania Student ID</div>
          </div>
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Welcome to the national<br/>student identification platform.
          </h2>
          <p className="mt-3 text-sm opacity-80 max-w-md">Sign in with your school, government or student account to continue.</p>
        </div>
        <div className="flex items-center gap-3 text-xs opacity-70">
          <img src={ASSETS.coat} className="h-10 w-10" alt="" />
          Uhuru na Umoja
        </div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin"><SignInForm /></TabsContent>
            <TabsContent value="signup"><SignUpForm /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function GoogleButton() {
  const [loading, setLoading] = useState(false);
  async function go() {
    setLoading(true);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) { toast.error(r.error.message || "Google sign-in failed"); setLoading(false); return; }
    if (r.redirected) return;
    window.location.href = "/";
  }
  return (
    <Button type="button" variant="outline" className="w-full" onClick={go} disabled={loading}>
      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.55c2.08-1.92 3.29-4.74 3.29-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.55-2.77c-.98.66-2.24 1.06-3.73 1.06-2.87 0-5.3-1.94-6.17-4.54H2.16v2.85A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.83 14.09a6.6 6.6 0 0 1 0-4.18V7.06H2.16a11 11 0 0 0 0 9.88l3.67-2.85Z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.1 14.97 1 12 1A11 11 0 0 0 2.16 7.06l3.67 2.85C6.7 7.32 9.13 5.38 12 5.38Z"/></svg>
      Continue with Google
    </Button>
  );
}

function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", data.user!.id).maybeSingle();
    navigate({ to: roleHome(roleRow?.role as Role), replace: true });
  }
  return (
    <form onSubmit={submit} className="space-y-4 mt-6">
      <GoogleButton />
      <div className="text-center text-xs uppercase tracking-widest text-muted-foreground">or</div>
      <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div className="space-y-2"><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}

function SignUpForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [name, setName] = useState(""); const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: window.location.origin + "/auth",
        data: { full_name: name, role },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    if (!data.session) { toast.success("Check your email to confirm, then sign in."); return; }
    navigate({ to: roleHome(role), replace: true });
  }
  return (
    <form onSubmit={submit} className="space-y-4 mt-6">
      <GoogleButton />
      <div className="text-center text-xs uppercase tracking-widest text-muted-foreground">or</div>
      <div className="space-y-2"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
      <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div className="space-y-2"><Label>Password</Label><Input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
      <div className="space-y-2">
        <Label>I am a</Label>
        <Select value={role} onValueChange={(v) => setRole(v as Role)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="school">School administrator</SelectItem>
            <SelectItem value="gov">Government officer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating…" : "Create account"}</Button>
    </form>
  );
}