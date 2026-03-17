import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";
import * as schema from "./schema/index";
import {
  createUserId,
  createWorkspaceId,
  createProjectId,
  createTaskId,
  createCommentId,
  createLabelId,
  createActivityId,
  createNotificationId,
  createAttachmentId,
  generatePrefixedId,
} from "@taskforge/shared/utils";

const client = createClient({
  url: process.env.DATABASE_URL ?? "file:./data/taskforge.db",
});
const db = drizzle(client, { schema });

function now() {
  return new Date().toISOString();
}

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(schema.activities);
  await db.delete(schema.notifications);
  await db.delete(schema.attachments);
  await db.delete(schema.taskLabels);
  await db.delete(schema.comments);
  await db.delete(schema.tasks);
  await db.delete(schema.labels);
  await db.delete(schema.projectMembers);
  await db.delete(schema.projects);
  await db.delete(schema.workspaceMembers);
  await db.delete(schema.workspaces);
  await db.delete(schema.userProfiles);
  await db.delete(schema.users);

  // --- Users ---
  const user1Id = createUserId();
  const user2Id = createUserId();

  await db.insert(schema.users).values([
    {
      id: user1Id,
      email: "alice@taskforge.dev",
      name: "Alice Kim",
      passwordHash: "$2b$10$placeholder_hash_alice",
      avatarUrl: null,
      role: "owner",
      isActive: true,
      lastLoginAt: now(),
      emailVerifiedAt: daysAgo(30),
      createdAt: daysAgo(30),
      updatedAt: now(),
    },
    {
      id: user2Id,
      email: "bob@taskforge.dev",
      name: "Bob Park",
      passwordHash: "$2b$10$placeholder_hash_bob",
      avatarUrl: null,
      role: "member",
      isActive: true,
      lastLoginAt: daysAgo(1),
      emailVerifiedAt: daysAgo(25),
      createdAt: daysAgo(25),
      updatedAt: daysAgo(1),
    },
  ]);

  await db.insert(schema.userProfiles).values([
    {
      id: generatePrefixedId("upr"),
      userId: user1Id,
      bio: "Full-stack developer and team lead",
      timezone: "Asia/Seoul",
      language: "en",
      theme: "dark",
      notificationsEnabled: true,
    },
    {
      id: generatePrefixedId("upr"),
      userId: user2Id,
      bio: "Backend engineer focused on scalability",
      timezone: "Asia/Seoul",
      language: "en",
      theme: "system",
      notificationsEnabled: true,
    },
  ]);

  console.log("  Created 2 users with profiles");

  // --- Workspace ---
  const workspaceId = createWorkspaceId();

  await db.insert(schema.workspaces).values({
    id: workspaceId,
    name: "TaskForge Team",
    slug: "taskforge-team",
    description: "Main workspace for the TaskForge development team",
    logoUrl: null,
    ownerId: user1Id,
    createdAt: daysAgo(28),
    updatedAt: daysAgo(1),
  });

  await db.insert(schema.workspaceMembers).values([
    {
      id: generatePrefixedId("wkm"),
      workspaceId,
      userId: user1Id,
      role: "owner",
      joinedAt: daysAgo(28),
      createdAt: daysAgo(28),
      updatedAt: daysAgo(28),
    },
    {
      id: generatePrefixedId("wkm"),
      workspaceId,
      userId: user2Id,
      role: "member",
      joinedAt: daysAgo(25),
      createdAt: daysAgo(25),
      updatedAt: daysAgo(25),
    },
  ]);

  console.log("  Created 1 workspace with 2 members");

  // --- Projects ---
  const project1Id = createProjectId();
  const project2Id = createProjectId();

  await db.insert(schema.projects).values([
    {
      id: project1Id,
      workspaceId,
      name: "Platform MVP",
      slug: "platform-mvp",
      description: "Core platform features for the initial release",
      status: "active",
      color: "#3b82f6",
      iconUrl: null,
      ownerId: user1Id,
      startDate: daysAgo(21),
      endDate: daysFromNow(30),
      createdAt: daysAgo(21),
      updatedAt: daysAgo(1),
    },
    {
      id: project2Id,
      workspaceId,
      name: "Mobile App",
      slug: "mobile-app",
      description: "React Native mobile client for TaskForge",
      status: "active",
      color: "#8b5cf6",
      iconUrl: null,
      ownerId: user2Id,
      startDate: daysAgo(7),
      endDate: daysFromNow(60),
      createdAt: daysAgo(7),
      updatedAt: daysAgo(2),
    },
  ]);

  await db.insert(schema.projectMembers).values([
    {
      id: generatePrefixedId("prm"),
      projectId: project1Id,
      userId: user1Id,
      role: "lead",
      createdAt: daysAgo(21),
      updatedAt: daysAgo(21),
    },
    {
      id: generatePrefixedId("prm"),
      projectId: project1Id,
      userId: user2Id,
      role: "member",
      createdAt: daysAgo(20),
      updatedAt: daysAgo(20),
    },
    {
      id: generatePrefixedId("prm"),
      projectId: project2Id,
      userId: user2Id,
      role: "lead",
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7),
    },
    {
      id: generatePrefixedId("prm"),
      projectId: project2Id,
      userId: user1Id,
      role: "member",
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7),
    },
  ]);

  console.log("  Created 2 projects with members");

  // --- Labels ---
  const labelBugId = createLabelId();
  const labelFeatureId = createLabelId();
  const labelUrgentId = createLabelId();
  const labelDocsId = createLabelId();
  const labelDesignId = createLabelId();

  await db.insert(schema.labels).values([
    {
      id: labelBugId,
      projectId: project1Id,
      name: "bug",
      color: "#ef4444",
      description: "Something is broken",
      createdAt: daysAgo(21),
      updatedAt: daysAgo(21),
    },
    {
      id: labelFeatureId,
      projectId: project1Id,
      name: "feature",
      color: "#22c55e",
      description: "New functionality",
      createdAt: daysAgo(21),
      updatedAt: daysAgo(21),
    },
    {
      id: labelUrgentId,
      projectId: project1Id,
      name: "urgent",
      color: "#f97316",
      description: "Needs immediate attention",
      createdAt: daysAgo(21),
      updatedAt: daysAgo(21),
    },
    {
      id: labelDocsId,
      projectId: project1Id,
      name: "documentation",
      color: "#6366f1",
      description: "Documentation updates",
      createdAt: daysAgo(21),
      updatedAt: daysAgo(21),
    },
    {
      id: labelDesignId,
      projectId: project2Id,
      name: "design",
      color: "#ec4899",
      description: "UI/UX design work",
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7),
    },
  ]);

  console.log("  Created 5 labels");

  // --- Tasks (20+ across both projects) ---
  const taskIds: string[] = [];
  const tasksData = [
    // Project 1 - Platform MVP
    { projectId: project1Id, title: "Set up authentication with JWT", status: "done" as const, priority: "high" as const, type: "feature" as const, assigneeId: user1Id, reporterId: user1Id, position: 0, dueDate: daysAgo(7), completedAt: daysAgo(8), createdAt: daysAgo(20) },
    { projectId: project1Id, title: "Design database schema", status: "done" as const, priority: "high" as const, type: "task" as const, assigneeId: user2Id, reporterId: user1Id, position: 1, dueDate: daysAgo(14), completedAt: daysAgo(15), createdAt: daysAgo(20) },
    { projectId: project1Id, title: "Implement user registration flow", status: "done" as const, priority: "high" as const, type: "feature" as const, assigneeId: user1Id, reporterId: user1Id, position: 2, dueDate: daysAgo(5), completedAt: daysAgo(6), createdAt: daysAgo(18) },
    { projectId: project1Id, title: "Build workspace CRUD API", status: "in_progress" as const, priority: "high" as const, type: "feature" as const, assigneeId: user2Id, reporterId: user1Id, position: 3, dueDate: daysFromNow(3), completedAt: null, createdAt: daysAgo(14) },
    { projectId: project1Id, title: "Build project CRUD API", status: "in_progress" as const, priority: "medium" as const, type: "feature" as const, assigneeId: user1Id, reporterId: user1Id, position: 4, dueDate: daysFromNow(5), completedAt: null, createdAt: daysAgo(14) },
    { projectId: project1Id, title: "Build task management API", status: "todo" as const, priority: "high" as const, type: "feature" as const, assigneeId: user2Id, reporterId: user1Id, position: 5, dueDate: daysFromNow(10), completedAt: null, createdAt: daysAgo(12) },
    { projectId: project1Id, title: "Fix login redirect loop on expired tokens", status: "in_progress" as const, priority: "urgent" as const, type: "bug" as const, assigneeId: user1Id, reporterId: user2Id, position: 6, dueDate: daysFromNow(1), completedAt: null, createdAt: daysAgo(3) },
    { projectId: project1Id, title: "Add drag-and-drop to kanban board", status: "todo" as const, priority: "medium" as const, type: "feature" as const, assigneeId: null, reporterId: user1Id, position: 7, dueDate: daysFromNow(14), completedAt: null, createdAt: daysAgo(10) },
    { projectId: project1Id, title: "Implement real-time notifications", status: "backlog" as const, priority: "low" as const, type: "feature" as const, assigneeId: null, reporterId: user1Id, position: 8, dueDate: null, completedAt: null, createdAt: daysAgo(10) },
    { projectId: project1Id, title: "Write API documentation", status: "todo" as const, priority: "medium" as const, type: "task" as const, assigneeId: user2Id, reporterId: user1Id, position: 9, dueDate: daysFromNow(7), completedAt: null, createdAt: daysAgo(8) },
    { projectId: project1Id, title: "Add file attachment support", status: "backlog" as const, priority: "low" as const, type: "feature" as const, assigneeId: null, reporterId: user2Id, position: 10, dueDate: null, completedAt: null, createdAt: daysAgo(7) },
    { projectId: project1Id, title: "Optimize database queries for task listing", status: "todo" as const, priority: "medium" as const, type: "improvement" as const, assigneeId: user2Id, reporterId: user2Id, position: 11, dueDate: daysFromNow(12), completedAt: null, createdAt: daysAgo(5) },
    { projectId: project1Id, title: "Set up CI/CD pipeline", status: "done" as const, priority: "high" as const, type: "task" as const, assigneeId: user1Id, reporterId: user1Id, position: 12, dueDate: daysAgo(10), completedAt: daysAgo(11), createdAt: daysAgo(19) },
    { projectId: project1Id, title: "Add search functionality", status: "backlog" as const, priority: "medium" as const, type: "feature" as const, assigneeId: null, reporterId: user1Id, position: 13, dueDate: null, completedAt: null, createdAt: daysAgo(6) },
    { projectId: project1Id, title: "Implement activity feed", status: "todo" as const, priority: "low" as const, type: "feature" as const, assigneeId: null, reporterId: user1Id, position: 14, dueDate: daysFromNow(20), completedAt: null, createdAt: daysAgo(4) },
    // Project 2 - Mobile App
    { projectId: project2Id, title: "Set up React Native project with Expo", status: "done" as const, priority: "high" as const, type: "task" as const, assigneeId: user2Id, reporterId: user2Id, position: 0, dueDate: daysAgo(3), completedAt: daysAgo(4), createdAt: daysAgo(7) },
    { projectId: project2Id, title: "Design mobile navigation structure", status: "in_progress" as const, priority: "high" as const, type: "task" as const, assigneeId: user2Id, reporterId: user2Id, position: 1, dueDate: daysFromNow(2), completedAt: null, createdAt: daysAgo(5) },
    { projectId: project2Id, title: "Build login and signup screens", status: "todo" as const, priority: "high" as const, type: "feature" as const, assigneeId: user2Id, reporterId: user2Id, position: 2, dueDate: daysFromNow(7), completedAt: null, createdAt: daysAgo(5) },
    { projectId: project2Id, title: "Implement task list view for mobile", status: "todo" as const, priority: "medium" as const, type: "feature" as const, assigneeId: null, reporterId: user2Id, position: 3, dueDate: daysFromNow(14), completedAt: null, createdAt: daysAgo(4) },
    { projectId: project2Id, title: "Add push notification support", status: "backlog" as const, priority: "low" as const, type: "feature" as const, assigneeId: null, reporterId: user2Id, position: 4, dueDate: null, completedAt: null, createdAt: daysAgo(3) },
    { projectId: project2Id, title: "Offline mode data sync", status: "backlog" as const, priority: "medium" as const, type: "feature" as const, assigneeId: null, reporterId: user1Id, position: 5, dueDate: null, completedAt: null, createdAt: daysAgo(2) },
    { projectId: project2Id, title: "Mobile-specific bug: keyboard covers input", status: "todo" as const, priority: "high" as const, type: "bug" as const, assigneeId: user2Id, reporterId: user1Id, position: 6, dueDate: daysFromNow(4), completedAt: null, createdAt: daysAgo(1) },
  ];

  for (const taskData of tasksData) {
    const id = createTaskId();
    taskIds.push(id);
    await db.insert(schema.tasks).values({
      id,
      ...taskData,
      updatedAt: taskData.completedAt ?? now(),
      createdAt: taskData.createdAt,
    });
  }

  console.log(`  Created ${tasksData.length} tasks`);

  // --- Task Labels ---
  await db.insert(schema.taskLabels).values([
    { taskId: taskIds[0], labelId: labelFeatureId },
    { taskId: taskIds[2], labelId: labelFeatureId },
    { taskId: taskIds[3], labelId: labelFeatureId },
    { taskId: taskIds[5], labelId: labelFeatureId },
    { taskId: taskIds[6], labelId: labelBugId },
    { taskId: taskIds[6], labelId: labelUrgentId },
    { taskId: taskIds[7], labelId: labelFeatureId },
    { taskId: taskIds[9], labelId: labelDocsId },
    { taskId: taskIds[15], labelId: labelDesignId },
    { taskId: taskIds[21], labelId: labelBugId },
  ]);

  console.log("  Created task-label associations");

  // --- Comments ---
  const commentIds: string[] = [];
  const commentsData = [
    { taskId: taskIds[3], authorId: user1Id, content: "Let's make sure we support pagination for workspace member lists from the start.", createdAt: daysAgo(10) },
    { taskId: taskIds[3], authorId: user2Id, content: "Good call. I'll add cursor-based pagination.", createdAt: daysAgo(9) },
    { taskId: taskIds[5], authorId: user1Id, content: "This is a big one. We should break it into subtasks for CRUD, filtering, and sorting.", createdAt: daysAgo(8) },
    { taskId: taskIds[6], authorId: user2Id, content: "I can reproduce this when the token expires while the user is on the dashboard page.", createdAt: daysAgo(2) },
    { taskId: taskIds[6], authorId: user1Id, content: "Found the issue - the refresh token middleware was not checking the redirect path.", createdAt: daysAgo(1) },
    { taskId: taskIds[16], authorId: user2Id, content: "I'm thinking tab-based navigation with a bottom bar for the main sections.", createdAt: daysAgo(4) },
    { taskId: taskIds[16], authorId: user1Id, content: "Sounds good. Let's follow the iOS Human Interface Guidelines for the tab bar.", createdAt: daysAgo(3) },
    { taskId: taskIds[11], authorId: user2Id, content: "We should add composite indexes for the most common query patterns.", createdAt: daysAgo(4) },
  ];

  for (const commentData of commentsData) {
    const id = createCommentId();
    commentIds.push(id);
    await db.insert(schema.comments).values({
      id,
      ...commentData,
      updatedAt: commentData.createdAt,
    });
  }

  console.log(`  Created ${commentsData.length} comments`);

  // --- Activities ---
  const activitiesData = [
    { workspaceId, projectId: project1Id, taskId: taskIds[0], userId: user1Id, action: "created", entityType: "task" as const, entityId: taskIds[0], metadata: { title: "Set up authentication with JWT" }, createdAt: daysAgo(20) },
    { workspaceId, projectId: project1Id, taskId: taskIds[0], userId: user1Id, action: "completed", entityType: "task" as const, entityId: taskIds[0], metadata: { title: "Set up authentication with JWT" }, createdAt: daysAgo(8) },
    { workspaceId, projectId: project1Id, taskId: taskIds[3], userId: user2Id, action: "status_changed", entityType: "task" as const, entityId: taskIds[3], metadata: { from: "todo", to: "in_progress" }, createdAt: daysAgo(5) },
    { workspaceId, projectId: project1Id, taskId: taskIds[6], userId: user2Id, action: "created", entityType: "task" as const, entityId: taskIds[6], metadata: { title: "Fix login redirect loop" }, createdAt: daysAgo(3) },
    { workspaceId, projectId: project1Id, taskId: null, userId: user1Id, action: "created", entityType: "project" as const, entityId: project1Id, metadata: { name: "Platform MVP" }, createdAt: daysAgo(21) },
    { workspaceId, projectId: project2Id, taskId: null, userId: user2Id, action: "created", entityType: "project" as const, entityId: project2Id, metadata: { name: "Mobile App" }, createdAt: daysAgo(7) },
    { workspaceId, projectId: null, taskId: null, userId: user1Id, action: "member_added", entityType: "member" as const, entityId: user2Id, metadata: { name: "Bob Park", role: "member" }, createdAt: daysAgo(25) },
  ];

  for (const activityData of activitiesData) {
    await db.insert(schema.activities).values({
      id: createActivityId(),
      ...activityData,
      metadata: JSON.stringify(activityData.metadata),
    });
  }

  console.log(`  Created ${activitiesData.length} activities`);

  // --- Notifications ---
  const notificationsData = [
    { userId: user2Id, type: "task_assigned" as const, title: "Task assigned to you", message: "Alice assigned you 'Build workspace CRUD API'", linkUrl: `/projects/${project1Id}/tasks/${taskIds[3]}`, isRead: true, createdAt: daysAgo(14) },
    { userId: user1Id, type: "comment_added" as const, title: "New comment", message: "Bob commented on 'Fix login redirect loop'", linkUrl: `/projects/${project1Id}/tasks/${taskIds[6]}`, isRead: true, createdAt: daysAgo(2) },
    { userId: user2Id, type: "task_assigned" as const, title: "Task assigned to you", message: "Alice assigned you 'Build task management API'", linkUrl: `/projects/${project1Id}/tasks/${taskIds[5]}`, isRead: false, createdAt: daysAgo(1) },
    { userId: user1Id, type: "comment_added" as const, title: "New comment", message: "Bob commented on 'Optimize database queries'", linkUrl: `/projects/${project1Id}/tasks/${taskIds[11]}`, isRead: false, createdAt: daysAgo(4) },
    { userId: user2Id, type: "project_invite" as const, title: "Project invitation", message: "Alice invited you to 'Platform MVP'", linkUrl: `/projects/${project1Id}`, isRead: true, createdAt: daysAgo(20) },
  ];

  for (const notificationData of notificationsData) {
    await db.insert(schema.notifications).values({
      id: createNotificationId(),
      ...notificationData,
    });
  }

  console.log(`  Created ${notificationsData.length} notifications`);

  // --- Attachments ---
  await db.insert(schema.attachments).values([
    {
      id: createAttachmentId(),
      taskId: taskIds[1],
      uploaderId: user2Id,
      fileName: "schema-v1.png",
      fileUrl: "/uploads/schema-v1.png",
      fileSize: 245_000,
      mimeType: "image/png",
      createdAt: daysAgo(15),
    },
    {
      id: createAttachmentId(),
      taskId: taskIds[9],
      uploaderId: user2Id,
      fileName: "api-spec-draft.pdf",
      fileUrl: "/uploads/api-spec-draft.pdf",
      fileSize: 1_200_000,
      mimeType: "application/pdf",
      createdAt: daysAgo(6),
    },
  ]);

  console.log("  Created 2 attachments");

  console.log("\nSeed completed successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
