import { apiClient } from "../api-client";

export interface SearchResult {
  type: "task" | "project" | "comment";
  id: string;
  title: string;
  description: string | null;
  projectId?: string;
  projectName?: string;
  highlight?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}

export async function search(query: string, workspaceId?: string, type?: "tasks" | "projects" | "comments"): Promise<SearchResponse> {
  return apiClient.get<SearchResponse>("/search", { q: query, workspaceId, type } as Record<string, unknown>);
}
