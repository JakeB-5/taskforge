import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  description: z.string().max(10000).nullable().optional(),
  status: z.enum(["backlog", "todo", "in_progress", "in_review", "done", "cancelled"]).optional().default("backlog"),
  priority: z.enum(["none", "low", "medium", "high", "urgent"]).optional().default("none"),
  type: z.enum(["task", "bug", "feature", "improvement", "epic", "story"]).optional().default("task"),
  assigneeId: z.string().nullable().optional(),
  labelIds: z.array(z.string()).optional().default([]),
  dueDate: z.string().datetime().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  estimatedHours: z.number().min(0).max(9999).nullable().optional(),
  parentId: z.string().nullable().optional(),
  position: z.number().int().min(0).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(10000).nullable().optional(),
  status: z.enum(["backlog", "todo", "in_progress", "in_review", "done", "cancelled"]).optional(),
  priority: z.enum(["none", "low", "medium", "high", "urgent"]).optional(),
  type: z.enum(["task", "bug", "feature", "improvement", "epic", "story"]).optional(),
  assigneeId: z.string().nullable().optional(),
  labelIds: z.array(z.string()).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  estimatedHours: z.number().min(0).max(9999).nullable().optional(),
  parentId: z.string().nullable().optional(),
  position: z.number().int().min(0).optional(),
  sprintId: z.string().nullable().optional(),
});

export const moveTaskSchema = z.object({
  status: z.enum(["backlog", "todo", "in_progress", "in_review", "done", "cancelled"]),
  position: z.number().int().min(0),
});

export const filterTasksSchema = z.object({
  status: z.array(z.enum(["backlog", "todo", "in_progress", "in_review", "done", "cancelled"])).optional(),
  priority: z.array(z.enum(["none", "low", "medium", "high", "urgent"])).optional(),
  type: z.array(z.enum(["task", "bug", "feature", "improvement", "epic", "story"])).optional(),
  assigneeId: z.string().nullable().optional(),
  labelIds: z.array(z.string()).optional(),
  search: z.string().max(200).optional(),
  dueBefore: z.string().datetime().optional(),
  dueAfter: z.string().datetime().optional(),
  page: z.number().int().min(1).optional().default(1),
  perPage: z.number().int().min(1).max(100).optional().default(25),
  sortBy: z.enum(["createdAt", "updatedAt", "dueDate", "priority", "position", "title"]).optional().default("position"),
  sortDirection: z.enum(["asc", "desc"]).optional().default("asc"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
export type FilterTasksInput = z.infer<typeof filterTasksSchema>;
