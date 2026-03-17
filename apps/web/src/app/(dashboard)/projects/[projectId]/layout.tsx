"use client";

import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useProjectStore } from "@/stores/project-store";
import { Badge, Skeleton, Tabs, TabsList, TabsTrigger } from "@taskforge/ui";
import { FolderKanban } from "lucide-react";

const tabs = [
  { href: "", label: "Board" },
  { href: "/list", label: "List" },
  { href: "/calendar", label: "Calendar" },
  { href: "/timeline", label: "Timeline" },
  { href: "/settings", label: "Settings" },
];

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params.projectId as string;
  const { currentProject, isLoading, fetchProject } = useProjectStore();

  useEffect(() => {
    const workspaceId = localStorage.getItem("activeWorkspaceId");
    if (workspaceId && projectId) {
      fetchProject(workspaceId, projectId);
    }
  }, [projectId, fetchProject]);

  const basePath = `/projects/${projectId}`;
  const activeTab = tabs.find((t) =>
    t.href === "" ? pathname === basePath : pathname === basePath + t.href
  );
  const activeValue = activeTab?.href ?? "";

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-start gap-3">
        {isLoading ? (
          <Skeleton className="h-12 w-full max-w-md" />
        ) : currentProject ? (
          <>
            <div
              className="h-10 w-10 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: currentProject.color || "hsl(var(--primary))" }}
            >
              <FolderKanban className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{currentProject.name}</h1>
                <Badge variant="secondary">{currentProject.status}</Badge>
              </div>
              {currentProject.description && (
                <p className="text-sm text-muted-foreground mt-1">{currentProject.description}</p>
              )}
            </div>
          </>
        ) : (
          <h1 className="text-2xl font-bold">Project not found</h1>
        )}
      </div>

      {/* Sub-navigation Tabs */}
      <Tabs value={activeValue}>
        <TabsList>
          {tabs.map((tab) => (
            <Link key={tab.href} href={basePath + tab.href}>
              <TabsTrigger value={tab.href}>{tab.label}</TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>

      {children}
    </div>
  );
}
