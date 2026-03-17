import type { Timestamps } from "./common";

export type ProjectStatus = "active" | "archived" | "completed";

export interface Project extends Timestamps {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  iconUrl: string | null;
  color: string | null;
  ownerId: string;
  startDate: string | null;
  endDate: string | null;
}

export type ProjectMemberRole = "lead" | "member" | "viewer";

export interface ProjectMember extends Timestamps {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectMemberRole;
}
