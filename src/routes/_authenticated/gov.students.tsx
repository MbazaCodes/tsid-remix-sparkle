import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/gov/students")({ component: Page });

function Page() {
  const [q, setQ] = useState("");
  const { data } = useQuery({
    queryKey: ["gov-students", q],
    queryFn: async () => {
      let qb = supabase.from("students").select("tsid_no, full_name, status, school_id, created_at, schools(name, region)").order("created_at", { ascending: false }).limit(200);
      if (q) qb = qb.or(`tsid_no.ilike.%${q}%,full_name.ilike.%${q}%`);
      const { data } = await qb;
      return data ?? [];
    },
  });
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>All students</h1>
        <Input placeholder="Search by name or TSID…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
      </div>
      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">TSID</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">School</th><th className="px-4 py-3">Region</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((s) => (
              <tr key={s.tsid_no} className="border-t">
                <td className="px-4 py-3 font-mono">{s.tsid_no}</td>
                <td className="px-4 py-3 font-medium">{s.full_name}</td>
                <td className="px-4 py-3">{(s as { schools?: { name?: string } | null }).schools?.name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{(s as { schools?: { region?: string } | null }).schools?.region ?? "—"}</td>
                <td className="px-4 py-3 capitalize">{s.status}</td>
              </tr>
            ))}
            {data && data.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No students yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}