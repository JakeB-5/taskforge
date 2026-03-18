"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, type DashboardStats } from "@/lib/api/dashboard";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TaskChart } from "@/components/dashboard/task-chart";
import { PriorityChart } from "@/components/dashboard/priority-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { MyTasksSummary } from "@/components/dashboard/my-tasks-summary";
import { useAuthStore } from "@/stores/auth-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { apiClient } from "@/lib/api-client";
import type { Task } from "@taskforge/shared";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const user = useAuthStore((s) => s.user);
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);

  useEffect(() => {
    const workspaceId = localStorage.getItem("activeWorkspaceId");
    if (workspaceId) {
      getDashboardStats(workspaceId)
        .then(setStats)
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || !activeWorkspace) return;
    // Fetch projects then tasks assigned to current user across all projects
    apiClient
      .get<any>(`/workspaces/${activeWorkspace.id}/projects`)
      .then(async (data) => {
        const projects = data?.projects ?? [];
        const taskArrays = await Promise.all(
          projects.map((p: any) =>
            apiClient
              .get<any>(`/projects/${p.id}/tasks`, { assigneeId: user.id, perPage: 50 })
              .then((res) => res?.tasks ?? [])
              .catch(() => [])
          )
        );
        setMyTasks(taskArrays.flat());
      })
      .catch(() => {});
  }, [user, activeWorkspace]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your workspace activity.</p>
      </div>

      <StatsCards stats={stats} loading={loading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TaskChart stats={stats} loading={loading} />
        <PriorityChart stats={stats} loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RecentActivity stats={stats} loading={loading} />
        <UpcomingDeadlines stats={stats} loading={loading} />
        <MyTasksSummary tasks={myTasks} loading={loading} />
      </div>
    </div>
  );
}
