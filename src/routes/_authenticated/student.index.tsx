import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/lib/theme";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { IdCard } from "@/components/tsid/id-card";

export const Route = createFileRoute("/_authenticated/student/")({ component: Page });

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-baseline py-2 border-b border-border/50 text-sm gap-3">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`font-medium text-right ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}

function Page() {
  const me = useCurrentUser();
  const { t } = useTheme();

  const { data: student } = useQuery({
    enabled: !!me.userId,
    queryKey: ["my-student", me.userId],
    queryFn: async () =>
      (await supabase.from("students")
        .select("*, schools(name, code, region, district, contact_phone)")
        .eq("user_id", me.userId!)
        .maybeSingle())
        .data,
  });

  if (me.loading) return null;

  if (!student) {
    return (
      <div className="max-w-xl rounded-2xl border bg-card p-8 space-y-3">
        <h2 className="text-xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
          No student record linked
        </h2>
        <p className="text-sm text-muted-foreground">
          Your account hasn't been linked to a student record yet.
          Contact your school — they create your TSID and login credentials.
        </p>
      </div>
    );
  }

  const sch = (student as { schools?: Record<string, string> | null }).schools;
  const firstName = student.full_name.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-primary text-primary-foreground p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Karibu, {firstName}! 👋
          </div>
          <div className="text-sm opacity-80 mt-1 font-mono">{student.tsid_no}</div>
        </div>
        <Button asChild variant="secondary">
          <Link to="/student/id">🪪 View My ID Card →</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Status", value: student.status, color: student.status === "active" ? "text-emerald-700" : "text-red-600" },
          { label: "Level", value: (student as { level?: string | null }).level ?? "—", color: "" },
          { label: "School", value: sch?.name ?? "—", color: "" },
          { label: "Region", value: (student as { region?: string | null }).region ?? sch?.region ?? "—", color: "" },
        ].map((t) => (
          <div key={t.label} className="rounded-xl border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{t.label}</div>
            <div className={`mt-1 font-semibold capitalize truncate ${t.color}`}>{t.value}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Student info */}
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b bg-primary text-primary-foreground font-semibold text-sm">
            📋 Student Information
          </div>
          <div className="px-4 py-2">
            <InfoRow label="TSID Number" value={student.tsid_no} mono />
            <InfoRow label="Full Name" value={student.full_name} />
            <InfoRow label="Date of Birth" value={(student as { dob?: string | null }).dob ?? "—"} />
            <InfoRow label="Gender" value={(student as { gender?: string | null }).gender ?? "—"} />
            <InfoRow label="Nationality" value={(student as { nationality?: string | null }).nationality ?? "Tanzanian"} />
            <InfoRow label="Blood Group" value={(student as { blood_group?: string | null }).blood_group ?? "—"} />
            <InfoRow label="Level" value={(student as { level?: string | null }).level ?? "—"} />
            <InfoRow label="Enrollment Date" value={(student as { enrollment_date?: string | null }).enrollment_date ?? "—"} />
          </div>
        </div>

        {/* School + mini card */}
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/40 font-semibold text-sm">🏫 School</div>
            <div className="px-4 py-2">
              <InfoRow label="School Name" value={sch?.name ?? "—"} />
              <InfoRow label="School Code" value={sch?.code ?? "—"} mono />
              <InfoRow label="Region" value={(student as { region?: string | null }).region ?? sch?.region ?? "—"} />
              <InfoRow label="District" value={(student as { district?: string | null }).district ?? sch?.district ?? "—"} />
              <InfoRow label="Contact" value={sch?.contact_phone ?? "—"} />
            </div>
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/40 font-semibold text-sm">👨‍👩‍👧 Parent / Guardian</div>
            <div className="px-4 py-2">
              <InfoRow label="Name" value={(student as { parent_name?: string | null }).parent_name ?? "—"} />
              <InfoRow label="Relationship" value={(student as { relationship?: string | null }).relationship ?? "—"} />
              <InfoRow label="Phone" value={(student as { parent_phone?: string | null }).parent_phone ?? "—"} />
            </div>
          </div>
        </div>
      </div>

      {/* ID card preview */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b font-semibold text-sm flex items-center justify-between">
          <span>🪪 ID Card Preview</span>
          <Button asChild size="sm" variant="outline">
            <Link to="/student/id">Full size & print →</Link>
          </Button>
        </div>
        <div className="p-6 flex justify-center">
          <IdCard data={{
            tsid_no: student.tsid_no,
            full_name: student.full_name,
            school_name: sch?.name ?? null,
            region: (student as { region?: string | null }).region ?? sch?.region ?? null,
            dob: (student as { dob?: string | null }).dob ?? null,
            gender: (student as { gender?: string | null }).gender ?? null,
            photo_url: student.photo_url ?? null,
            status: student.status,
          }} />
        </div>
      </div>
    </div>
  );
}
