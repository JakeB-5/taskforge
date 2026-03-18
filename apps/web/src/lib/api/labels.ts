import type { Label } from "@taskforge/shared";
import type { CreateLabelInput, UpdateLabelInput } from "@taskforge/shared";
import { apiClient } from "../api-client";

export async function getLabels(projectId: string): Promise<Label[]> {
  const res = await apiClient.get<{ labels: Label[] }>(`/projects/${projectId}/labels`);
  return res.labels;
}

export async function createLabel(projectId: string, data: CreateLabelInput): Promise<Label> {
  const res = await apiClient.post<{ label: Label }>(`/projects/${projectId}/labels`, data);
  return res.label;
}

export async function updateLabel(labelId: string, data: UpdateLabelInput): Promise<Label> {
  const res = await apiClient.patch<{ label: Label }>(`/labels/${labelId}`, data);
  return res.label;
}

export async function deleteLabel(labelId: string): Promise<void> {
  return apiClient.delete(`/labels/${labelId}`);
}

export async function addLabelToTask(taskId: string, labelId: string): Promise<void> {
  return apiClient.post(`/tasks/${taskId}/labels/${labelId}`);
}

export async function removeLabelFromTask(taskId: string, labelId: string): Promise<void> {
  return apiClient.delete(`/tasks/${taskId}/labels/${labelId}`);
}
