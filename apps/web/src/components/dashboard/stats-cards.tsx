"use client";

import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@taskforge/ui";
import { CheckCircle, Clock, AlertTriangle, ListTodo } from "lucide-react";
import type { DashboardStats } from "@/lib/api/dashboard";

interface StatsCardsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

const cards = [
  { key: "totalTasks" as const, title: "Total Tasks", icon: ListTodo, color: "text-blue-500" },
  { key: "tasksInProgress" as const, title: "In Progress", icon: Clock, color: "text-yellow-500" },
  { key: "completedTasks" as const, title: "Completed", icon: CheckCircle, color: "text-green-500" },
  { key: "overdueTasks" as const, title: "Overdue", icon: AlertTriangle, color: "text-red-500" },
];

export function StatsCards({ stats, loading }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold">{stats?.[card.key] ?? 0}</div>
            )}
            {!loading && stats && card.key !== "totalTasks" && stats.totalTasks > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(((stats[card.key] ?? 0) / stats.totalTasks) * 100)}% of total
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
