"use client";

import * as React from "react";
import type { Task } from "@taskforge/shared";
import { Card } from "@taskforge/ui";
import { CalendarHeader } from "./calendar-header";
import { CalendarDay } from "./calendar-day";

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days: Date[] = [];
  const current = new Date(startDate);

  while (current <= lastDay || days.length % 7 !== 0) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
    if (days.length > 42) break; // Max 6 weeks
  }

  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const days = getDaysInMonth(year, month);

  // Group tasks by due date
  const tasksByDate = React.useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      if (!task.dueDate) continue;
      const dateKey = new Date(task.dueDate).toDateString();
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(task);
    }
    return map;
  }, [tasks]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <Card className="p-4">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />
      <div className="mt-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-l border-t">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="border-r border-b bg-muted/50 px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        {/* Day cells */}
        <div className="grid grid-cols-7 border-l">
          {days.map((date, i) => (
            <CalendarDay
              key={i}
              date={date}
              isCurrentMonth={date.getMonth() === month}
              isToday={isSameDay(date, today)}
              tasks={tasksByDate.get(date.toDateString()) ?? []}
              onDateClick={setSelectedDate}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
