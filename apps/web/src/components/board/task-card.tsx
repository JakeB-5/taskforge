"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PRIORITY_COLORS } from "@taskforge/shared";
import type { TaskWithRelations } from "@/types";
import { Badge } from "@taskforge/ui";
import { Avatar, AvatarFallback } from "@taskforge/ui";
import { Progress } from "@taskforge/ui";
import { Calendar, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskCardProps {
  task: TaskWithRelations;
  onClick: (task: TaskWithRelations) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColor = PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] ?? "#94a3b8";

  const subtasks = task.subtasks ?? [];
  const completedSubtasks = subtasks.filter((s) => s.status === "done").length;
  const totalSubtasks = subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const commentCount = task.comments?.length ?? 0;
  const labels = task.labels ?? [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "rounded-lg border bg-white p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow",
        isDragging && "opacity-50 shadow-lg"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick(task);
      }}
    >
      {/* Labels */}
      {labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {labels.map((label) => (
            <span
              key={label.id}
              className="inline-block h-2 w-8 rounded-full"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium leading-snug">{task.title}</p>

      {/* Subtask progress */}
      {totalSubtasks > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Subtasks</span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <Progress value={subtaskProgress} className="h-1" />
        </div>
      )}

      {/* Footer */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Priority badge */}
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 capitalize"
            style={{ borderColor: priorityColor, color: priorityColor }}
          >
            {task.priority}
          </Badge>

          {/* Due date */}
          {task.dueDate && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}

          {/* Comment count */}
          {commentCount > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              {commentCount}
            </span>
          )}
        </div>

        {/* Assignee */}
        {task.assignee && (
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[8px]">
              {(task.assignee.name ?? "?").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
