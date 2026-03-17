"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge, Skeleton } from "@taskforge/ui";
import type { Task } from "@taskforge/shared";

interface MyTasksSummaryProps {
  tasks: Task[];
  loading: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  backlog: { label: "Backlog", variant: "outline" },
  todo: { label: "To Do", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "default" },
  in_review: { label: "In Review", variant: "default" },
  done: { label: "Done", variant: "secondary" },
};

export function MyTasksSummary({ tasks, loading }: MyTasksSummaryProps) {
  const grouped = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (task.status === "done" || task.status === "cancelled") return acc;
    const group = acc[task.status] || [];
    group.push(task);
    acc[task.status] = group;
    return acc;
  }, {});

  const statusOrder = ["in_progress", "in_review", "todo", "backlog"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : Object.keys(grouped).length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {statusOrder.map((status) => {
              const items = grouped[status];
              if (!items || items.length === 0) return null;
              const config = STATUS_CONFIG[status] || { label: status, variant: "outline" as const };
              return (
                <div key={status}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={config.variant}>{config.label}</Badge>
                    <span className="text-xs text-muted-foreground">{items.length}</span>
                  </div>
                  <div className="space-y-1">
                    {items.slice(0, 5).map((task) => (
                      <div key={task.id} className="text-sm truncate pl-2 border-l-2 border-muted py-0.5">
                        {task.title}
                      </div>
                    ))}
                    {items.length > 5 && (
                      <p className="text-xs text-muted-foreground pl-2">
                        +{items.length - 5} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No active tasks assigned to you.</p>
        )}
      </CardContent>
    </Card>
  );
}
