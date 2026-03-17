import { sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const workspaces = sqliteTable(
  "workspaces",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    logoUrl: text("logo_url"),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("workspaces_slug_idx").on(table.slug),
    ownerIdIdx: index("workspaces_owner_id_idx").on(table.ownerId),
  })
);

export const workspaceMembers = sqliteTable(
  "workspace_members",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["owner", "admin", "member", "guest"] })
      .notNull()
      .default("member"),
    joinedAt: text("joined_at").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("workspace_members_unique_idx").on(
      table.workspaceId,
      table.userId
    ),
    workspaceIdIdx: index("workspace_members_workspace_id_idx").on(table.workspaceId),
    userIdIdx: index("workspace_members_user_id_idx").on(table.userId),
  })
);
