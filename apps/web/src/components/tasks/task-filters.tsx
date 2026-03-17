"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@taskforge/ui";
import { Button } from "@taskforge/ui";
import { Badge } from "@taskforge/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@taskforge/ui";
import { TASK_PRIORITIES, TASK_PRIORITY_LABELS, TASK_STATUSES, TASK_STATUS_LABELS } from "@taskforge/shared";
import type { FilterTasksInput } from "@taskforge/shared";

interface TaskFiltersProps {
  filters: Partial<FilterTasksInput>;
  onFiltersChange: (filters: Partial<FilterTasksInput>) => void;
}

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const [search, setSearch] = useState(filters.search ?? "");

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: search || undefined });
  };

  const activeFilters: string[] = [];
  if (filters.status?.length) activeFilters.push("status");
  if (filters.priority?.length) activeFilters.push("priority");
  if (filters.assigneeId !== undefined) activeFilters.push("assignee");
  if (filters.search) activeFilters.push("search");

  const clearFilters = () => {
    setSearch("");
    onFiltersChange({});
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
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

      <Select
        value={filters.status?.[0] ?? "all"}
        onValueChange={(v) =>
          onFiltersChange({ ...filters, status: v === "all" ? undefined : [v as any] })
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {TASK_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {TASK_STATUS_LABELS[s as keyof typeof TASK_STATUS_LABELS] ?? s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.priority?.[0] ?? "all"}
        onValueChange={(v) =>
          onFiltersChange({ ...filters, priority: v === "all" ? undefined : [v as any] })
        }
      >
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

      {activeFilters.length > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="mr-1 h-3.5 w-3.5" />
          Clear ({activeFilters.length})
        </Button>
      )}
    </div>
  );
}
