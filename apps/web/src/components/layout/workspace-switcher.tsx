"use client";

import { useState, useEffect } from "react";
import { ChevronsUpDown, Plus, Building2 } from "lucide-react";
import { Button } from "@taskforge/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@taskforge/ui";
import type { Workspace } from "@taskforge/shared";
import { getWorkspaces } from "@/lib/api/workspaces";

interface WorkspaceSwitcherProps {
  collapsed: boolean;
}

export function WorkspaceSwitcher({ collapsed }: WorkspaceSwitcherProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    getWorkspaces()
      .then((data) => {
        setWorkspaces(data);
        // Load saved workspace or use first
        const savedId = localStorage.getItem("activeWorkspaceId");
        const saved = data.find((w) => w.id === savedId);
        setActiveWorkspace(saved || data[0] || null);
      })
      .catch(() => {});
  }, []);

  function switchWorkspace(workspace: Workspace) {
    setActiveWorkspace(workspace);
    localStorage.setItem("activeWorkspaceId", workspace.id);
    // Trigger page refresh to load new workspace data
    window.location.reload();
  }

  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-full h-10">
            <Building2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-56">
          {workspaces.map((ws) => (
            <DropdownMenuItem
              key={ws.id}
              onClick={() => switchWorkspace(ws)}
              className={ws.id === activeWorkspace?.id ? "bg-accent" : ""}
            >
              <Building2 className="mr-2 h-4 w-4" />
              {ws.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            Create Workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-3 text-sm font-medium"
        >
          <div className="flex items-center gap-2 truncate">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{activeWorkspace?.name || "Select workspace"}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => switchWorkspace(ws)}
            className={ws.id === activeWorkspace?.id ? "bg-accent" : ""}
          >
            <Building2 className="mr-2 h-4 w-4" />
            {ws.name}
          </DropdownMenuItem>
        ))}
        {workspaces.length > 0 && <DropdownMenuSeparator />}
        <DropdownMenuItem>
          <Plus className="mr-2 h-4 w-4" />
          Create Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
