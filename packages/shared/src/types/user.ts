import type { Timestamps } from "./common";

export type UserRole = "owner" | "admin" | "member" | "guest";

export interface User extends Timestamps {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  emailVerifiedAt: string | null;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio: string | null;
  timezone: string;
  language: string;
  theme: "light" | "dark" | "system";
  notificationsEnabled: boolean;
}
