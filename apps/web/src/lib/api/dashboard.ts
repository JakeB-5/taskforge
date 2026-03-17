import { apiClient } from "../api-client";

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  tasksInProgress: number;
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
  }>;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    dueDate: string;
    projectName: string;
  }>;
}

export async function getDashboardStats(workspaceId: string): Promise<DashboardStats> {
  return apiClient.get<DashboardStats>(`/workspaces/${workspaceId}/dashboard`);
}
