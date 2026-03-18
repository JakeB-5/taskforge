"use client";

import { create } from "zustand";
import type { Notification } from "@taskforge/shared";
import {
  getNotifications,
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
      const { notifications, unreadCount } = await getNotifications();
      set({ notifications, unreadCount, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load notifications", isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { unreadCount } = await getNotifications();
      set({ unreadCount });
    } catch {
      // Silent fail for count refresh
    }
  },

  markRead: async (id) => {
    await markAsRead(id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
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
