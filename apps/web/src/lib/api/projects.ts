import type { Project } from "@taskforge/shared";
import type { CreateProjectInput, UpdateProjectInput } from "@taskforge/shared";
import { apiClient } from "../api-client";

export async function getProjects(workspaceId: string): Promise<Project[]> {
  const res = await apiClient.get<{ projects: Project[] }>(`/workspaces/${workspaceId}/projects`);
  return res.projects;
}

export async function getProject(projectId: string): Promise<Project> {
  const res = await apiClient.get<{ project: Project }>(`/projects/${projectId}`);
  return res.project;
}

export async function createProject(workspaceId: string, data: CreateProjectInput): Promise<Project> {
  const res = await apiClient.post<{ project: Project }>(`/workspaces/${workspaceId}/projects`, data);
  return res.project;
}

export async function updateProject(projectId: string, data: UpdateProjectInput): Promise<Project> {
  const res = await apiClient.patch<{ project: Project }>(`/projects/${projectId}`, data);
  return res.project;
}

export async function deleteProject(projectId: string): Promise<void> {
  return apiClient.delete(`/projects/${projectId}`);
}
