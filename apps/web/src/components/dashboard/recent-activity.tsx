"use client";

import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@taskforge/ui";
import { formatDistanceToNow } from "date-fns";
import type { DashboardStats } from "@/lib/api/dashboard";

interface RecentActivityProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export function RecentActivity({ stats, loading }: RecentActivityProps) {
  const activities = stats?.recentActivity ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 text-sm">
                <div className="h-2 w-2 mt-1.5 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        )}
      </CardContent>
    </Card>
  );
}
