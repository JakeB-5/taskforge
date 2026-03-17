"use client";

import * as React from "react";
import type { Task } from "@taskforge/shared";
import { Badge, Checkbox, EmptyState, Spinner } from "@taskforge/ui";
import { CheckSquare } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useWorkspaceStore } from "@/stores/workspace-store";

interface GroupedTasks {
  projectId: string;
  projectName: string;
  tasks: Task[];
}

export function MyTasksView() {
  const [groups, setGroups] = React.useState<GroupedTasks[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);

  React.useEffect(() => {
    async function fetchMyTasks() {
      if (!activeWorkspace) return;
      setIsLoading(true);
      try {
        // Fetch projects first, then tasks for each
        const projectsData = await apiClient.get<any>(
          `/workspaces/${activeWorkspace.id}/projects`
        );
        const projects = projectsData?.projects ?? [];

        const grouped: GroupedTasks[] = [];
        for (const project of projects) {
          try {
            const tasksData = await apiClient.get<any>(
              `/projects/${project.id}/tasks`,
              { assignee: "me", perPage: 50 }
            );
            const tasks = tasksData?.tasks ?? [];
            if (tasks.length > 0) {
              grouped.push({
                projectId: project.id,
                projectName: project.name,
                tasks,
              });
            }
          } catch {
            // Skip projects with errors
          }
        }
        setGroups(grouped);
      } catch {
        // Silent error
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyTasks();
  }, [activeWorkspace]);

  if (isLoading) {
    return <Spinner className="py-12" />;
  }

  const totalTasks = groups.reduce((sum, g) => sum + g.tasks.length, 0);

  if (totalTasks === 0) {
    return (
      <EmptyState
        icon={<CheckSquare className="h-6 w-6 text-muted-foreground" />}
        title="No tasks assigned"
        description="Tasks assigned to you will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.projectId}>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {group.projectName}
          </h3>
          <div className="space-y-1">
            {group.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-lg border px-3 py-2 hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={task.status === "done"}
                  disabled
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                </div>
                <Badge
                  variant={
                    task.priority === "urgent" || task.priority === "high"
                      ? "destructive"
                      : task.priority === "medium"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {task.priority}
                </Badge>
                <Badge variant="outline">{task.status.replace("_", " ")}</Badge>
                {task.dueDate && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
