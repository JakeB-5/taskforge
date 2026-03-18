import type { User } from "@taskforge/shared";
import type { LoginInput, RegisterInput, ForgotPasswordInput } from "@taskforge/shared";
import { apiClient } from "../api-client";

export interface AuthResponse {
  user: User;
  token: string;
}

export async function login(data: LoginInput): Promise<AuthResponse> {
  // Backend returns { user, token } wrapped in data
  return apiClient.post<AuthResponse>("/auth/login", data);
}

export async function register(data: RegisterInput): Promise<AuthResponse> {
  // Backend returns { user, token } wrapped in data
  return apiClient.post<AuthResponse>("/auth/register", data);
}

export async function forgotPassword(data: ForgotPasswordInput): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/auth/forgot-password", data);
}

export async function getMe(): Promise<User> {
  // Backend returns { user: {...} }, unwrap the wrapper key
  const res = await apiClient.get<{ user: User }>("/auth/me");
  return res.user;
}
