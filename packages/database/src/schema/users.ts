import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    avatarUrl: text("avatar_url"),
    role: text("role", { enum: ["owner", "admin", "member", "guest"] })
      .notNull()
      .default("member"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    lastLoginAt: text("last_login_at"),
    emailVerifiedAt: text("email_verified_at"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  })
);

export const userProfiles = sqliteTable("user_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  bio: text("bio"),
  timezone: text("timezone").notNull().default("UTC"),
  language: text("language").notNull().default("en"),
  theme: text("theme", { enum: ["light", "dark", "system"] })
    .notNull()
    .default("system"),
  notificationsEnabled: integer("notifications_enabled", { mode: "boolean" })
    .notNull()
    .default(true),
});
