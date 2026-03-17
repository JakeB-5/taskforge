import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  description: z.string().max(500).nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  description: z.string().max(500).nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member", "guest"]).default("member"),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["admin", "member", "guest"]),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
