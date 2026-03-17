import type { Timestamps } from "./common";

export interface Label extends Timestamps {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
  description: string | null;
}
