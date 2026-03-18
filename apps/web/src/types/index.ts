import type { Task, Comment, Label, User } from "@taskforge/shared";

export interface TaskWithRelations extends Task {
  subtasks?: Task[];
  labels?: Label[];
  comments?: Comment[];
  assignee?: User | null;
  reporter?: User | null;
}

export interface CommentWithAuthor extends Comment {
  author?: User;
}
