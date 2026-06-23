import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/lib/theme";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { IdCard } from "@/components/tsid/id-card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export const Route = createFileRoute("/_authenticated/student/id")({ component: Page });

function Page() {
  const { t } = useTheme();
  const me = useCurrentUser();
  const { data: student } = useQuery({
    enabled: !!me.userId,
    queryKey: ["my-id", me.userId],
    queryFn: async () =>
      (await supabase
        .from("students")
        .select("*, schools(name, code, region, district, contact_phone)")
        .eq("user_id", me.userId!)
        .maybeSingle())
        .data,
  });

  if (!student) {
    return <p className="text-sm text-muted-foreground">No student record linked to your account yet.</p>;
  }

  const sch = (student as { schools?: Record<string, string> | null }).schools;

  const cardData = {
    tsid_no:        student.tsid_no,
    full_name:      student.full_name,
    school_name:    sch?.name ?? null,
    school_code:    sch?.code ?? null,
    region:         (student as { region?: string | null }).region ?? sch?.region ?? null,
    district:       (student as { district?: string | null }).district ?? sch?.district ?? null,
    dob:            (student as { dob?: string | null }).dob ?? null,
    gender:         (student as { gender?: string | null }).gender ?? null,
    nationality:    (student as { nationality?: string | null }).nationality ?? "Tanzanian",
    photo_url:      student.photo_url ?? null,
    status:         student.status,
    level:          (student as { level?: string | null }).level ?? null,
    blood_group:    (student as { blood_group?: string | null }).blood_group ?? null,
    enrollment_date:(student as { enrollment_date?: string | null }).enrollment_date ?? null,
    issue_date:     (student as { issue_date?: string | null }).issue_date ?? null,
    parent_name:    (student as { parent_name?: string | null }).parent_name ?? null,
    parent_nida:    (student as { parent_nida?: string | null }).parent_nida ?? null,
    relationship:   (student as { relationship?: string | null }).relationship ?? null,
    parent_phone:   (student as { parent_phone?: string | null }).parent_phone ?? null,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>My TSID Card</h1>
          <p className="text-sm text-muted-foreground">Your national student identification card. Print or download below.</p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" /> Print
        </Button>
      </div>
      <IdCard data={cardData} showBack={true} downloadable={true} />
    </div>
  );
}
