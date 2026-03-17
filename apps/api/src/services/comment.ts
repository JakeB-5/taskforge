import { eq } from "drizzle-orm";
import { comments } from "@taskforge/database";
import type { DatabaseClient } from "@taskforge/database";
import { createCommentId, nowISO } from "@taskforge/shared";

export class CommentService {
  constructor(private db: DatabaseClient) {}

  async findById(id: string) {
    const result = await this.db.query.comments.findFirst({
      where: eq(comments.id, id),
      with: {
        author: { columns: { passwordHash: false } },
      },
    });
    return result ?? null;
  }

  async listByTask(taskId: string) {
    return this.db.query.comments.findMany({
      where: eq(comments.taskId, taskId),
      with: {
        author: { columns: { passwordHash: false } },
      },
      orderBy: (c, { asc }) => [asc(c.createdAt)],
    });
  }

  async create(taskId: string, authorId: string, content: string) {
    const id = createCommentId();
    const now = nowISO();

    await this.db.insert(comments).values({
      id,
      taskId,
      authorId,
      content,
      createdAt: now,
      updatedAt: now,
    });

    return this.findById(id);
  }

  async update(id: string, content: string) {
    const now = nowISO();
    await this.db
      .update(comments)
      .set({ content, updatedAt: now })
      .where(eq(comments.id, id));
    return this.findById(id);
  }

  async delete(id: string) {
    await this.db.delete(comments).where(eq(comments.id, id));
  }
}
