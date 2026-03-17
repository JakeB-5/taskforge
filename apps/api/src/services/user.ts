import { eq } from "drizzle-orm";
import { users, userProfiles } from "@taskforge/database";
import type { DatabaseClient } from "@taskforge/database";
import type { UpdateUserInput, UpdateProfileInput } from "@taskforge/shared";
import { createUserId, nowISO } from "@taskforge/shared";
import { AuthService } from "./auth";

export class UserService {
  constructor(private db: DatabaseClient) {}

  async findById(id: string) {
    const result = await this.db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        passwordHash: false,
      },
    });
    return result ?? null;
  }

  async findByEmail(email: string) {
    const result = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return result ?? null;
  }

  async findByIdWithProfile(id: string) {
    const result = await this.db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        passwordHash: false,
      },
      with: {
        profile: true,
      },
    });
    return result ?? null;
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) {
    const id = createUserId();
    const now = nowISO();
    const passwordHash = await AuthService.hashPassword(data.password);

    await this.db.insert(users).values({
      id,
      name: data.name,
      email: data.email,
      passwordHash,
      role: (data.role as any) ?? "member",
      createdAt: now,
      updatedAt: now,
    });

    // Create default profile
    await this.db.insert(userProfiles).values({
      id: `prof_${id}`,
      userId: id,
    });

    return this.findById(id);
  }

  async update(id: string, data: UpdateUserInput) {
    const now = nowISO();
    await this.db
      .update(users)
      .set({ ...data, updatedAt: now })
      .where(eq(users.id, id));

    return this.findById(id);
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const existing = await this.db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, userId),
    });

    if (!existing) {
      await this.db.insert(userProfiles).values({
        id: `prof_${userId}`,
        userId,
        ...data,
      });
    } else {
      await this.db
        .update(userProfiles)
        .set(data)
        .where(eq(userProfiles.userId, userId));
    }

    return this.findByIdWithProfile(userId);
  }

  async updateLastLogin(id: string) {
    await this.db
      .update(users)
      .set({ lastLoginAt: nowISO() })
      .where(eq(users.id, id));
  }

  async softDelete(id: string) {
    const now = nowISO();
    await this.db
      .update(users)
      .set({ isActive: false, updatedAt: now })
      .where(eq(users.id, id));
  }

  async listByWorkspace(workspaceId: string) {
    const result = await this.db.query.workspaceMembers.findMany({
      where: (wm, { eq }) => eq(wm.workspaceId, workspaceId),
      with: {
        user: {
          columns: {
            passwordHash: false,
          },
        },
      },
    });
    return result.map((wm) => ({
      ...wm.user,
      workspaceRole: wm.role,
      joinedAt: wm.joinedAt,
    }));
  }
}
