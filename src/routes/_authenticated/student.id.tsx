import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { IdCard } from "@/components/tsid/id-card";

export const Route = createFileRoute("/_authenticated/student/id")({ component: Page });

function Page() {
  const me = useCurrentUser();
  const { data } = useQuery({
    enabled: !!me.userId,
    queryKey: ["my-id", me.userId],
    queryFn: async () => (await supabase.from("students").select("*, schools(name, region)").eq("user_id", me.userId!).maybeSingle()).data,
  });
  if (!data) return <p className="text-sm text-muted-foreground">No student record linked to your account yet.</p>;
  const schools = (data as { schools?: { name?: string; region?: string } | null }).schools;
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>My ID card</h1>
      <IdCard data={{
        tsid_no: data.tsid_no,
        full_name: data.full_name,
        school_name: schools?.name ?? null,
        region: schools?.region ?? null,
        dob: data.dob,
        gender: data.gender,
        photo_url: data.photo_url,
        status: data.status,
      }} />
    </div>
  );
}