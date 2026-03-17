"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import type { Task } from "@taskforge/shared";
import { KanbanBoard } from "@/components/board/kanban-board";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { useAuthStore } from "@/stores/auth-store";

export default function ProjectBoardPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const userId = useAuthStore((s) => s.user?.id ?? "");

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDefaultStatus, setCreateDefaultStatus] = useState<string | undefined>();

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setDetailOpen(true);
  };

  return (
    <div className="p-6">
      <KanbanBoard projectId={projectId} onTaskClick={handleTaskClick} />

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
        defaultStatus={createDefaultStatus}
      />
    </div>
  );
}
