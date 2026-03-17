"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge, Skeleton } from "@taskforge/ui";
import { format } from "date-fns";
import type { DashboardStats } from "@/lib/api/dashboard";

interface UpcomingDeadlinesProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export function UpcomingDeadlines({ stats, loading }: UpcomingDeadlinesProps) {
  const deadlines = stats?.upcomingDeadlines ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : deadlines.length > 0 ? (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {deadlines.map((deadline) => {
              const dueDate = new Date(deadline.dueDate);
              const isOverdue = dueDate < new Date();
              return (
                <div key={deadline.id} className="flex items-center justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.projectName}</p>
                  </div>
                  <Badge variant={isOverdue ? "destructive" : "secondary"} className="whitespace-nowrap shrink-0">
                    {format(dueDate, "MMM d")}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
        )}
      </CardContent>
    </Card>
  );
}
