"use client";

import type { Task } from "@taskforge/shared";
import { cn } from "@taskforge/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@taskforge/ui";

interface TimelineBarProps {
  task: Task;
  left: number;
  width: number;
  onClick: (task: Task) => void;
}

const STATUS_COLORS: Record<string, string> = {
  backlog: "bg-gray-400",
  todo: "bg-blue-400",
  in_progress: "bg-yellow-400",
  in_review: "bg-purple-400",
  done: "bg-green-400",
  cancelled: "bg-red-300",
};

export function TimelineBar({ task, left, width, onClick }: TimelineBarProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "absolute top-1 h-6 rounded-sm cursor-pointer hover:opacity-80 transition-opacity flex items-center px-1.5 overflow-hidden",
              STATUS_COLORS[task.status] ?? "bg-gray-400"
            )}
            style={{
              left: `${left}px`,
              width: `${Math.max(width, 20)}px`,
            }}
            onClick={() => onClick(task)}
          >
            <span className="truncate text-xs text-white font-medium">
              {task.title}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-medium">{task.title}</p>
            <p className="text-muted-foreground">
              Status: {task.status} | Priority: {task.priority}
            </p>
            {task.dueDate && (
              <p className="text-muted-foreground">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
