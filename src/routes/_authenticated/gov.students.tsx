import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/gov/students")({ component: Page });

function Page() {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  const { data: students = [] } = useQuery({
    queryKey: ["gov-students"],
    queryFn: async () =>
      (await supabase
        .from("students")
        .select("*, schools(name, region, code, district)")
        .order("created_at", { ascending: false }))
        .data ?? [],
  });

  const { data: schools = [] } = useQuery({
    queryKey: ["gov-schools-light"],
    queryFn: async () => (await supabase.from("schools").select("id, name, region, code")).data ?? [],
  });

  const regions = [...new Set((schools as { region?: string }[]).map((s) => s.region).filter(Boolean))] as string[];

  const filtered = students.filter((st: {
    full_name: string; tsid_no: string; region?: string;
    schools?: { name?: string; code?: string; region?: string } | null;
  }) => {
    const q = search.toLowerCase();
    const matchQ = !q
      || st.full_name.toLowerCase().includes(q)
      || st.tsid_no.toLowerCase().includes(q)
      || (st.schools?.name ?? "").toLowerCase().includes(q);
    const matchR = !regionFilter
      || (st.region ?? st.schools?.region ?? "") === regionFilter;
    return matchQ && matchR;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
          National Student Database
        </h1>
        <p className="text-sm text-muted-foreground">
          {students.length} students across {schools.length} schools in {regions.length} regions
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total students", value: students.length, color: "var(--tz-navy)" },
          { label: "Active IDs", value: (students as { status: string }[]).filter((s) => s.status === "active").length, color: "var(--tz-green)" },
          { label: "Registered schools", value: schools.length, color: "var(--tz-blue)" },
          { label: "Regions covered", value: regions.length, color: "var(--tz-gold)" },
        ].map((t) => (
          <div key={t.label} className="rounded-xl border bg-card p-4">
            <div className="text-2xl font-bold" style={{ color: t.color }}>{t.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{t.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          className="max-w-xs"
          placeholder="Search name, TSID or school…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        >
          <option value="">All regions</option>
          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <span className="self-center text-xs text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">School</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((st: {
                id: string; tsid_no: string; full_name: string; dob?: string | null;
                gender?: string | null; photo_url?: string | null; status: string;
                level?: string | null; region?: string | null;
                schools?: { name?: string; code?: string; region?: string } | null;
              }) => (
                <tr key={st.id} className="border-t hover:bg-muted/20">
                  <td className="px-4 py-2">
                    {st.photo_url
                      ? <img src={st.photo_url} className="w-9 h-12 object-cover rounded-md border" alt="" />
                      : <div className="w-9 h-12 rounded-md border bg-muted flex items-center justify-center text-lg">👤</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{st.full_name}</div>
                    <div className="text-xs font-mono text-muted-foreground">{st.tsid_no}</div>
                    <div className="text-xs text-muted-foreground">{st.gender ?? "—"} · {st.dob ?? "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{st.schools?.name ?? "—"}</div>
                    <div className="text-xs font-mono text-muted-foreground">{st.schools?.code ?? ""}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {st.region ?? st.schools?.region ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">{st.level ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      st.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}>
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  {search || regionFilter ? "No students match your filters." : "No students registered yet."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
