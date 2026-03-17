import type { Timestamps, SoftDelete } from "./common";

export type TaskStatus = "backlog" | "todo" | "in_progress" | "in_review" | "done" | "cancelled";

export type TaskPriority = "none" | "low" | "medium" | "high" | "urgent";

export type TaskType = "task" | "bug" | "feature" | "improvement" | "epic" | "story";

export interface Task extends Timestamps, SoftDelete {
  id: string;
  projectId: string;
  parentId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  assigneeId: string | null;
  reporterId: string;
  labelIds: string[];
  dueDate: string | null;
  startDate: string | null;
  estimatedHours: number | null;
  position: number;
  sprintId: string | null;
}

export interface SubTask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  position: number;
  createdAt: string;
}
