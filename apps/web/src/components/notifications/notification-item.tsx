"use client";

import { cn } from "@/lib/utils";
import { Button } from "@taskforge/ui";
import {
  CheckSquare,
  MessageSquare,
  UserPlus,
  AlertCircle,
  Clock,
  Bell,
  Check,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Notification, NotificationType } from "@taskforge/shared";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const ICON_MAP: Record<NotificationType, typeof Bell> = {
  task_assigned: CheckSquare,
  task_mentioned: CheckSquare,
  task_status_changed: CheckSquare,
  task_due_soon: Clock,
  task_overdue: AlertCircle,
  comment_added: MessageSquare,
  comment_mentioned: MessageSquare,
  project_invitation: UserPlus,
  workspace_invitation: UserPlus,
};

export function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  const Icon = ICON_MAP[notification.type] || Bell;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 transition-colors",
        notification.isRead ? "bg-background" : "bg-primary/5 border-primary/20"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          notification.isRead ? "bg-muted" : "bg-primary/10"
        )}
      >
        <Icon className={cn("h-4 w-4", notification.isRead ? "text-muted-foreground" : "text-primary")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm", !notification.isRead && "font-medium")}>{notification.title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{notification.body}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMarkRead(notification.id)}
            title="Mark as read"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(notification.id)}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
