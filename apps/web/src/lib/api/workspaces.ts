import type { Workspace, WorkspaceMember } from "@taskforge/shared";
import type { CreateWorkspaceInput, UpdateWorkspaceInput, InviteMemberInput, UpdateMemberRoleInput } from "@taskforge/shared";
import { apiClient } from "../api-client";

export async function getWorkspaces(): Promise<Workspace[]> {
  return apiClient.get<Workspace[]>("/workspaces");
}

export async function getWorkspace(id: string): Promise<Workspace> {
  return apiClient.get<Workspace>(`/workspaces/${id}`);
}

export async function createWorkspace(data: CreateWorkspaceInput): Promise<Workspace> {
  return apiClient.post<Workspace>("/workspaces", data);
}

export async function updateWorkspace(id: string, data: UpdateWorkspaceInput): Promise<Workspace> {
  return apiClient.patch<Workspace>(`/workspaces/${id}`, data);
}

export async function deleteWorkspace(id: string): Promise<void> {
  return apiClient.delete(`/workspaces/${id}`);
}

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  return apiClient.get<WorkspaceMember[]>(`/workspaces/${workspaceId}/members`);
}

export async function inviteMember(workspaceId: string, data: InviteMemberInput): Promise<WorkspaceMember> {
  return apiClient.post<WorkspaceMember>(`/workspaces/${workspaceId}/members`, data);
}

export async function updateMemberRole(workspaceId: string, memberId: string, data: UpdateMemberRoleInput): Promise<WorkspaceMember> {
  return apiClient.patch<WorkspaceMember>(`/workspaces/${workspaceId}/members/${memberId}`, data);
}

export async function removeMember(workspaceId: string, memberId: string): Promise<void> {
  return apiClient.delete(`/workspaces/${workspaceId}/members/${memberId}`);
}
