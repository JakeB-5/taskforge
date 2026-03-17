import { eq, desc } from "drizzle-orm";
import type { DatabaseClient } from "@taskforge/database";
import { attachments } from "@taskforge/database";
import { createAttachmentId, nowISO } from "@taskforge/shared";

export class AttachmentService {
  constructor(private db: DatabaseClient) {}

  async create(input: {
    taskId: string;
    uploaderId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }) {
    const id = createAttachmentId();
    const now = nowISO();

    await this.db.insert(attachments).values({
      id,
      taskId: input.taskId,
      uploaderId: input.uploaderId,
      fileName: input.fileName,
      fileUrl: input.fileUrl,
      fileSize: input.fileSize,
      mimeType: input.mimeType,
      createdAt: now,
    });

    return this.getById(id);
  }

  async getById(id: string) {
    const result = await this.db.query.attachments.findFirst({
      where: eq(attachments.id, id),
    });
    return result ?? null;
  }

  async listByTask(taskId: string) {
    return this.db
      .select()
      .from(attachments)
      .where(eq(attachments.taskId, taskId))
      .orderBy(desc(attachments.createdAt));
  }

  async delete(id: string) {
    await this.db.delete(attachments).where(eq(attachments.id, id));
  }
}
