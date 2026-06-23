import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/school/settings")({ component: Page });

function Page() {
  const me = useCurrentUser();
  const qc = useQueryClient();
  const [schoolId, setSchoolId] = useState<string>("");
  useEffect(() => { if (me.schoolId) setSchoolId(me.schoolId); }, [me.schoolId]);
  const { data: schools } = useQuery({
    queryKey: ["all-schools"],
    queryFn: async () => (await supabase.from("schools").select("id, name, region").order("name")).data ?? [],
  });
  async function save() {
    if (!me.userId) return;
    const { error } = await supabase.from("profiles").upsert({ id: me.userId, school_id: schoolId || null, full_name: me.fullName });
    if (error) toast.error(error.message); else { toast.success("Saved"); qc.invalidateQueries(); }
  }
  return (
    <div className="space-y-5 max-w-xl">
      <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>Settings</h1>
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <div>
          <Label>Linked school</Label>
          <Select value={schoolId} onValueChange={setSchoolId}>
            <SelectTrigger><SelectValue placeholder="Pick a school" /></SelectTrigger>
            <SelectContent>
              {(schools ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name} — {s.region}</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">All students you issue will belong to this school.</p>
        </div>
        <Button onClick={save}>Save</Button>
      </div>
    </div>
  );
}