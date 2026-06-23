import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/student/applications")({ component: Page });

function Page() {
  const me = useCurrentUser();
  const qc = useQueryClient();
  const [type, setType] = useState("Replacement ID");
  const [notes, setNotes] = useState("");
  const { data: student } = useQuery({
    enabled: !!me.userId,
    queryKey: ["my-student-id", me.userId],
    queryFn: async () => (await supabase.from("students").select("id").eq("user_id", me.userId!).maybeSingle()).data,
  });
  const { data: apps } = useQuery({
    enabled: !!student?.id,
    queryKey: ["my-apps", student?.id],
    queryFn: async () => (await supabase.from("applications").select("*").eq("student_id", student!.id).order("created_at", { ascending: false })).data ?? [],
  });
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!student?.id || !me.userId) return;
    const { error } = await supabase.from("applications").insert({ student_id: student.id, type, notes, created_by: me.userId });
    if (error) toast.error(error.message); else { toast.success("Submitted"); setNotes(""); qc.invalidateQueries({ queryKey: ["my-apps"] }); }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>Applications</h1>
      {student ? (
        <form onSubmit={submit} className="rounded-2xl border bg-card p-5 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Replacement ID">Replacement ID</SelectItem>
                  <SelectItem value="Name change">Name change</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="Transfer">School transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          </div>
          <Button type="submit">Submit application</Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">Link your TSID number first on the dashboard.</p>
      )}

      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">When</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            {(apps ?? []).map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">{a.type}</td>
                <td className="px-4 py-3 capitalize">{a.status}</td>
              </tr>
            ))}
            {apps && apps.length === 0 && <tr><td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">No applications yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}