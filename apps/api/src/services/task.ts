import { eq, and, or, like, lte, gte, inArray, sql, asc, desc } from "drizzle-orm";
import { tasks, taskLabels } from "@taskforge/database";
import type { DatabaseClient } from "@taskforge/database";
import type { CreateTaskInput, UpdateTaskInput, FilterTasksInput, MoveTaskInput } from "@taskforge/shared";
import { createTaskId, nowISO, DEFAULT_PAGE_SIZE } from "@taskforge/shared";

export class TaskService {
  constructor(private db: DatabaseClient) {}

  async findById(id: string) {
    const result = await this.db.query.tasks.findFirst({
      where: eq(tasks.id, id),
      with: {
        assignee: { columns: { passwordHash: false } },
        reporter: { columns: { passwordHash: false } },
        comments: {
          with: { author: { columns: { passwordHash: false } } },
          orderBy: (c, { desc }) => [desc(c.createdAt)],
        },
        taskLabels: {
          with: { label: true },
        },
        subtasks: true,
      },
    });
    if (!result) return null;

    // Flatten labels
    const labels = result.taskLabels.map((tl) => tl.label);
    const { taskLabels: _, ...rest } = result;
    return { ...rest, labels };
  }

  async list(projectId: string, filters: FilterTasksInput) {
    const page = filters.page ?? 1;
    const perPage = filters.perPage ?? DEFAULT_PAGE_SIZE;
    const offset = (page - 1) * perPage;

    // Build where conditions
    const conditions: any[] = [eq(tasks.projectId, projectId)];

    if (filters.status?.length) {
      conditions.push(inArray(tasks.status, filters.status));
    }
    if (filters.priority?.length) {
      conditions.push(inArray(tasks.priority, filters.priority));
    }
    if (filters.type?.length) {
      conditions.push(inArray(tasks.type, filters.type as any));
    }
    if (filters.assigneeId !== undefined) {
      if (filters.assigneeId === null) {
        conditions.push(sql`${tasks.assigneeId} IS NULL`);
      } else {
        conditions.push(eq(tasks.assigneeId, filters.assigneeId));
      }
    }
    if (filters.search) {
      conditions.push(
        or(
          like(tasks.title, `%${filters.search}%`),
          like(tasks.description, `%${filters.search}%`)
        )
      );
    }
    if (filters.dueBefore) {
      conditions.push(lte(tasks.dueDate, filters.dueBefore));
    }
    if (filters.dueAfter) {
      conditions.push(gte(tasks.dueDate, filters.dueAfter));
    }

    const where = and(...conditions);

    // Sort
    const sortBy = filters.sortBy ?? "position";
    const sortDir = filters.sortDirection ?? "asc";
    const sortColumn = tasks[sortBy as keyof typeof tasks] ?? tasks.position;
    const orderFn = sortDir === "desc" ? desc : asc;

    // Count total
    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(where);
    const total = countResult[0]?.count ?? 0;

    // Fetch tasks
    const items = await this.db.query.tasks.findMany({
      where,
      with: {
        assignee: { columns: { passwordHash: false } },
        taskLabels: { with: { label: true } },
      },
      orderBy: [orderFn(sortColumn as any)],
      limit: perPage,
      offset,
    });

    // Flatten labels
    const data = items.map((item) => {
      const labels = item.taskLabels.map((tl) => tl.label);
      const { taskLabels: _, ...rest } = item;
      return { ...rest, labels };
    });

    const totalPages = Math.ceil(total / perPage);

    return {
      data,
      pagination: {
        page,
        perPage,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  }

  async create(data: CreateTaskInput, projectId: string, reporterId: string) {
    const id = createTaskId();
    const now = nowISO();

    // Get next position if not provided
    let position = data.position;
    if (position === undefined) {
      const maxPos = await this.db
        .select({ max: sql<number>`COALESCE(MAX(${tasks.position}), -1)` })
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, projectId),
            eq(tasks.status, data.status ?? "backlog")
          )
        );
      position = (maxPos[0]?.max ?? -1) + 1;
    }

    const { labelIds, ...taskData } = data;

    await this.db.insert(tasks).values({
      id,
      projectId,
      title: taskData.title,
      description: taskData.description ?? null,
      status: (taskData.status ?? "backlog") as any,
      priority: (taskData.priority ?? "none") as any,
      type: (taskData.type ?? "task") as any,
      assigneeId: taskData.assigneeId ?? null,
      reporterId,
      parentId: taskData.parentId ?? null,
      position,
      dueDate: taskData.dueDate ?? null,
      estimatedHours: taskData.estimatedHours ?? null,
      createdAt: now,
      updatedAt: now,
    });

    // Attach labels
    if (labelIds?.length) {
      await this.db.insert(taskLabels).values(
        labelIds.map((labelId) => ({
          taskId: id,
          labelId,
        }))
      );
    }

    return this.findById(id);
  }

  async update(id: string, data: UpdateTaskInput) {
    const now = nowISO();
    const { labelIds, ...updateData } = data;

    // Handle completion timestamp
    const extra: Record<string, any> = {};
    if (data.status === "done") {
      extra.completedAt = now;
    } else if (data.status) {
      extra.completedAt = null;
    }

    await this.db
      .update(tasks)
      .set({ ...updateData, ...extra, updatedAt: now } as any)
      .where(eq(tasks.id, id));

    // Update labels if provided
    if (labelIds !== undefined) {
      await this.db.delete(taskLabels).where(eq(taskLabels.taskId, id));
      if (labelIds.length) {
        await this.db.insert(taskLabels).values(
          labelIds.map((labelId) => ({
            taskId: id,
            labelId,
          }))
        );
      }
    }

    return this.findById(id);
  }

  async updatePosition(id: string, data: MoveTaskInput) {
    const now = nowISO();
    await this.db
      .update(tasks)
      .set({
        status: data.status,
        position: data.position,
        updatedAt: now,
        ...(data.status === "done" ? { completedAt: now } : {}),
      })
      .where(eq(tasks.id, id));
    return this.findById(id);
  }

  async bulkUpdate(taskIds: string[], data: Partial<{ status: string; assigneeId: string | null; priority: string }>) {
    const now = nowISO();
    await this.db
      .update(tasks)
      .set({ ...(data as any), updatedAt: now })
      .where(inArray(tasks.id, taskIds));
  }

  async delete(id: string) {
    await this.db.delete(tasks).where(eq(tasks.id, id));
  }

  async createSubtask(parentId: string, data: CreateTaskInput, reporterId: string) {
    const parent = await this.db.query.tasks.findFirst({
      where: eq(tasks.id, parentId),
    });
    if (!parent) return null;

    return this.create(
      { ...data, parentId },
      parent.projectId,
      reporterId
    );
  }
}
