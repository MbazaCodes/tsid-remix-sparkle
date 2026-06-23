import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BadgeCheck, BadgeX } from "lucide-react";

export const Route = createFileRoute("/_authenticated/gov/schools")({ component: Page });

function Page() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["gov-schools"],
    queryFn: async () => (await supabase.from("schools").select("*").order("name")).data ?? [],
  });
  async function toggle(id: string, verified: boolean) {
    const { error } = await supabase.from("schools").update({ verified: !verified }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["gov-schools"] }); }
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>Registered schools</h1>
      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Region</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-3 font-mono text-xs">{s.code}</td>
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.region}, {s.district}</td>
                <td className="px-4 py-3">
                  {s.verified
                    ? <span className="inline-flex items-center gap-1 text-[color:var(--tz-green)] text-xs font-semibold"><BadgeCheck className="h-4 w-4" /> Verified</span>
                    : <span className="inline-flex items-center gap-1 text-muted-foreground text-xs"><BadgeX className="h-4 w-4" /> Unverified</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => toggle(s.id, s.verified)}>{s.verified ? "Revoke" : "Verify"}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}