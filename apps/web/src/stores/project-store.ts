"use client";

import { create } from "zustand";
import type { Project } from "@taskforge/shared";
import type { CreateProjectInput, UpdateProjectInput } from "@taskforge/shared";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/api/projects";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: (workspaceId: string) => Promise<void>;
  fetchProject: (workspaceId: string, projectId: string) => Promise<void>;
  create: (workspaceId: string, data: CreateProjectInput) => Promise<Project>;
  update: (workspaceId: string, projectId: string, data: UpdateProjectInput) => Promise<Project>;
  remove: (workspaceId: string, projectId: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async (workspaceId) => {
    set({ isLoading: true, error: null });
    try {
      const projects = await getProjects(workspaceId);
      set({ projects, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load projects", isLoading: false });
    }
  },

  fetchProject: async (_workspaceId, projectId) => {
    set({ isLoading: true, error: null });
    try {
      const project = await getProject(projectId);
      set({ currentProject: project, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load project", isLoading: false });
    }
  },

  create: async (workspaceId, data) => {
    const project = await createProject(workspaceId, data);
    set((state) => ({ projects: [...state.projects, project] }));
    return project;
  },

  update: async (_workspaceId, projectId, data) => {
    const project = await updateProject(projectId, data);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === projectId ? project : p)),
      currentProject: state.currentProject?.id === projectId ? project : state.currentProject,
    }));
    return project;
  },

  remove: async (_workspaceId, projectId) => {
    await deleteProject(projectId);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
      currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
    }));
  },

  setCurrentProject: (project) => {
    set({ currentProject: project });
  },
}));
