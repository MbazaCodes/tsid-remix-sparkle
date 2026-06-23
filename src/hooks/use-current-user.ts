import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/lib/tsid";

export type CurrentUser = {
  loading: boolean;
  userId: string | null;
  email: string | null;
  role: Role | null;
  schoolId: string | null;
  fullName: string | null;
};

export function useCurrentUser(): CurrentUser {
  const [state, setState] = useState<CurrentUser>({
    loading: true, userId: null, email: null, role: null, schoolId: null, fullName: null,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setState({ loading: false, userId: null, email: null, role: null, schoolId: null, fullName: null });
        return;
      }
      const [{ data: roleRow }, { data: profile }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
        supabase.from("profiles").select("full_name, school_id").eq("id", user.id).maybeSingle(),
      ]);
      if (cancelled) return;
      setState({
        loading: false,
        userId: user.id,
        email: user.email ?? null,
        role: (roleRow?.role as Role) ?? null,
        schoolId: profile?.school_id ?? null,
        fullName: profile?.full_name ?? null,
      });
    }
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  return state;
}