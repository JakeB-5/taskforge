import type { Workspace, WorkspaceMember } from "@taskforge/shared";
import type { CreateWorkspaceInput, UpdateWorkspaceInput, InviteMemberInput, UpdateMemberRoleInput } from "@taskforge/shared";
import { apiClient } from "../api-client";

export async function getWorkspaces(): Promise<Workspace[]> {
  const res = await apiClient.get<{ workspaces: Workspace[] }>("/workspaces");
  return res.workspaces;
}

export async function getWorkspace(id: string): Promise<Workspace> {
  const res = await apiClient.get<{ workspace: Workspace }>(`/workspaces/${id}`);
  return res.workspace;
}

export async function createWorkspace(data: CreateWorkspaceInput): Promise<Workspace> {
  const res = await apiClient.post<{ workspace: Workspace }>("/workspaces", data);
  return res.workspace;
}

export async function updateWorkspace(id: string, data: UpdateWorkspaceInput): Promise<Workspace> {
  const res = await apiClient.patch<{ workspace: Workspace }>(`/workspaces/${id}`, data);
  return res.workspace;
}

export async function deleteWorkspace(id: string): Promise<void> {
  return apiClient.delete(`/workspaces/${id}`);
}

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const res = await apiClient.get<{ members: WorkspaceMember[] }>(`/workspaces/${workspaceId}/members`);
  return res.members;
}

export async function inviteMember(workspaceId: string, data: InviteMemberInput): Promise<WorkspaceMember[]> {
  const res = await apiClient.post<{ members: WorkspaceMember[] }>(`/workspaces/${workspaceId}/members`, data);
  return res.members;
}

export async function updateMemberRole(workspaceId: string, memberId: string, data: UpdateMemberRoleInput): Promise<WorkspaceMember> {
  const res = await apiClient.patch<{ member: WorkspaceMember }>(`/workspaces/${workspaceId}/members/${memberId}`, data);
  return res.member;
}

export async function removeMember(workspaceId: string, memberId: string): Promise<void> {
  return apiClient.delete(`/workspaces/${workspaceId}/members/${memberId}`);
}
