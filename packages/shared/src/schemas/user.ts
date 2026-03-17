import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["owner", "admin", "member", "guest"]).optional().default("member"),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const updateProfileSchema = z.object({
  bio: z.string().max(500).nullable().optional(),
  timezone: z.string().optional(),
  language: z.string().min(2).max(10).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  notificationsEnabled: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
