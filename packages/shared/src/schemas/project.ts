import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  description: z.string().max(2000).nullable().optional(),
  status: z.enum(["active", "archived", "completed"]).optional().default("active"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").nullable().optional(),
  iconUrl: z.string().url().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().max(2000).nullable().optional(),
  status: z.enum(["active", "archived", "completed"]).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable().optional(),
  iconUrl: z.string().url().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
