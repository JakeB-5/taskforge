import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { tasks } from "./tasks";

export const attachments = sqliteTable(
  "attachments",
  {
    id: text("id").primaryKey(),
    taskId: text("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    uploaderId: text("uploader_id")
      .notNull()
      .references(() => users.id),
    fileName: text("file_name").notNull(),
    fileUrl: text("file_url").notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: text("mime_type").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    taskIdIdx: index("attachments_task_id_idx").on(table.taskId),
    uploaderIdIdx: index("attachments_uploader_id_idx").on(table.uploaderId),
  })
);
