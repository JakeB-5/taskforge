export type NotificationType =
  | "task_assigned"
  | "task_mentioned"
  | "task_status_changed"
  | "task_due_soon"
  | "task_overdue"
  | "comment_added"
  | "comment_mentioned"
  | "project_invitation"
  | "workspace_invitation";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  resourceType: "task" | "comment" | "project" | "workspace";
  resourceId: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}
