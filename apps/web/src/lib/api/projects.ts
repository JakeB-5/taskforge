import type { Project } from "@taskforge/shared";
import type { CreateProjectInput, UpdateProjectInput } from "@taskforge/shared";
import { apiClient } from "../api-client";

export async function getProjects(workspaceId: string): Promise<Project[]> {
  return apiClient.get<Project[]>(`/workspaces/${workspaceId}/projects`);
}

export async function getProject(workspaceId: string, projectId: string): Promise<Project> {
  return apiClient.get<Project>(`/workspaces/${workspaceId}/projects/${projectId}`);
}

export async function createProject(workspaceId: string, data: CreateProjectInput): Promise<Project> {
  return apiClient.post<Project>(`/workspaces/${workspaceId}/projects`, data);
}

export async function updateProject(workspaceId: string, projectId: string, data: UpdateProjectInput): Promise<Project> {
  return apiClient.patch<Project>(`/workspaces/${workspaceId}/projects/${projectId}`, data);
}

export async function deleteProject(workspaceId: string, projectId: string): Promise<void> {
  return apiClient.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
}
