"use client";

import { create } from "zustand";
import type { Notification } from "@taskforge/shared";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "@/lib/api/notifications";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await getNotifications();
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load notifications", isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { count } = await getUnreadCount();
      set({ unreadCount: count });
    } catch {
      // Silent fail for count refresh
    }
  },

  markRead: async (id) => {
    await markAsRead(id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllRead: async () => {
    await markAllAsRead();
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        isRead: true,
        readAt: n.readAt || new Date().toISOString(),
      })),
      unreadCount: 0,
    }));
  },

  remove: async (id) => {
    await deleteNotification(id);
    set((state) => {
      const removed = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: removed && !removed.isRead ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
  },
}));
