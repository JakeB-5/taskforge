"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import type { Task } from "@taskforge/shared";
import { Button } from "@taskforge/ui";
import { Plus } from "lucide-react";
import { TaskListView } from "@/components/tasks/task-list-view";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { useAuthStore } from "@/stores/auth-store";

export default function ListPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const userId = useAuthStore((s) => s.user?.id ?? "");

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setDetailOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          New Task
        </Button>
      </div>

      <TaskListView projectId={projectId} onTaskClick={handleTaskClick} />

      <TaskDetailModal
        taskId={selectedTaskId}
        projectId={projectId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        currentUserId={userId}
      />

      <CreateTaskDialog
        projectId={projectId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  );
}
