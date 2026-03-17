"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@taskforge/ui";
import { Button } from "@taskforge/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@taskforge/ui";
import { TASK_PRIORITIES, TASK_PRIORITY_LABELS } from "@taskforge/shared";
import { useTaskStore } from "@/stores/task-store";

interface BoardFiltersProps {
  projectId: string;
}

export function BoardFilters({ projectId }: BoardFiltersProps) {
  const { filters, setFilters, fetchTasks } = useTaskStore();
  const [search, setSearch] = useState(filters.search ?? "");

  const handleSearch = () => {
    setFilters({ search: search || undefined });
    fetchTasks(projectId, { search: search || undefined });
  };

  const handlePriorityChange = (value: string) => {
    const priority = value === "all" ? undefined : [value as any];
    setFilters({ priority });
    fetchTasks(projectId, { priority });
  };

  const handleAssigneeChange = (value: string) => {
    const assigneeId = value === "all" ? undefined : value === "unassigned" ? null : value;
    setFilters({ assigneeId });
    fetchTasks(projectId, { assigneeId });
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="pl-9 text-sm"
        />
      </div>

      <Select onValueChange={handlePriorityChange} defaultValue="all">
        <SelectTrigger className="w-[140px]">
          <Filter className="mr-1 h-3.5 w-3.5" />
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {TASK_PRIORITIES.map((p) => (
            <SelectItem key={p} value={p}>
              {TASK_PRIORITY_LABELS[p as keyof typeof TASK_PRIORITY_LABELS] ?? p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handleAssigneeChange} defaultValue="all">
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
