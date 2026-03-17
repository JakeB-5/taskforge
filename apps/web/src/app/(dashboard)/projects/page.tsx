"use client";

import { useEffect, useState, useMemo } from "react";
import { useProjectStore } from "@/stores/project-store";
import { Button, Skeleton, EmptyState } from "@taskforge/ui";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilters } from "@/components/projects/project-filters";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { FolderKanban, LayoutGrid, List } from "lucide-react";
import type { ProjectStatus, CreateProjectInput } from "@taskforge/shared";

export default function ProjectsPage() {
  const { projects, isLoading, fetchProjects, create } = useProjectStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const workspaceId = localStorage.getItem("activeWorkspaceId");
    if (workspaceId) {
      fetchProjects(workspaceId);
    }
  }, [fetchProjects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [projects, search, statusFilter]);

  async function handleCreateProject(data: CreateProjectInput) {
    const workspaceId = localStorage.getItem("activeWorkspaceId");
    if (!workspaceId) throw new Error("No workspace selected");
    await create(workspaceId, data);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your workspace projects.</p>
        </div>
        <CreateProjectDialog onSubmit={handleCreateProject} />
      </div>

      <div className="flex items-center justify-between gap-4">
        <ProjectFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className={viewMode === "grid" ? "h-40" : "h-20"} />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FolderKanban className="h-6 w-6 text-muted-foreground" />}
          title={search || statusFilter !== "all" ? "No matching projects" : "No projects yet"}
          description={
            search || statusFilter !== "all"
              ? "Try adjusting your filters."
              : "Create your first project to start organizing tasks."
          }
        />
      )}
    </div>
  );
}
