import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/tsid/portal-shell";
import { LayoutDashboard, Users, FileCheck2, Settings } from "lucide-react";

export const Route = createFileRoute("/_authenticated/school")({
  component: () => (
    <PortalShell
      title="School Portal"
      subtitle="Issuer"
      items={[
        { to: "/school", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
        { to: "/school/students", label: "Students", icon: <Users className="h-4 w-4" /> },
        { to: "/school/applications", label: "Applications", icon: <FileCheck2 className="h-4 w-4" /> },
        { to: "/school/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
      ]}
    />
  ),
});