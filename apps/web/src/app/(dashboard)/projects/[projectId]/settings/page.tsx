"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@taskforge/ui";
import { Settings } from "lucide-react";

export default function ProjectSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Project Settings</CardTitle>
        </div>
        <CardDescription>Configure project details, members, and permissions.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Project settings will be available here.</p>
      </CardContent>
    </Card>
  );
}
