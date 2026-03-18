import type { Notification } from "@taskforge/shared";
import { apiClient } from "../api-client";

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

export async function getNotifications(): Promise<NotificationsResponse> {
  return apiClient.get<NotificationsResponse>("/notifications");
}

export async function markAsRead(notificationId: string): Promise<void> {
  return apiClient.patch(`/notifications/${notificationId}/read`);
}

export async function markAllAsRead(): Promise<void> {
  return apiClient.patch("/notifications/read-all");
}

export async function deleteNotification(notificationId: string): Promise<void> {
  return apiClient.delete(`/notifications/${notificationId}`);
}
