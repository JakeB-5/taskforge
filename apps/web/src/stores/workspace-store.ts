"use client";

import { create } from "zustand";
import type { Workspace } from "@taskforge/shared";
import {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from "@/lib/api/workspaces";
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from "@taskforge/shared";

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  setActiveWorkspace: (workspace: Workspace) => void;
  create: (data: CreateWorkspaceInput) => Promise<Workspace>;
  update: (id: string, data: UpdateWorkspaceInput) => Promise<Workspace>;
  remove: (id: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  activeWorkspace: null,
  isLoading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const workspaces = await getWorkspaces();
      const savedId = localStorage.getItem("activeWorkspaceId");
      const active = workspaces.find((w) => w.id === savedId) || workspaces[0] || null;
      set({ workspaces, activeWorkspace: active, isLoading: false });
      if (active) {
        localStorage.setItem("activeWorkspaceId", active.id);
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load workspaces", isLoading: false });
    }
  },

  setActiveWorkspace: (workspace) => {
    localStorage.setItem("activeWorkspaceId", workspace.id);
    set({ activeWorkspace: workspace });
  },

  create: async (data) => {
    const workspace = await createWorkspace(data);
    set((state) => ({ workspaces: [...state.workspaces, workspace] }));
    return workspace;
  },

  update: async (id, data) => {
    const workspace = await updateWorkspace(id, data);
    set((state) => ({
      workspaces: state.workspaces.map((w) => (w.id === id ? workspace : w)),
      activeWorkspace: state.activeWorkspace?.id === id ? workspace : state.activeWorkspace,
    }));
    return workspace;
  },

  remove: async (id) => {
    await deleteWorkspace(id);
    set((state) => {
      const workspaces = state.workspaces.filter((w) => w.id !== id);
      const activeWorkspace =
        state.activeWorkspace?.id === id ? workspaces[0] || null : state.activeWorkspace;
      if (activeWorkspace) {
        localStorage.setItem("activeWorkspaceId", activeWorkspace.id);
      } else {
        localStorage.removeItem("activeWorkspaceId");
      }
      return { workspaces, activeWorkspace };
    });
  },
}));
