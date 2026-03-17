"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, type DashboardStats } from "@/lib/api/dashboard";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TaskChart } from "@/components/dashboard/task-chart";
import { PriorityChart } from "@/components/dashboard/priority-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { MyTasksSummary } from "@/components/dashboard/my-tasks-summary";
import type { Task } from "@taskforge/shared";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [myTasks] = useState<Task[]>([]);

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
