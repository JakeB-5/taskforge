import { z } from "zod";

export const createLabelSchema = z.object({
  name: z.string().min(1, "Label name is required").max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  description: z.string().max(200).nullable().optional(),
});

export const updateLabelSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  description: z.string().max(200).nullable().optional(),
});

export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;
