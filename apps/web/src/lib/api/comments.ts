import type { Comment } from "@taskforge/shared";
import type { CreateCommentInput, UpdateCommentInput } from "@taskforge/shared";
import { apiClient } from "../api-client";

export async function getComments(taskId: string): Promise<Comment[]> {
  const res = await apiClient.get<{ comments: Comment[] }>(`/tasks/${taskId}/comments`);
  return res.comments;
}

export async function createComment(taskId: string, data: CreateCommentInput): Promise<Comment> {
  const res = await apiClient.post<{ comment: Comment }>(`/tasks/${taskId}/comments`, data);
  return res.comment;
}

export async function updateComment(commentId: string, data: UpdateCommentInput): Promise<Comment> {
  // Backend route is PATCH /comments/:id
  const res = await apiClient.patch<{ comment: Comment }>(`/comments/${commentId}`, data);
  return res.comment;
}

export async function deleteComment(commentId: string): Promise<void> {
  // Backend route is DELETE /comments/:id
  return apiClient.delete(`/comments/${commentId}`);
}
