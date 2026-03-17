import type { Notification } from "@taskforge/shared";
import { apiClient } from "../api-client";

export async function getNotifications(): Promise<Notification[]> {
  return apiClient.get<Notification[]>("/notifications");
}

export async function getUnreadCount(): Promise<{ count: number }> {
  return apiClient.get<{ count: number }>("/notifications/unread-count");
}

export async function markAsRead(notificationId: string): Promise<Notification> {
  return apiClient.post<Notification>(`/notifications/${notificationId}/read`);
}

export async function markAllAsRead(): Promise<void> {
  return apiClient.post("/notifications/read-all");
}

export async function deleteNotification(notificationId: string): Promise<void> {
  return apiClient.delete(`/notifications/${notificationId}`);
}
