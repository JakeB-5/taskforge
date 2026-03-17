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

export async function search(workspaceId: string, query: string): Promise<SearchResponse> {
  return apiClient.get<SearchResponse>(`/workspaces/${workspaceId}/search`, { q: query });
}
