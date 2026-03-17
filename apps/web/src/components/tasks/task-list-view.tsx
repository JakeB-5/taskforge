"use client";

import { useEffect, useState, useCallback } from "react";
import type { Task, FilterTasksInput } from "@taskforge/shared";
import { Button } from "@taskforge/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@taskforge/ui";
import { Checkbox } from "@taskforge/ui";
import { Spinner } from "@taskforge/ui";
import { Trash2 } from "lucide-react";
import { useTaskStore } from "@/stores/task-store";
import { TaskRow } from "./task-row";
import { TaskFilters } from "./task-filters";

interface TaskListViewProps {
  projectId: string;
  onTaskClick: (task: Task) => void;
}

export function TaskListView({ projectId, onTaskClick }: TaskListViewProps) {
  const { tasks, isLoading, filters, fetchTasks, setFilters, remove, update } = useTaskStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTasks(projectId);
  }, [projectId, fetchTasks]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<FilterTasksInput>) => {
      setFilters(newFilters);
      fetchTasks(projectId, newFilters);
    },
    [projectId, setFilters, fetchTasks]
  );

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(tasks.map((t) => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    for (const id of selectedIds) {
      await update(projectId, id, { status: status as any });
    }
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await remove(projectId, id);
    }
    setSelectedIds(new Set());
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const sortBy = filters.sortBy ?? "position";
    const dir = filters.sortDirection === "desc" ? -1 : 1;
    const aVal = (a as any)[sortBy] ?? "";
    const bVal = (b as any)[sortBy] ?? "";
    return aVal < bVal ? -dir : aVal > bVal ? dir : 0;
  });

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div>
      <TaskFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <div className="mt-3 flex items-center gap-3 rounded-lg bg-muted p-2">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <Select onValueChange={handleBulkStatusChange}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="mt-4 rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 w-10">
                <Checkbox
                  checked={tasks.length > 0 && selectedIds.size === tasks.length}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Title</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Priority</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Assignee</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                selected={selectedIds.has(task.id)}
                onSelect={handleSelect}
                onClick={onTaskClick}
              />
            ))}
          </tbody>
        </table>
        {tasks.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No tasks found. Create your first task to get started.
          </div>
        )}
      </div>
    </div>
  );
}
