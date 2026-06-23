import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { generateTsidNo } from "@/lib/tsid";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/school/students")({ component: Page });

function Page() {
  const me = useCurrentUser();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    enabled: !!me.schoolId,
    queryKey: ["school-students", me.schoolId],
    queryFn: async () => (await supabase.from("students").select("*").eq("school_id", me.schoolId!).order("created_at", { ascending: false })).data ?? [],
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>Students</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button disabled={!me.schoolId}><Plus className="h-4 w-4 mr-2" /> New student</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Register a student</DialogTitle></DialogHeader>
            <NewStudentForm schoolId={me.schoolId!} onDone={() => { setOpen(false); qc.invalidateQueries({ queryKey: ["school-students"] }); }} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">TSID</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">DOB</th><th className="px-4 py-3">Sex</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-3 font-mono">{s.tsid_no}</td>
                <td className="px-4 py-3 font-medium">{s.full_name}</td>
                <td className="px-4 py-3">{s.dob ?? "—"}</td>
                <td className="px-4 py-3">{s.gender ?? "—"}</td>
                <td className="px-4 py-3 capitalize">{s.status}</td>
              </tr>
            ))}
            {data && data.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No students yet. Click "New student" to register one.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewStudentForm({ schoolId, onDone }: { schoolId: string; onDone: () => void }) {
  const [full_name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("M");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const tsid_no = generateTsidNo();
    const { error } = await supabase.from("students").insert({ tsid_no, full_name, dob: dob || null, gender, school_id: schoolId });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Issued ${tsid_no}`);
    onDone();
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div><Label>Full name</Label><Input value={full_name} onChange={(e) => setName(e.target.value)} required /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Date of birth</Label><Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></div>
        <div>
          <Label>Sex</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="M">Male</SelectItem><SelectItem value="F">Female</SelectItem></SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Issuing…" : "Issue TSID"}</Button>
    </form>
  );
}