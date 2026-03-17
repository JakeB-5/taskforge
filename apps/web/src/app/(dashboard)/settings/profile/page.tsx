"use client";

import { ProfileForm } from "@/components/settings/profile-form";

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Update your personal information.</p>
      </div>
      <ProfileForm />
    </div>
  );
}
