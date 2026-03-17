import type { Label } from "@taskforge/shared";
import type { CreateLabelInput, UpdateLabelInput } from "@taskforge/shared";
import { apiClient } from "../api-client";

export async function getLabels(workspaceId: string): Promise<Label[]> {
  return apiClient.get<Label[]>(`/workspaces/${workspaceId}/labels`);
}

export async function createLabel(workspaceId: string, data: CreateLabelInput): Promise<Label> {
  return apiClient.post<Label>(`/workspaces/${workspaceId}/labels`, data);
}

export async function updateLabel(workspaceId: string, labelId: string, data: UpdateLabelInput): Promise<Label> {
  return apiClient.patch<Label>(`/workspaces/${workspaceId}/labels/${labelId}`, data);
}

export async function deleteLabel(workspaceId: string, labelId: string): Promise<void> {
  return apiClient.delete(`/workspaces/${workspaceId}/labels/${labelId}`);
}
