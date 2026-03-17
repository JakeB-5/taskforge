import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type", {
      enum: [
        "task_assigned",
        "task_updated",
        "task_completed",
        "comment_added",
        "mention",
        "project_invite",
        "workspace_invite",
      ],
    }).notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    linkUrl: text("link_url"),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    userIdIdx: index("notifications_user_id_idx").on(table.userId),
    userReadIdx: index("notifications_user_read_idx").on(table.userId, table.isRead),
    createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
  })
);
