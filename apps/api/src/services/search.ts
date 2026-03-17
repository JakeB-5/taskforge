import { like, or, sql, eq, desc } from "drizzle-orm";
import type { DatabaseClient } from "@taskforge/database";
import { tasks, projects, comments } from "@taskforge/database";

interface SearchResult {
  id: string;
  type: "task" | "project" | "comment";
  title: string;
  description?: string | null;
  highlight: string;
  projectId?: string | null;
  taskId?: string | null;
}

export class SearchService {
  constructor(private db: DatabaseClient) {}

  async search(
    query: string,
    options: {
      workspaceId?: string;
      type?: "tasks" | "projects" | "comments";
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const { limit = 20, offset = 0 } = options;
    const pattern = `%${query}%`;
    const results: SearchResult[] = [];

    if (!options.type || options.type === "tasks") {
      const taskResults = await this.searchTasks(pattern, limit);
      results.push(...taskResults);
    }

    if (!options.type || options.type === "projects") {
      const projectResults = await this.searchProjects(pattern, options.workspaceId, limit);
      results.push(...projectResults);
    }

    if (!options.type || options.type === "comments") {
      const commentResults = await this.searchComments(pattern, limit);
      results.push(...commentResults);
    }

    // Sort by relevance (title matches first)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(query.toLowerCase()) ? 0 : 1;
      const bTitle = b.title.toLowerCase().includes(query.toLowerCase()) ? 0 : 1;
      return aTitle - bTitle;
    });

    return {
      items: results.slice(offset, offset + limit),
      total: results.length,
    };
  }

  private async searchTasks(
    pattern: string,
    limit: number = 20
  ): Promise<SearchResult[]> {
    const rows = await this.db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        projectId: tasks.projectId,
      })
      .from(tasks)
      .where(
        or(
          like(tasks.title, pattern),
          like(tasks.description, pattern)
        )
      )
      .orderBy(desc(tasks.updatedAt))
      .limit(limit);

    return rows.map((row) => ({
      id: row.id,
      type: "task" as const,
      title: row.title,
      description: row.description,
      highlight: this.createHighlight(row.title, row.description),
      projectId: row.projectId,
    }));
  }

  private async searchProjects(
    pattern: string,
    workspaceId?: string,
    limit: number = 20
  ): Promise<SearchResult[]> {
    const baseCondition = or(
      like(projects.name, pattern),
      like(projects.description, pattern)
    );

    const rows = await this.db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
      })
      .from(projects)
      .where(
        workspaceId
          ? sql`(${baseCondition}) AND ${projects.workspaceId} = ${workspaceId}`
          : baseCondition
      )
      .orderBy(desc(projects.updatedAt))
      .limit(limit);

    return rows.map((row) => ({
      id: row.id,
      type: "project" as const,
      title: row.name,
      description: row.description,
      highlight: this.createHighlight(row.name, row.description),
    }));
  }

  private async searchComments(
    pattern: string,
    limit: number = 20
  ): Promise<SearchResult[]> {
    const rows = await this.db
      .select({
        id: comments.id,
        content: comments.content,
        taskId: comments.taskId,
      })
      .from(comments)
      .where(like(comments.content, pattern))
      .orderBy(desc(comments.createdAt))
      .limit(limit);

    return rows.map((row) => ({
      id: row.id,
      type: "comment" as const,
      title: row.content.substring(0, 100),
      highlight: this.createHighlight(row.content),
      taskId: row.taskId,
    }));
  }

  private createHighlight(...texts: (string | null | undefined)[]): string {
    for (const text of texts) {
      if (text) {
        return text.length > 150 ? text.substring(0, 150) + "..." : text;
      }
    }
    return "";
  }
}
