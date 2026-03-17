import type { Timestamps, SoftDelete } from "./common";

export interface Comment extends Timestamps, SoftDelete {
  id: string;
  taskId: string;
  authorId: string;
  parentId: string | null;
  body: string;
  editedAt: string | null;
}
