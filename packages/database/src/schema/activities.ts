import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { workspaces } from "./workspaces";
import { projects } from "./projects";
import { tasks } from "./tasks";

export const activities = sqliteTable(
  "activities",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    taskId: text("task_id").references(() => tasks.id, {
      onDelete: "set null",
    }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    action: text("action").notNull(),
    entityType: text("entity_type", {
      enum: ["workspace", "project", "task", "comment", "label", "member"],
    }).notNull(),
    entityId: text("entity_id").notNull(),
    metadata: text("metadata", { mode: "json" }),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    workspaceIdIdx: index("activities_workspace_id_idx").on(table.workspaceId),
    projectIdIdx: index("activities_project_id_idx").on(table.projectId),
    taskIdIdx: index("activities_task_id_idx").on(table.taskId),
    userIdIdx: index("activities_user_id_idx").on(table.userId),
    createdAtIdx: index("activities_created_at_idx").on(table.createdAt),
  })
);
