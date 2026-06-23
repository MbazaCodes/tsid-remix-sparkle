import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { roleHome, type Role } from "@/lib/tsid";

export const Route = createFileRoute("/_authenticated/")({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/auth" });
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
    throw redirect({ to: roleHome(roleRow?.role as Role) });
  },
  component: () => null,
});