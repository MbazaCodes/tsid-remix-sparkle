import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/student/")({ component: Page });

function Page() {
  const me = useCurrentUser();
  const { data: student, refetch } = useQuery({
    enabled: !!me.userId,
    queryKey: ["my-student", me.userId],
    queryFn: async () => (await supabase.from("students").select("*, schools(name, region)").eq("user_id", me.userId!).maybeSingle()).data,
  });

  if (me.loading) return null;

  if (!student) {
    return <ClaimForm onDone={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>Habari, {student.full_name}</h1>
        <p className="text-sm text-muted-foreground">Your TSID number is <span className="font-mono text-foreground">{student.tsid_no}</span></p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-card p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Status</div><div className="mt-1 text-2xl font-bold capitalize">{student.status}</div></div>
        <div className="rounded-2xl border bg-card p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">School</div><div className="mt-1 text-base font-semibold">{(student as { schools?: { name?: string } | null }).schools?.name ?? "—"}</div></div>
        <div className="rounded-2xl border bg-card p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Region</div><div className="mt-1 text-base font-semibold">{(student as { schools?: { region?: string } | null }).schools?.region ?? "—"}</div></div>
      </div>
      <Button asChild><Link to="/student/id">View my ID card →</Link></Button>
    </div>
  );
}

function ClaimForm({ onDone }: { onDone: () => void }) {
  const me = useCurrentUser();
  const [tsid_no, setNo] = useState("");
  const [loading, setLoading] = useState(false);
  async function claim(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const { data: row, error: findErr } = await supabase.from("students").select("id").eq("tsid_no", tsid_no.trim()).maybeSingle();
    if (findErr || !row) { toast.error("That TSID number was not found."); setLoading(false); return; }
    const { error } = await supabase.from("students").update({ user_id: me.userId }).eq("id", row.id).is("user_id", null);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Linked!");
    onDone();
  }
  return (
    <div className="max-w-xl rounded-2xl border bg-card p-6">
      <div className="flex items-center gap-2 text-amber-600 font-semibold"><AlertTriangle className="h-5 w-5" /> Link your TSID</div>
      <p className="mt-2 text-sm text-muted-foreground">Enter the TSID number your school issued to you to link it to this account.</p>
      <form onSubmit={claim} className="mt-4 space-y-3">
        <div><Label>TSID number</Label><Input value={tsid_no} onChange={(e) => setNo(e.target.value)} className="font-mono" required /></div>
        <Button type="submit" disabled={loading}>{loading ? "Linking…" : "Link my ID"}</Button>
      </form>
    </div>
  );
}