import type { TaskPriority } from "../types/index";

export const LABEL_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#64748b", // slate
] as const;

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  none: "#94a3b8",    // slate-400
  low: "#3b82f6",     // blue-500
  medium: "#f59e0b",  // amber-500
  high: "#f97316",    // orange-500
  urgent: "#ef4444",  // red-500
};

export const PROJECT_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
] as const;

export const STATUS_COLORS: Record<string, string> = {
  backlog: "#94a3b8",
  todo: "#3b82f6",
  in_progress: "#f59e0b",
  in_review: "#8b5cf6",
  done: "#22c55e",
  cancelled: "#6b7280",
  active: "#22c55e",
  archived: "#6b7280",
  completed: "#3b82f6",
};
