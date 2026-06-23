import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2, FileCheck2, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/gov/")({
  component: GovDashboard,
});

function GovDashboard() {
  const { data } = useQuery({
    queryKey: ["gov-kpis"],
    queryFn: async () => {
      const [students, schools, apps, active] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("schools").select("id", { count: "exact", head: true }),
        supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("students").select("id", { count: "exact", head: true }).eq("status", "active"),
      ]);
      return { students: students.count ?? 0, schools: schools.count ?? 0, apps: apps.count ?? 0, active: active.count ?? 0 };
    },
  });
  const tiles = [
    { label: "Students nationwide", value: data?.students ?? "—", icon: Users, color: "var(--tz-green)" },
    { label: "Active IDs", value: data?.active ?? "—", icon: BadgeCheck, color: "var(--tz-blue)" },
    { label: "Registered schools", value: data?.schools ?? "—", icon: Building2, color: "var(--tz-navy)" },
    { label: "Pending applications", value: data?.apps ?? "—", icon: FileCheck2, color: "var(--tz-gold)" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>Government dashboard</h1>
        <p className="text-sm text-muted-foreground">Live overview of national student identification.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-2xl border bg-card p-5">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white" style={{ background: `color-mix(in oklch, ${t.color} 80%, black 20%)` }}>
              <t.icon className="h-4 w-4" />
            </div>
            <div className="mt-3 text-3xl font-bold">{t.value}</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}