import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { tasks } from "./tasks";

export const comments = sqliteTable(
  "comments",
  {
    id: text("id").primaryKey(),
    taskId: text("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    taskIdIdx: index("comments_task_id_idx").on(table.taskId),
    authorIdIdx: index("comments_author_id_idx").on(table.authorId),
  })
);
