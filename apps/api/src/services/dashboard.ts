import { eq, and, sql, desc } from "drizzle-orm";
import type { DatabaseClient } from "@taskforge/database";
import { tasks, projects, activities } from "@taskforge/database";
import { nowISO } from "@taskforge/shared";

export class DashboardService {
  constructor(private db: DatabaseClient) {}

  async getWorkspaceDashboard(workspaceId: string) {
    const workspaceProjects = await this.db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.workspaceId, workspaceId));

    const projectIds = workspaceProjects.map((p) => p.id);

    if (projectIds.length === 0) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        tasksByStatus: {},
        tasksByPriority: {},
        recentActivities: [],
        upcomingDeadlines: [],
        projectCount: 0,
      };
    }

    const projectIdList = sql.join(
      projectIds.map((id) => sql`${id}`),
      sql`, `
    );

    // Task counts by status
    const statusCounts = await this.db
      .select({
        status: tasks.status,
        count: sql<number>`count(*)`,
      })
      .from(tasks)
      .where(sql`${tasks.projectId} IN (${projectIdList})`)
      .groupBy(tasks.status);

    const tasksByStatus: Record<string, number> = {};
    let totalTasks = 0;
    let completedTasks = 0;
    for (const row of statusCounts) {
      tasksByStatus[row.status] = row.count;
      totalTasks += row.count;
      if (row.status === "done") completedTasks = row.count;
    }

    // Task counts by priority
    const priorityCounts = await this.db
      .select({
        priority: tasks.priority,
        count: sql<number>`count(*)`,
      })
      .from(tasks)
      .where(sql`${tasks.projectId} IN (${projectIdList})`)
      .groupBy(tasks.priority);

    const tasksByPriority: Record<string, number> = {};
    for (const row of priorityCounts) {
      tasksByPriority[row.priority] = row.count;
    }

    // Overdue tasks
    const now = nowISO();
    const overdueResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(
        and(
          sql`${tasks.projectId} IN (${projectIdList})`,
          sql`${tasks.dueDate} IS NOT NULL`,
          sql`${tasks.dueDate} < ${now}`,
          sql`${tasks.status} NOT IN ('done', 'cancelled')`
        )
      );
    const overdueTasks = overdueResult[0]?.count ?? 0;

    // Recent activities
    const recentActivities = await this.db
      .select()
      .from(activities)
      .where(eq(activities.workspaceId, workspaceId))
      .orderBy(desc(activities.createdAt))
      .limit(10);

    // Upcoming deadlines (next 7 days)
    const sevenDaysFromNow = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const upcomingDeadlines = await this.db
      .select()
      .from(tasks)
      .where(
        and(
          sql`${tasks.projectId} IN (${projectIdList})`,
          sql`${tasks.dueDate} IS NOT NULL`,
          sql`${tasks.dueDate} >= ${now}`,
          sql`${tasks.dueDate} <= ${sevenDaysFromNow}`,
          sql`${tasks.status} NOT IN ('done', 'cancelled')`
        )
      )
      .orderBy(tasks.dueDate)
      .limit(10);

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      tasksByStatus,
      tasksByPriority,
      recentActivities,
      upcomingDeadlines,
      projectCount: projectIds.length,
    };
  }
}
