"use client";

import { useEffect, useState } from "react";
import { useNotificationStore } from "@/stores/notification-store";
import { NotificationItem } from "@/components/notifications/notification-item";
import { Button, EmptyState, Skeleton } from "@taskforge/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@taskforge/ui";
import { Bell, CheckCheck } from "lucide-react";
import type { NotificationType } from "@taskforge/shared";

const FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "task_assigned", label: "Task Assigned" },
  { value: "comment_added", label: "Comments" },
  { value: "task_due_soon", label: "Due Soon" },
  { value: "task_overdue", label: "Overdue" },
];

export default function NotificationsPage() {
  const { notifications, isLoading, fetchNotifications, markRead, markAllRead, remove } =
    useNotificationStore();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return n.type === filter;
  });

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your workspace activity.</p>
        </div>
        {hasUnread && (
          <Button variant="outline" size="sm" onClick={() => markAllRead()}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={markRead}
              onDelete={remove}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bell className="h-6 w-6 text-muted-foreground" />}
          title="No notifications"
          description={
            filter !== "all"
              ? "No notifications match your filter."
              : "You're all caught up! New notifications will appear here."
          }
        />
      )}
    </div>
  );
}
