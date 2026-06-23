import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/school/applications")({ component: Page });

function Page() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["school-apps"],
    queryFn: async () => (await supabase.from("applications").select("*, students(tsid_no, full_name)").order("created_at", { ascending: false })).data ?? [],
  });
  async function setStatus(id: string, status: "approved" | "rejected") {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["school-apps"] }); }
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>Applications</h1>
      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">When</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Student</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((a) => {
              const stu = (a as { students?: { tsid_no?: string; full_name?: string } | null }).students;
              return (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{a.type}</td>
                  <td className="px-4 py-3"><div className="font-medium">{stu?.full_name ?? "—"}</div><div className="font-mono text-xs text-muted-foreground">{stu?.tsid_no}</div></td>
                  <td className="px-4 py-3 capitalize">{a.status}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {a.status === "pending" && (<>
                      <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "rejected")}>Reject</Button>
                      <Button size="sm" onClick={() => setStatus(a.id, "approved")}>Approve</Button>
                    </>)}
                  </td>
                </tr>
              );
            })}
            {data && data.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No applications yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}