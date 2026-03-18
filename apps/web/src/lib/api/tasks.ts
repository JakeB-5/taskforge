import type { Task, Pagination } from "@taskforge/shared";
import type { CreateTaskInput, UpdateTaskInput, MoveTaskInput, FilterTasksInput } from "@taskforge/shared";
import { apiClient } from "../api-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

interface TaskListResponse {
  tasks: Task[];
  pagination: Pagination;
}

export async function getTasks(projectId: string, filters?: Partial<FilterTasksInput>): Promise<TaskListResponse> {
  // Use raw fetch: paginated() puts pagination at body top-level, not inside body.data
  const url = new URL(`${BASE_URL}/projects/${projectId}/tasks`);
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, String(v)));
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    }
  }
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url.toString(), { method: "GET", headers });
  const body = await response.json();
  // body = { success: true, data: { tasks: [...] }, pagination: {...} }
  return {
    tasks: body.data?.tasks ?? [],
    pagination: body.pagination,
  };
}

export async function getTask(taskId: string): Promise<Task> {
  const res = await apiClient.get<{ task: Task }>(`/tasks/${taskId}`);
  return res.task;
}

export async function createTask(projectId: string, data: CreateTaskInput): Promise<Task> {
  const res = await apiClient.post<{ task: Task }>(`/projects/${projectId}/tasks`, data);
  return res.task;
}

export async function createSubtask(parentTaskId: string, data: CreateTaskInput): Promise<Task> {
  const res = await apiClient.post<{ task: Task }>(`/tasks/${parentTaskId}/subtasks`, data);
  return res.task;
}

export async function updateTask(taskId: string, data: UpdateTaskInput): Promise<Task> {
  const res = await apiClient.patch<{ task: Task }>(`/tasks/${taskId}`, data);
  return res.task;
}

export async function moveTask(taskId: string, data: MoveTaskInput): Promise<Task> {
  const res = await apiClient.patch<{ task: Task }>(`/tasks/${taskId}/position`, data);
  return res.task;
}

export async function deleteTask(taskId: string): Promise<void> {
  return apiClient.delete(`/tasks/${taskId}`);
}

export async function bulkUpdateTasks(taskIds: string[], data: UpdateTaskInput): Promise<void> {
  return apiClient.patch(`/tasks/bulk`, { taskIds, ...data });
}
