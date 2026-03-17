"use client";

import { WorkspaceForm } from "@/components/settings/workspace-form";
import { DangerZone } from "@/components/settings/danger-zone";

export default function WorkspaceSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
        <p className="text-muted-foreground">Manage your workspace configuration.</p>
      </div>
      <WorkspaceForm />
      <DangerZone />
    </div>
  );
}
