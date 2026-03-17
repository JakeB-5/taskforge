import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { projects } from "./projects";

export const tasks = sqliteTable(
  "tasks",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status", {
      enum: ["backlog", "todo", "in_progress", "in_review", "done", "cancelled"],
    })
      .notNull()
      .default("todo"),
    priority: text("priority", {
      enum: ["none", "low", "medium", "high", "urgent"],
    })
      .notNull()
      .default("none"),
    type: text("type", {
      enum: ["task", "bug", "feature", "improvement", "epic"],
    })
      .notNull()
      .default("task"),
    assigneeId: text("assignee_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reporterId: text("reporter_id")
      .notNull()
      .references(() => users.id),
    parentId: text("parent_id"),
    position: integer("position").notNull().default(0),
    dueDate: text("due_date"),
    estimatedHours: real("estimated_hours"),
    completedAt: text("completed_at"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    projectIdIdx: index("tasks_project_id_idx").on(table.projectId),
    statusIdx: index("tasks_status_idx").on(table.status),
    priorityIdx: index("tasks_priority_idx").on(table.priority),
    assigneeIdIdx: index("tasks_assignee_id_idx").on(table.assigneeId),
    reporterIdIdx: index("tasks_reporter_id_idx").on(table.reporterId),
    parentIdIdx: index("tasks_parent_id_idx").on(table.parentId),
    projectStatusIdx: index("tasks_project_status_idx").on(table.projectId, table.status),
  })
);
