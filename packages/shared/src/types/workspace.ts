import type { Timestamps } from "./common";
import type { UserRole } from "./user";

export interface Workspace extends Timestamps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  ownerId: string;
}

export interface WorkspaceMember extends Timestamps {
  id: string;
  workspaceId: string;
  userId: string;
  role: UserRole;
  joinedAt: string;
}
