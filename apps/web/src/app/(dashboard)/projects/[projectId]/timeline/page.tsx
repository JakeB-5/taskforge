"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTaskStore } from "@/stores/task-store";
import { TimelineView } from "@/components/timeline/timeline-view";
import { Spinner } from "@taskforge/ui";

export default function ProjectTimelinePage() {
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
    <TimelineView
      tasks={tasks}
      onTaskClick={(task) => {
        console.log("Task clicked:", task.id);
      }}
    />
  );
}
