"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@taskforge/ui";
import { ProfileForm } from "@/components/settings/profile-form";
import { WorkspaceForm } from "@/components/settings/workspace-form";
import { DangerZone } from "@/components/settings/danger-zone";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and workspace settings.</p>
      </div>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="workspace">
          <WorkspaceForm />
        </TabsContent>
        <TabsContent value="danger">
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  );
}
