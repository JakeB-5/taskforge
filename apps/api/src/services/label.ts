import { eq, and } from "drizzle-orm";
import { labels, taskLabels } from "@taskforge/database";
import type { DatabaseClient } from "@taskforge/database";
import type { CreateLabelInput, UpdateLabelInput } from "@taskforge/shared";
import { createLabelId, nowISO } from "@taskforge/shared";

export class LabelService {
  constructor(private db: DatabaseClient) {}

  async findById(id: string) {
    const result = await this.db.query.labels.findFirst({
      where: eq(labels.id, id),
    });
    return result ?? null;
  }

  async listByProject(projectId: string) {
    return this.db.query.labels.findMany({
      where: eq(labels.projectId, projectId),
      orderBy: (l, { asc }) => [asc(l.name)],
    });
  }

  async create(data: CreateLabelInput, projectId: string) {
    const id = createLabelId();
    const now = nowISO();

    await this.db.insert(labels).values({
      id,
      projectId,
      name: data.name,
      color: data.color,
      description: data.description ?? null,
      createdAt: now,
      updatedAt: now,
    });

    return this.findById(id);
  }

  async update(id: string, data: UpdateLabelInput) {
    const now = nowISO();
    await this.db
      .update(labels)
      .set({ ...data, updatedAt: now })
      .where(eq(labels.id, id));
    return this.findById(id);
  }

  async delete(id: string) {
    await this.db.delete(labels).where(eq(labels.id, id));
  }

  async addToTask(taskId: string, labelId: string) {
    await this.db.insert(taskLabels).values({ taskId, labelId });
  }

  async removeFromTask(taskId: string, labelId: string) {
    await this.db
      .delete(taskLabels)
      .where(and(eq(taskLabels.taskId, taskId), eq(taskLabels.labelId, labelId)));
  }
}
