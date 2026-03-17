"use client";

import type { Task } from "@taskforge/shared";
import { cn } from "@taskforge/ui";
import { PRIORITY_COLORS } from "@taskforge/shared";

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
  onDateClick: (date: Date) => void;
  onTaskClick: (task: Task) => void;
}

export function CalendarDay({
  date,
  isCurrentMonth,
  isToday,
  tasks,
  onDateClick,
  onTaskClick,
}: CalendarDayProps) {
  return (
    <div
      className={cn(
        "min-h-[100px] border-r border-b p-1 cursor-pointer hover:bg-accent/50 transition-colors",
        !isCurrentMonth && "bg-muted/30 text-muted-foreground"
      )}
      onClick={() => onDateClick(date)}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
            isToday && "bg-primary text-primary-foreground font-bold"
          )}
        >
          {date.getDate()}
        </span>
        {tasks.length > 0 && (
          <span className="text-xs text-muted-foreground">{tasks.length}</span>
        )}
      </div>
      <div className="mt-1 space-y-0.5">
        {tasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className={cn(
              "truncate rounded px-1 py-0.5 text-xs cursor-pointer hover:opacity-80",
              task.priority === "urgent" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
              task.priority === "high" && "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
              task.priority === "medium" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
              task.priority === "low" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
              task.priority === "none" && "bg-muted text-muted-foreground"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onTaskClick(task);
            }}
          >
            {task.title}
          </div>
        ))}
        {tasks.length > 3 && (
          <span className="text-xs text-muted-foreground pl-1">
            +{tasks.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}
