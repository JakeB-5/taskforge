import type { User } from "@taskforge/shared";
import type { LoginInput, RegisterInput, ForgotPasswordInput } from "@taskforge/shared";
import { apiClient } from "../api-client";

interface AuthResponse {
  user: User;
  token: string;
}

export async function login(data: LoginInput): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/login", data);
}

export async function register(data: RegisterInput): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/register", data);
}

export async function forgotPassword(data: ForgotPasswordInput): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>("/auth/forgot-password", data);
}

export async function getMe(): Promise<User> {
  return apiClient.get<User>("/auth/me");
}
