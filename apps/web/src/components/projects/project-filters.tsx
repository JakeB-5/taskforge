"use client";

import { Input } from "@taskforge/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@taskforge/ui";
import { Search } from "lucide-react";
import type { ProjectStatus } from "@taskforge/shared";

interface ProjectFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: ProjectStatus | "all";
  onStatusChange: (value: ProjectStatus | "all") => void;
}

export function ProjectFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as ProjectStatus | "all")}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
