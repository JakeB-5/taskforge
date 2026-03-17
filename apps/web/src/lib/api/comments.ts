import type { Comment } from "@taskforge/shared";
import type { CreateCommentInput, UpdateCommentInput } from "@taskforge/shared";
import { apiClient } from "../api-client";

export async function getComments(taskId: string): Promise<Comment[]> {
  return apiClient.get<Comment[]>(`/tasks/${taskId}/comments`);
}

export async function createComment(taskId: string, data: CreateCommentInput): Promise<Comment> {
  return apiClient.post<Comment>(`/tasks/${taskId}/comments`, data);
}

export async function updateComment(taskId: string, commentId: string, data: UpdateCommentInput): Promise<Comment> {
  return apiClient.patch<Comment>(`/tasks/${taskId}/comments/${commentId}`, data);
}

export async function deleteComment(taskId: string, commentId: string): Promise<void> {
  return apiClient.delete(`/tasks/${taskId}/comments/${commentId}`);
}
