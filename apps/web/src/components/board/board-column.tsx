"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task } from "@taskforge/shared";
import { TASK_STATUS_LABELS, STATUS_COLORS } from "@taskforge/shared";
import { ScrollArea } from "@taskforge/ui";
import { TaskCard } from "./task-card";
import { AddTaskInline } from "./add-task-inline";
import { cn } from "@/lib/utils";

interface BoardColumnProps {
  status: string;
  tasks: Task[];
  projectId: string;
  onTaskClick: (task: Task) => void;
}

export function BoardColumn({ status, tasks, projectId, onTaskClick }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const statusLabel = TASK_STATUS_LABELS[status as keyof typeof TASK_STATUS_LABELS] ?? status;
  const statusColor = STATUS_COLORS[status as keyof typeof STATUS_COLORS] ?? "#94a3b8";

  return (
    <div
      className={cn(
        "flex h-full w-[300px] min-w-[300px] flex-col rounded-lg bg-muted/50",
        isOver && "ring-2 ring-primary/30"
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: statusColor }}
          />
          <h3 className="text-sm font-semibold">{statusLabel}</h3>
          <span className="text-xs text-muted-foreground rounded-full bg-muted px-1.5">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Task list */}
      <ScrollArea className="flex-1 p-2" ref={setNodeRef}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
          </div>
        </SortableContext>

        {/* Inline add */}
        <div className="mt-2">
          <AddTaskInline projectId={projectId} status={status} />
        </div>
      </ScrollArea>
    </div>
  );
}
