import { eq, and, desc, sql } from "drizzle-orm";
import type { DatabaseClient } from "@taskforge/database";
import { activities } from "@taskforge/database";
import { createActivityId, nowISO } from "@taskforge/shared";

export interface LogActivityInput {
  workspaceId: string;
  projectId?: string | null;
  taskId?: string | null;
  userId: string;
  action: string;
  entityType: "workspace" | "project" | "task" | "comment" | "label" | "member";
  entityId: string;
  metadata?: Record<string, unknown> | null;
}

export class ActivityService {
  constructor(private db: DatabaseClient) {}

  async logActivity(input: LogActivityInput) {
    const id = createActivityId();
    const now = nowISO();

    await this.db.insert(activities).values({
      id,
      workspaceId: input.workspaceId,
      projectId: input.projectId ?? null,
      taskId: input.taskId ?? null,
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata ?? null,
      createdAt: now,
    });

    return { id };
  }

  async getByWorkspace(
    workspaceId: string,
    options: {
      projectId?: string;
      userId?: string;
      action?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const { limit = 50, offset = 0 } = options;

    const conditions = [eq(activities.workspaceId, workspaceId)];
    if (options.projectId) conditions.push(eq(activities.projectId, options.projectId));
    if (options.userId) conditions.push(eq(activities.userId, options.userId));
    if (options.action) conditions.push(eq(activities.action, options.action));

    const items = await this.db
      .select()
      .from(activities)
      .where(and(...conditions))
      .orderBy(desc(activities.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(activities)
      .where(and(...conditions));

    return {
      items,
      total: countResult[0]?.count ?? 0,
    };
  }

  async getByProject(
    projectId: string,
    options: { limit?: number; offset?: number } = {}
  ) {
    const { limit = 50, offset = 0 } = options;

    const items = await this.db
      .select()
      .from(activities)
      .where(eq(activities.projectId, projectId))
      .orderBy(desc(activities.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(activities)
      .where(eq(activities.projectId, projectId));

    return {
      items,
      total: countResult[0]?.count ?? 0,
    };
  }

  async getByTask(
    taskId: string,
    options: { limit?: number; offset?: number } = {}
  ) {
    const { limit = 50, offset = 0 } = options;

    const items = await this.db
      .select()
      .from(activities)
      .where(eq(activities.taskId, taskId))
      .orderBy(desc(activities.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(activities)
      .where(eq(activities.taskId, taskId));

    return {
      items,
      total: countResult[0]?.count ?? 0,
    };
  }
}
