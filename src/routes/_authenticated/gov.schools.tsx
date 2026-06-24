import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, BadgeCheck, BadgeX, Eye, EyeOff, Copy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/gov/schools")({ component: Page });

const SCHOOL_TYPES = [
  "Primary School",
  "Secondary School",
  "University / College",
  "Vocational Training Centre",
];

const TZ_REGIONS = [
  "Arusha","Dar es Salaam","Dodoma","Geita","Iringa","Kagera","Katavi","Kigoma",
  "Kilimanjaro","Lindi","Manyara","Mara","Mbeya","Morogoro","Mtwara","Mwanza",
  "Njombe","Pemba North","Pemba South","Pwani","Rukwa","Ruvuma","Shinyanga",
  "Simiyu","Singida","Songwe","Tabora","Tanga","Unguja North","Unguja South","Zanzibar",
];

function genCode(region: string) {
  const prefix = region.slice(0, 2).toUpperCase();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${num}`;
}
function genPassword() {
  return "tz" + Math.random().toString(36).slice(2, 8).toUpperCase() + "!";
}

function Page() {
  const qc = useQueryClient();
  const me = useCurrentUser();
  const [open, setOpen] = useState(false);

  const { data: schools = [] } = useQuery({
    queryKey: ["gov-schools"],
    queryFn: async () =>
      (await supabase.from("schools").select("*").order("name")).data ?? [],
  });

  async function toggleVerify(id: string, verified: boolean) {
    const { error } = await supabase.from("schools").update({ verified: !verified }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["gov-schools"] }); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
            Schools
          </h1>
          <p className="text-sm text-muted-foreground">
            Register institutions and issue their admin credentials.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary"><Plus className="h-4 w-4 mr-2" /> Register school</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Register New School</DialogTitle></DialogHeader>
            <RegisterSchoolForm
              actorName={me.fullName ?? "Gov Admin"}
              onDone={() => { setOpen(false); qc.invalidateQueries({ queryKey: ["gov-schools"] }); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total schools", value: schools.length },
          { label: "Verified", value: schools.filter((s: { verified: boolean }) => s.verified).length },
          { label: "Unverified", value: schools.filter((s: { verified: boolean }) => !s.verified).length },
        ].map((t) => (
          <div key={t.label} className="rounded-2xl border bg-card p-4">
            <div className="text-2xl font-bold">{t.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/30 font-semibold text-sm">
          Registered schools ({schools.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">School</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Credentials</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {schools.map((s: {
                id: string; code: string; name: string; type?: string; region?: string;
                district?: string; ward?: string; cred_username?: string; cred_password?: string;
                verified: boolean; status?: string;
              }) => (
                <SchoolRow key={s.id} school={s} onToggle={toggleVerify} />
              ))}
              {schools.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No schools registered yet. Click "Register school" to add the first one.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SchoolRow({
  school,
  onToggle,
}: {
  school: {
    id: string; code: string; name: string; type?: string; region?: string;
    district?: string; cred_username?: string; cred_password?: string; verified: boolean;
  };
  onToggle: (id: string, v: boolean) => void;
}) {
  const [showPass, setShowPass] = useState(false);
  function copy(text: string) {
    navigator.clipboard.writeText(text).then(
        () => toast.success("Copied!"),
        () => toast.error("Could not copy — please copy manually.")
      );
  }
  return (
    <tr className="border-t hover:bg-muted/20">
      <td className="px-4 py-3 font-mono text-xs text-primary font-bold">{school.code}</td>
      <td className="px-4 py-3">
        <div className="font-semibold">{school.name}</div>
        <div className="text-xs text-muted-foreground">{school.type}</div>
      </td>
      <td className="px-4 py-3 text-muted-foreground text-xs">
        {school.region}{school.district ? ` · ${school.district}` : ""}
      </td>
      <td className="px-4 py-3">
        {school.cred_username ? (
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="font-semibold text-foreground">{school.cred_username}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary">
              {showPass ? school.cred_password : "••••••"}
            </span>
            <button onClick={() => setShowPass(!showPass)} aria-label={showPass ? "Hide password" : "Show password"} className="text-muted-foreground hover:text-foreground">
              {showPass ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </button>
            {showPass && school.cred_password && (
              <button onClick={() => copy(school.cred_password!)} className="text-muted-foreground hover:text-foreground">
                <Copy className="h-3 w-3" />
              </button>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">Not set</span>
        )}
      </td>
      <td className="px-4 py-3">
        {school.verified
          ? <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold"><BadgeCheck className="h-3.5 w-3.5" /> Active</span>
          : <span className="inline-flex items-center gap-1 text-muted-foreground text-xs"><BadgeX className="h-3.5 w-3.5" /> Inactive</span>}
      </td>
      <td className="px-4 py-3 text-right">
        <Button size="sm" variant="outline" onClick={() => onToggle(school.id, school.verified)}>
          {school.verified ? "Suspend" : "Activate"}
        </Button>
      </td>
    </tr>
  );
}

function RegisterSchoolForm({ actorName, onDone }: { actorName: string; onDone: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Secondary School");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [issued, setIssued] = useState<{ code: string; username: string; password: string } | null>(null);

  function autoFill(r: string) {
    if (r && !code) setCode(genCode(r));
    if (!password) setPassword(genPassword());
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !region || !code || !username || !password) {
      toast.error("Fill all required fields.");
      return;
    }
    setLoading(true);

    // 1. Insert school
    const { data: school, error: schoolErr } = await supabase
      .from("schools")
      .upsert({
        name, code, region, district, ward, address,
        contact_phone: contactPhone, contact_email: contactEmail,
        cred_username: username, cred_password: password,
        verified: true, status: "active",
        // @ts-ignore – extended column added by migration
        type,
      }, { onConflict: "code" })
      .select()
      .maybeSingle();

    if (schoolErr || !school) {
      toast.error(schoolErr?.message ?? "Failed to create school.");
      setLoading(false);
      return;
    }

    // 2. Log activity
    await supabase.from("activity_logs").insert({
      action: "school:create",
      message: `Registered school ${code} — ${name}`,
      by_name: actorName,
      by_role: "gov",
    }).then(() => {});

    setLoading(false);
    setIssued({ code, username, password });
    toast.success(`School ${code} registered!`);
  }

  if (issued) {
    return (
      <div className="space-y-4 py-2">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5">
          <div className="font-bold text-emerald-800 text-sm mb-3">✅ School registered — share these credentials</div>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">School Code</span><strong className="text-primary">{issued.code}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Username</span><strong>{issued.username}</strong></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Password</span><strong>{issued.password}</strong></div>
          </div>
          <Button className="mt-4 w-full" onClick={() => {
            navigator.clipboard.writeText(`School Code: ${issued.code}\nEmail: ${issued.username}\nPassword: ${issued.password}`);
            toast.success("Credentials copied!");
          }}>
            <Copy className="h-4 w-4 mr-2" /> Copy credentials
          </Button>
        </div>
        <Button variant="outline" className="w-full" onClick={onDone}>Done</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label>Institution Type *</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{SCHOOL_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>School Name *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Shule Ya Sekondari Igogo" required />
        </div>
        <div className="space-y-1.5">
          <Label>Region *</Label>
          <Select value={region} onValueChange={(v) => { setRegion(v); autoFill(v); }}>
            <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
            <SelectContent>{TZ_REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>District</Label>
          <Input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Ilemela" />
        </div>
        <div className="space-y-1.5">
          <Label>Ward</Label>
          <Input value={ward} onChange={(e) => setWard(e.target.value)} placeholder="e.g. Igogo" />
        </div>
        <div className="space-y-1.5">
          <Label>Address</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street / P.O. Box" />
        </div>
        <div className="space-y-1.5">
          <Label>Contact Phone</Label>
          <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+255 7XX XXX XXX" />
        </div>
        <div className="space-y-1.5">
          <Label>Contact Email</Label>
          <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="school@tsid.go.tz" />
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
        <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">🔑 Admin Credentials (auto-generated)</div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label>School Code *</Label>
            <Input className="font-mono font-bold" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. MW1234" required />
          </div>
          <div className="space-y-1.5">
            <Label>Login Email *</Label>
            <Input type="email" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="school@tsid.go.tz" required />
          </div>
          <div className="space-y-1.5">
            <Label>Password *</Label>
            <div className="relative">
              <Input
                type={showPass ? "text" : "password"}
                className="font-mono pr-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => { setCode(region ? genCode(region) : genCode("TZ")); setPassword(genPassword()); }}>
          ↻ Regenerate credentials
        </Button>
      </div>

      <Button type="submit" className="w-full bg-primary" disabled={loading}>
        {loading ? "Registering…" : "🏫 Register School & Issue Credentials"}
      </Button>
    </form>
  );
}
