"use client";

import { MyTasksView } from "@/components/tasks/my-tasks-view";

export default function MyTasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground">Tasks assigned to you across all projects.</p>
      </div>
      <MyTasksView />
    </div>
  );
}
