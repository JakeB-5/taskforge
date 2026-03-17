import { eq, and } from "drizzle-orm";
import { workspaces, workspaceMembers, users } from "@taskforge/database";
import type { DatabaseClient } from "@taskforge/database";
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from "@taskforge/shared";
import { createWorkspaceId, nowISO, slugify, generateId } from "@taskforge/shared";

export class WorkspaceService {
  constructor(private db: DatabaseClient) {}

  async findById(id: string) {
    const result = await this.db.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
      with: {
        owner: { columns: { passwordHash: false } },
      },
    });
    return result ?? null;
  }

  async findBySlug(slug: string) {
    const result = await this.db.query.workspaces.findFirst({
      where: eq(workspaces.slug, slug),
    });
    return result ?? null;
  }

  async listByUser(userId: string) {
    const memberships = await this.db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.userId, userId),
      with: {
        workspace: {
          with: {
            owner: { columns: { passwordHash: false } },
          },
        },
      },
    });
    return memberships.map((m) => ({
      ...m.workspace,
      memberRole: m.role,
    }));
  }

  async create(data: CreateWorkspaceInput, ownerId: string) {
    const id = createWorkspaceId();
    const now = nowISO();
    const slug = data.slug ?? slugify(data.name);

    await this.db.insert(workspaces).values({
      id,
      name: data.name,
      slug,
      description: data.description ?? null,
      logoUrl: data.logoUrl ?? null,
      ownerId,
      createdAt: now,
      updatedAt: now,
    });

    // Add owner as workspace member
    await this.db.insert(workspaceMembers).values({
      id: generateId(),
      workspaceId: id,
      userId: ownerId,
      role: "owner",
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return this.findById(id);
  }

  async update(id: string, data: UpdateWorkspaceInput) {
    const now = nowISO();
    await this.db
      .update(workspaces)
      .set({ ...data, updatedAt: now })
      .where(eq(workspaces.id, id));
    return this.findById(id);
  }

  async delete(id: string) {
    await this.db.delete(workspaces).where(eq(workspaces.id, id));
  }

  // Members
  async getMembers(workspaceId: string) {
    const members = await this.db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.workspaceId, workspaceId),
      with: {
        user: { columns: { passwordHash: false } },
      },
    });
    return members.map((m) => ({
      ...m.user,
      role: m.role,
      joinedAt: m.joinedAt,
      membershipId: m.id,
    }));
  }

  async getMember(workspaceId: string, userId: string) {
    const result = await this.db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      ),
    });
    return result ?? null;
  }

  async addMember(workspaceId: string, userId: string, role: string = "member") {
    const now = nowISO();
    await this.db.insert(workspaceMembers).values({
      id: generateId(),
      workspaceId,
      userId,
      role: role as any,
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  async removeMember(workspaceId: string, userId: string) {
    await this.db
      .delete(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, userId)
        )
      );
  }
}
