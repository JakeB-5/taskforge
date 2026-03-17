"use client";

import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@taskforge/ui";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { DashboardStats } from "@/lib/api/dashboard";

interface PriorityChartProps {
  stats: DashboardStats | null;
  loading: boolean;
}

const PRIORITY_COLORS: Record<string, string> = {
  none: "#94a3b8",
  low: "#60a5fa",
  medium: "#fbbf24",
  high: "#f97316",
  urgent: "#ef4444",
};

const PRIORITY_LABELS: Record<string, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export function PriorityChart({ stats, loading }: PriorityChartProps) {
  const data = stats?.tasksByPriority
    ? Object.entries(stats.tasksByPriority)
        .filter(([, count]) => count > 0)
        .map(([priority, count]) => ({
          name: PRIORITY_LABELS[priority] || priority,
          value: count,
          color: PRIORITY_COLORS[priority] || "#94a3b8",
        }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by Priority</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-12">No task data yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
