import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/tsid/portal-shell";
import { LayoutDashboard, IdCard, FileCheck2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/student")({
  component: () => (
    <PortalShell
      title="Student Portal"
      subtitle="My TSID"
      items={[
        { to: "/student", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
        { to: "/student/id", label: "My ID card", icon: <IdCard className="h-4 w-4" /> },
        { to: "/student/applications", label: "Applications", icon: <FileCheck2 className="h-4 w-4" /> },
      ]}
    />
  ),
});