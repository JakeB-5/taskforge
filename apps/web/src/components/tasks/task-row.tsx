"use client";

import type { TaskWithRelations } from "@/types";
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, PRIORITY_COLORS, STATUS_COLORS } from "@taskforge/shared";
import { Badge } from "@taskforge/ui";
import { Checkbox } from "@taskforge/ui";
import { Avatar, AvatarFallback } from "@taskforge/ui";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface TaskRowProps {
  task: TaskWithRelations;
  selected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onClick: (task: TaskWithRelations) => void;
}

export function TaskRow({ task, selected, onSelect, onClick }: TaskRowProps) {
  const statusLabel = TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS] ?? task.status;
  const statusColor = STATUS_COLORS[task.status as keyof typeof STATUS_COLORS] ?? "#94a3b8";
  const priorityLabel = TASK_PRIORITY_LABELS[task.priority as keyof typeof TASK_PRIORITY_LABELS] ?? task.priority;
  const priorityColor = PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] ?? "#94a3b8";
  const assignee = task.assignee;
  const labels = task.labels ?? [];

  return (
    <tr
      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onClick(task)}
    >
      <td className="px-3 py-2 w-10" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(task.id, !!checked)}
        />
      </td>
      <td className="px-3 py-2">
        <div>
          <p className="text-sm font-medium">{task.title}</p>
          {labels.length > 0 && (
            <div className="flex gap-1 mt-1">
              {labels.map((label: any) => (
                <span
                  key={label.id}
                  className="inline-block h-1.5 w-6 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
              ))}
            </div>
          )}
        </div>
      </td>
      <td className="px-3 py-2">
        <Badge variant="outline" className="text-xs capitalize" style={{ borderColor: statusColor, color: statusColor }}>
          {statusLabel}
        </Badge>
      </td>
      <td className="px-3 py-2">
        <Badge variant="outline" className="text-xs capitalize" style={{ borderColor: priorityColor, color: priorityColor }}>
          {priorityLabel}
        </Badge>
      </td>
      <td className="px-3 py-2">
        {assignee ? (
          <div className="flex items-center gap-1.5">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[8px]">
                {(assignee.name ?? "?").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{assignee.name}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </td>
      <td className="px-3 py-2">
        {task.dueDate ? (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(task.dueDate), "MMM d, yyyy")}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </td>
    </tr>
  );
}
