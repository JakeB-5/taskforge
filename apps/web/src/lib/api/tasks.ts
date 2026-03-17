import type { Task, Pagination } from "@taskforge/shared";
import type { CreateTaskInput, UpdateTaskInput, MoveTaskInput, FilterTasksInput } from "@taskforge/shared";
import { apiClient } from "../api-client";

interface TaskListResponse {
  tasks: Task[];
  pagination: Pagination;
}

export async function getTasks(projectId: string, filters?: Partial<FilterTasksInput>): Promise<TaskListResponse> {
  return apiClient.get<TaskListResponse>(`/projects/${projectId}/tasks`, filters as Record<string, unknown>);
}

export async function getTask(projectId: string, taskId: string): Promise<Task> {
  return apiClient.get<Task>(`/projects/${projectId}/tasks/${taskId}`);
}

export async function createTask(projectId: string, data: CreateTaskInput): Promise<Task> {
  return apiClient.post<Task>(`/projects/${projectId}/tasks`, data);
}

export async function updateTask(projectId: string, taskId: string, data: UpdateTaskInput): Promise<Task> {
  return apiClient.patch<Task>(`/projects/${projectId}/tasks/${taskId}`, data);
}

export async function moveTask(projectId: string, taskId: string, data: MoveTaskInput): Promise<Task> {
  return apiClient.post<Task>(`/projects/${projectId}/tasks/${taskId}/move`, data);
}

export async function deleteTask(projectId: string, taskId: string): Promise<void> {
  return apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
}
