import { eq, and, sql } from "drizzle-orm";
import { projects, projectMembers, tasks } from "@taskforge/database";
import type { DatabaseClient } from "@taskforge/database";
import type { CreateProjectInput, UpdateProjectInput } from "@taskforge/shared";
import { createProjectId, nowISO, slugify, generateId } from "@taskforge/shared";

export class ProjectService {
  constructor(private db: DatabaseClient) {}

  async findById(id: string) {
    const result = await this.db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        owner: { columns: { passwordHash: false } },
      },
    });
    return result ?? null;
  }

  async findByIdWithStats(id: string) {
    const project = await this.findById(id);
    if (!project) return null;

    // Get task counts by status
    const taskCounts = await this.db
      .select({
        status: tasks.status,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(tasks)
      .where(eq(tasks.projectId, id))
      .groupBy(tasks.status);

    const stats: Record<string, number> = { total: 0 };
    for (const row of taskCounts) {
      stats[row.status] = row.count;
      stats.total += row.count;
    }

    return { ...project, stats };
  }

  async listByWorkspace(workspaceId: string) {
    return this.db.query.projects.findMany({
      where: eq(projects.workspaceId, workspaceId),
      with: {
        owner: { columns: { passwordHash: false } },
      },
      orderBy: (p, { desc }) => [desc(p.createdAt)],
    });
  }

  async create(data: CreateProjectInput, workspaceId: string, ownerId: string) {
    const id = createProjectId();
    const now = nowISO();
    const slug = data.slug ?? slugify(data.name);

    await this.db.insert(projects).values({
      id,
      workspaceId,
      name: data.name,
      slug,
      description: data.description ?? null,
      status: data.status ?? "active",
      color: data.color ?? null,
      iconUrl: data.iconUrl ?? null,
      ownerId,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      createdAt: now,
      updatedAt: now,
    });

    // Add owner as project lead
    await this.db.insert(projectMembers).values({
      id: generateId(),
      projectId: id,
      userId: ownerId,
      role: "lead",
      createdAt: now,
      updatedAt: now,
    });

    return this.findById(id);
  }

  async update(id: string, data: UpdateProjectInput) {
    const now = nowISO();
    await this.db
      .update(projects)
      .set({ ...data, updatedAt: now })
      .where(eq(projects.id, id));
    return this.findById(id);
  }

  async delete(id: string) {
    await this.db.delete(projects).where(eq(projects.id, id));
  }

  // Members
  async getMembers(projectId: string) {
    const members = await this.db.query.projectMembers.findMany({
      where: eq(projectMembers.projectId, projectId),
      with: {
        user: { columns: { passwordHash: false } },
      },
    });
    return members.map((m) => ({
      ...m.user,
      role: m.role,
      membershipId: m.id,
    }));
  }

  async addMember(projectId: string, userId: string, role: string = "member") {
    const now = nowISO();
    await this.db.insert(projectMembers).values({
      id: generateId(),
      projectId,
      userId,
      role: role as any,
      createdAt: now,
      updatedAt: now,
    });
  }
}
