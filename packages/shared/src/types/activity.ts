export type ActivityType =
  | "task_created"
  | "task_updated"
  | "task_deleted"
  | "task_moved"
  | "task_assigned"
  | "task_unassigned"
  | "task_status_changed"
  | "task_priority_changed"
  | "comment_created"
  | "comment_updated"
  | "comment_deleted"
  | "label_added"
  | "label_removed"
  | "attachment_added"
  | "attachment_removed"
  | "member_added"
  | "member_removed"
  | "project_created"
  | "project_updated"
  | "project_archived";

export interface Activity {
  id: string;
  workspaceId: string;
  projectId: string | null;
  taskId: string | null;
  actorId: string;
  type: ActivityType;
  metadata: Record<string, unknown>;
  createdAt: string;
}
