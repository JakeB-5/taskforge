import { sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { projects } from "./projects";
import { tasks } from "./tasks";

export const labels = sqliteTable(
  "labels",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").notNull(),
    description: text("description"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    projectIdIdx: index("labels_project_id_idx").on(table.projectId),
    projectNameIdx: uniqueIndex("labels_project_name_idx").on(table.projectId, table.name),
  })
);

export const taskLabels = sqliteTable(
  "task_labels",
  {
    taskId: text("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    labelId: text("label_id")
      .notNull()
      .references(() => labels.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("task_labels_unique_idx").on(table.taskId, table.labelId),
    taskIdIdx: index("task_labels_task_id_idx").on(table.taskId),
    labelIdIdx: index("task_labels_label_id_idx").on(table.labelId),
  })
);
