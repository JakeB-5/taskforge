import { sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { workspaces } from "./workspaces";

export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    status: text("status", { enum: ["active", "archived", "completed"] })
      .notNull()
      .default("active"),
    color: text("color"),
    iconUrl: text("icon_url"),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id),
    startDate: text("start_date"),
    endDate: text("end_date"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    workspaceSlugIdx: uniqueIndex("projects_workspace_slug_idx").on(
      table.workspaceId,
      table.slug
    ),
    workspaceIdIdx: index("projects_workspace_id_idx").on(table.workspaceId),
    ownerIdIdx: index("projects_owner_id_idx").on(table.ownerId),
    statusIdx: index("projects_status_idx").on(table.status),
  })
);

export const projectMembers = sqliteTable(
  "project_members",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["lead", "member", "viewer"] })
      .notNull()
      .default("member"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    uniqueIdx: uniqueIndex("project_members_unique_idx").on(
      table.projectId,
      table.userId
    ),
    projectIdIdx: index("project_members_project_id_idx").on(table.projectId),
    userIdIdx: index("project_members_user_id_idx").on(table.userId),
  })
);
