"use client";

import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@taskforge/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DashboardStats } from "@/lib/api/dashboard";

interface TaskChartProps {
  stats: DashboardStats | null;
  loading: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  backlog: "#94a3b8",
  todo: "#60a5fa",
  in_progress: "#fbbf24",
  in_review: "#a78bfa",
  done: "#34d399",
  cancelled: "#f87171",
};

const STATUS_LABELS: Record<string, string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
  cancelled: "Cancelled",
};

export function TaskChart({ stats, loading }: TaskChartProps) {
  const data = stats?.tasksByStatus
    ? Object.entries(stats.tasksByStatus).map(([status, count]) => ({
        name: STATUS_LABELS[status] || status,
        count,
        fill: STATUS_COLORS[status] || "#94a3b8",
      }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by Status</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} className="text-xs" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-12">No task data yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
