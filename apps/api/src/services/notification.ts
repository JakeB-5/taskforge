import { eq, and, desc, sql } from "drizzle-orm";
import type { DatabaseClient } from "@taskforge/database";
import { notifications } from "@taskforge/database";
import { createNotificationId, nowISO } from "@taskforge/shared";

export class NotificationService {
  constructor(private db: DatabaseClient) {}

  async create(input: {
    userId: string;
    type: string;
    title: string;
    message: string;
    linkUrl?: string | null;
  }) {
    const id = createNotificationId();
    const now = nowISO();

    await this.db.insert(notifications).values({
      id,
      userId: input.userId,
      type: input.type as any,
      title: input.title,
      message: input.message,
      linkUrl: input.linkUrl ?? null,
      isRead: false,
      createdAt: now,
    });

    return { id };
  }

  async listByUser(
    userId: string,
    options: { limit?: number; offset?: number } = {}
  ) {
    const { limit = 50, offset = 0 } = options;

    const items = await this.db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(eq(notifications.userId, userId));

    const unreadResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        )
      );

    return {
      items,
      total: countResult[0]?.count ?? 0,
      unreadCount: unreadResult[0]?.count ?? 0,
    };
  }

  async markAsRead(id: string, userId: string) {
    await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
  }

  async markAllAsRead(userId: string) {
    await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        )
      );
  }

  async delete(id: string, userId: string) {
    await this.db
      .delete(notifications)
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
  }

  async getById(id: string) {
    const result = await this.db.query.notifications.findFirst({
      where: eq(notifications.id, id),
    });
    return result ?? null;
  }
}
