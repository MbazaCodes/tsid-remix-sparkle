import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/tsid/portal-shell";
import { LayoutDashboard, Users, Building2, ScrollText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/gov")({
  component: () => (
    <PortalShell
      title="Government Portal"
      subtitle="Wizara ya Elimu"
      items={[
        { to: "/gov", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
        { to: "/gov/students", label: "All students", icon: <Users className="h-4 w-4" /> },
        { to: "/gov/schools", label: "Schools", icon: <Building2 className="h-4 w-4" /> },
        { to: "/gov/logs", label: "Audit logs", icon: <ScrollText className="h-4 w-4" /> },
      ]}
    />
  ),
});