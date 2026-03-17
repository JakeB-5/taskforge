"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@taskforge/ui";
import { FolderKanban } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Project } from "@taskforge/shared";

interface ProjectCardProps {
  project: Project;
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  completed: "secondary",
  archived: "outline",
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-md flex items-center justify-center"
                style={{ backgroundColor: project.color || "hsl(var(--primary))" }}
              >
                <FolderKanban className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-base">{project.name}</CardTitle>
            </div>
            <Badge variant={STATUS_VARIANT[project.status] || "outline"}>
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {project.description}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
            </span>
            {project.endDate && (
              <span>Due {new Date(project.endDate).toLocaleDateString()}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
