import type { TaskStatus, TaskPriority, TaskType, ProjectStatus } from "../types/index";

export const TASK_STATUSES: readonly TaskStatus[] = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "done",
  "cancelled",
] as const;

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
  cancelled: "Cancelled",
};

export const TASK_PRIORITIES: readonly TaskPriority[] = [
  "none",
  "low",
  "medium",
  "high",
  "urgent",
] as const;

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  none: "No Priority",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const TASK_PRIORITY_ORDER: Record<TaskPriority, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

export const TASK_TYPES: readonly TaskType[] = [
  "task",
  "bug",
  "feature",
  "improvement",
  "epic",
  "story",
] as const;

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  task: "Task",
  bug: "Bug",
  feature: "Feature",
  improvement: "Improvement",
  epic: "Epic",
  story: "Story",
};

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  "active",
  "archived",
  "completed",
] as const;

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "Active",
  archived: "Archived",
  completed: "Completed",
};
