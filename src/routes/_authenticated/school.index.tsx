import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Users, FileCheck2, BadgeCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/school/")({ component: Page });

function Page() {
  const me = useCurrentUser();
  const { data: school } = useQuery({
    enabled: !!me.schoolId,
    queryKey: ["school", me.schoolId],
    queryFn: async () => (await supabase.from("schools").select("*").eq("id", me.schoolId!).maybeSingle()).data,
  });
  const { data: counts } = useQuery({
    enabled: !!me.schoolId,
    queryKey: ["school-kpis", me.schoolId],
    queryFn: async () => {
      const [s, a, act] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }).eq("school_id", me.schoolId!),
        supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("students").select("id", { count: "exact", head: true }).eq("school_id", me.schoolId!).eq("status", "active"),
      ]);
      return { students: s.count ?? 0, apps: a.count ?? 0, active: act.count ?? 0 };
    },
  });

  if (!me.loading && !me.schoolId) {
    return (
      <div className="rounded-2xl border bg-card p-8 max-w-xl">
        <div className="flex items-center gap-2 text-amber-600 font-semibold"><AlertTriangle className="h-5 w-5" /> No school linked</div>
        <p className="mt-2 text-sm text-muted-foreground">Pick the school you administer to start issuing student IDs.</p>
        <Button asChild className="mt-4"><Link to="/school/settings">Link my school</Link></Button>
      </div>
    );
  }

  const tiles = [
    { label: "Students", value: counts?.students ?? "—", icon: Users, color: "var(--tz-green)" },
    { label: "Active IDs", value: counts?.active ?? "—", icon: BadgeCheck, color: "var(--tz-blue)" },
    { label: "Pending applications", value: counts?.apps ?? "—", icon: FileCheck2, color: "var(--tz-gold)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>{school?.name ?? "School dashboard"}</h1>
        <p className="text-sm text-muted-foreground">{school?.region} {school?.district && `· ${school.district}`} · Code <span className="font-mono">{school?.code}</span></p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
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
      <Button asChild className="bg-primary"><Link to="/school/students">Register a new student →</Link></Button>
    </div>
  );
}