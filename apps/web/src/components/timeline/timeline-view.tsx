"use client";

import * as React from "react";
import type { Task } from "@taskforge/shared";
import { Card, ScrollArea } from "@taskforge/ui";
import { TimelineHeader } from "./timeline-header";
import { TimelineBar } from "./timeline-bar";

interface TimelineViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const DAY_WIDTH = 20;
const ROW_HEIGHT = 32;
const WEEKS_BEFORE = 2;
const WEEKS_AFTER = 12;

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

export function TimelineView({ tasks, onTaskClick }: TimelineViewProps) {
  const today = new Date();
  const timelineStart = new Date(today);
  timelineStart.setDate(timelineStart.getDate() - WEEKS_BEFORE * 7);
  const startWeek = getWeekStart(timelineStart);

  const totalWeeks = WEEKS_BEFORE + WEEKS_AFTER;
  const weeks: Date[] = [];
  for (let i = 0; i < totalWeeks; i++) {
    const w = new Date(startWeek);
    w.setDate(w.getDate() + i * 7);
    weeks.push(w);
  }

  const totalWidth = totalWeeks * 7 * DAY_WIDTH;
  const todayOffset = daysBetween(startWeek, today) * DAY_WIDTH;

  // Filter tasks that have dates
  const timelineTasks = tasks.filter((t) => t.createdAt || t.dueDate);

  return (
    <Card className="overflow-hidden">
      <ScrollArea className="w-full" style={{ maxHeight: "600px" }}>
        <div style={{ width: totalWidth, position: "relative" }}>
          <TimelineHeader weeks={weeks} dayWidth={DAY_WIDTH} />

          {/* Today marker */}
          <div
            className="absolute top-0 bottom-0 w-px bg-red-500 z-20"
            style={{ left: todayOffset }}
          />

          {/* Task rows */}
          <div className="relative">
            {timelineTasks.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                No tasks with dates to display
              </div>
            ) : (
              timelineTasks.map((task, index) => {
                const created = new Date(task.createdAt);
                const due = task.dueDate ? new Date(task.dueDate) : new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000);

                const startOffset = daysBetween(startWeek, created) * DAY_WIDTH;
                const barWidth = daysBetween(created, due) * DAY_WIDTH;

                return (
                  <div
                    key={task.id}
                    className="relative border-b"
                    style={{ height: ROW_HEIGHT }}
                  >
                    <TimelineBar
                      task={task}
                      left={Math.max(startOffset, 0)}
                      width={Math.max(barWidth, DAY_WIDTH)}
                      onClick={onTaskClick}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Task list sidebar reference */}
      <div className="border-t p-2">
        <p className="text-xs text-muted-foreground">
          {timelineTasks.length} tasks shown | Scroll horizontally to view timeline
        </p>
      </div>
    </Card>
  );
}
