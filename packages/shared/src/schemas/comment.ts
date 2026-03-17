import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.string().min(1, "Comment body is required").max(10000),
  parentId: z.string().nullable().optional(),
});

export const updateCommentSchema = z.object({
  body: z.string().min(1, "Comment body is required").max(10000),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
