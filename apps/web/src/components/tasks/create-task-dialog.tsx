"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, type CreateTaskInput } from "@taskforge/shared";
import { TASK_STATUSES, TASK_STATUS_LABELS, TASK_PRIORITIES, TASK_PRIORITY_LABELS, TASK_TYPES, TASK_TYPE_LABELS } from "@taskforge/shared";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@taskforge/ui";
import { Button } from "@taskforge/ui";
import { Input } from "@taskforge/ui";
import { Textarea } from "@taskforge/ui";
import { Label } from "@taskforge/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@taskforge/ui";
import { useTaskStore } from "@/stores/task-store";

interface CreateTaskDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStatus?: string;
}

export function CreateTaskDialog({ projectId, open, onOpenChange, defaultStatus }: CreateTaskDialogProps) {
  const createTask = useTaskStore((s) => s.create);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: (defaultStatus as any) ?? "backlog",
      priority: "none",
      type: "task",
      assigneeId: null,
      dueDate: null,
    },
  });

  const handleSubmit = async (data: CreateTaskInput) => {
    setIsSubmitting(true);
    try {
      await createTask(projectId, data);
      form.reset();
      onOpenChange(false);
    } catch {
      // Error handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input {...form.register("title")} placeholder="Task title" className="mt-1" />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...form.register("description")} placeholder="Optional description..." className="mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <Select value={form.watch("status")} onValueChange={(v) => form.setValue("status", v as any)}>
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
              <Label>Priority</Label>
              <Select value={form.watch("priority")} onValueChange={(v) => form.setValue("priority", v as any)}>
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={form.watch("type")} onValueChange={(v) => form.setValue("type", v as any)}>
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

            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                className="mt-1"
                onChange={(e) => form.setValue("dueDate", e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
