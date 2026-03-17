"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTaskStore } from "@/stores/task-store";
import { CalendarView } from "@/components/calendar/calendar-view";
import { Spinner } from "@taskforge/ui";

export default function ProjectCalendarPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { tasks, isLoading, fetchTasks } = useTaskStore();

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  if (isLoading) {
    return <Spinner className="py-12" />;
  }

  return (
    <CalendarView
      tasks={tasks}
      onTaskClick={(task) => {
        // Could open task detail modal
        console.log("Task clicked:", task.id);
      }}
    />
  );
}
