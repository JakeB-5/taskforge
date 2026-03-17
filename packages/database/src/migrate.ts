import { sql } from "drizzle-orm";
import type { DatabaseClient } from "./client";

export async function migrateDatabase(db: DatabaseClient) {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      role TEXT NOT NULL DEFAULT 'member',
      is_active INTEGER NOT NULL DEFAULT 1,
      last_login_at TEXT,
      email_verified_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      bio TEXT,
      timezone TEXT NOT NULL DEFAULT 'UTC',
      language TEXT NOT NULL DEFAULT 'en',
      theme TEXT NOT NULL DEFAULT 'system',
      notifications_enabled INTEGER NOT NULL DEFAULT 1
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      logo_url TEXT,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS workspace_members (
      id TEXT PRIMARY KEY NOT NULL,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL DEFAULT 'member',
      joined_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY NOT NULL,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      color TEXT,
      icon_url TEXT,
      owner_id TEXT NOT NULL REFERENCES users(id),
      start_date TEXT,
      end_date TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS project_members (
      id TEXT PRIMARY KEY NOT NULL,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL DEFAULT 'member',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'todo',
      priority TEXT NOT NULL DEFAULT 'none',
      type TEXT NOT NULL DEFAULT 'task',
      assignee_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      reporter_id TEXT NOT NULL REFERENCES users(id),
      parent_id TEXT,
      position INTEGER NOT NULL DEFAULT 0,
      due_date TEXT,
      estimated_hours REAL,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY NOT NULL,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS labels (
      id TEXT PRIMARY KEY NOT NULL,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS task_labels (
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      label_id TEXT NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
      PRIMARY KEY (task_id, label_id)
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY NOT NULL,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      uploader_id TEXT NOT NULL REFERENCES users(id),
      file_name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY NOT NULL,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
      project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
      task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
      user_id TEXT NOT NULL REFERENCES users(id),
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT NOT NULL
    )
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link_url TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `);

  // Indexes - users
  await db.run(sql`CREATE INDEX IF NOT EXISTS users_email_idx ON users(email)`);

  // Indexes - workspaces
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS workspaces_slug_idx ON workspaces(slug)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS workspaces_owner_id_idx ON workspaces(owner_id)`);

  // Indexes - workspace_members
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS workspace_members_unique_idx ON workspace_members(workspace_id, user_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS workspace_members_workspace_id_idx ON workspace_members(workspace_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS workspace_members_user_id_idx ON workspace_members(user_id)`);

  // Indexes - projects
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS projects_workspace_slug_idx ON projects(workspace_id, slug)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS projects_workspace_id_idx ON projects(workspace_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON projects(owner_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status)`);

  // Indexes - project_members
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS project_members_unique_idx ON project_members(project_id, user_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS project_members_project_id_idx ON project_members(project_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS project_members_user_id_idx ON project_members(user_id)`);

  // Indexes - tasks
  await db.run(sql`CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON tasks(project_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS tasks_priority_idx ON tasks(priority)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS tasks_assignee_id_idx ON tasks(assignee_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS tasks_reporter_id_idx ON tasks(reporter_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS tasks_parent_id_idx ON tasks(parent_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS tasks_project_status_idx ON tasks(project_id, status)`);

  // Indexes - comments
  await db.run(sql`CREATE INDEX IF NOT EXISTS comments_task_id_idx ON comments(task_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS comments_author_id_idx ON comments(author_id)`);

  // Indexes - labels
  await db.run(sql`CREATE INDEX IF NOT EXISTS labels_project_id_idx ON labels(project_id)`);
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS labels_project_name_idx ON labels(project_id, name)`);

  // Indexes - task_labels
  await db.run(sql`CREATE UNIQUE INDEX IF NOT EXISTS task_labels_unique_idx ON task_labels(task_id, label_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS task_labels_task_id_idx ON task_labels(task_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS task_labels_label_id_idx ON task_labels(label_id)`);

  // Indexes - attachments
  await db.run(sql`CREATE INDEX IF NOT EXISTS attachments_task_id_idx ON attachments(task_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS attachments_uploader_id_idx ON attachments(uploader_id)`);

  // Indexes - activities
  await db.run(sql`CREATE INDEX IF NOT EXISTS activities_workspace_id_idx ON activities(workspace_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS activities_project_id_idx ON activities(project_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS activities_task_id_idx ON activities(task_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS activities_user_id_idx ON activities(user_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS activities_created_at_idx ON activities(created_at)`);

  // Indexes - notifications
  await db.run(sql`CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS notifications_user_read_idx ON notifications(user_id, is_read)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at)`);
}
