"use client";

import type { TaskWithRelations } from "@/types";
import { TASK_STATUSES, TASK_STATUS_LABELS, TASK_PRIORITIES, TASK_PRIORITY_LABELS, TASK_TYPES, TASK_TYPE_LABELS } from "@taskforge/shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@taskforge/ui";
import { Input } from "@taskforge/ui";
import { Label } from "@taskforge/ui";
import { Separator } from "@taskforge/ui";

interface TaskPropertiesProps {
  task: TaskWithRelations;
  onUpdate: (data: Record<string, any>) => void;
}

export function TaskProperties({ task, onUpdate }: TaskPropertiesProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground">Status</Label>
        <Select value={task.status} onValueChange={(v) => onUpdate({ status: v })}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TASK_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {TASK_STATUS_LABELS[s as keyof typeof TASK_STATUS_LABELS] ?? s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Priority</Label>
        <Select value={task.priority} onValueChange={(v) => onUpdate({ priority: v })}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TASK_PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>
                {TASK_PRIORITY_LABELS[p as keyof typeof TASK_PRIORITY_LABELS] ?? p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Type</Label>
        <Select value={task.type} onValueChange={(v) => onUpdate({ type: v })}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TASK_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {TASK_TYPE_LABELS[t as keyof typeof TASK_TYPE_LABELS] ?? t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <Label className="text-xs text-muted-foreground">Due Date</Label>
        <Input
          type="date"
          className="mt-1"
          value={task.dueDate ? task.dueDate.split("T")[0] : ""}
          onChange={(e) => onUpdate({ dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Estimated Hours</Label>
        <Input
          type="number"
          className="mt-1"
          min={0}
          step={0.5}
          value={task.estimatedHours ?? ""}
          onChange={(e) => onUpdate({ estimatedHours: e.target.value ? Number(e.target.value) : null })}
        />
      </div>

      {/* Labels display */}
      {(task.labels?.length ?? 0) > 0 && (
        <div>
          <Label className="text-xs text-muted-foreground">Labels</Label>
          <div className="mt-1 flex flex-wrap gap-1">
            {task.labels!.map((label: any) => (
              <span
                key={label.id}
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-white"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
