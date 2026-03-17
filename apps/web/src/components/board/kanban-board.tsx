"use client";

import { useEffect, useCallback } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { useState } from "react";
import { TASK_STATUSES } from "@taskforge/shared";
import type { Task } from "@taskforge/shared";
import { Spinner } from "@taskforge/ui";
import { useTaskStore } from "@/stores/task-store";
import { BoardColumn } from "./board-column";
import { BoardFilters } from "./board-filters";
import { TaskCard } from "./task-card";

interface KanbanBoardProps {
  projectId: string;
  onTaskClick: (task: Task) => void;
}

// Visible board columns (exclude cancelled from the board)
const BOARD_STATUSES = TASK_STATUSES.filter((s) => s !== "cancelled");

export function KanbanBoard({ projectId, onTaskClick }: KanbanBoardProps) {
  const { columns, isLoading, fetchTasks, optimisticMove, move } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    fetchTasks(projectId);
  }, [projectId, fetchTasks]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const taskId = event.active.id as string;
      // Find task in columns
      for (const tasks of Object.values(columns)) {
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
          setActiveTask(task);
          break;
        }
      }
    },
    [columns]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      const overId = over.id as string;

      // Determine target status - over could be a column (status) or a task
      let targetStatus = overId;
      if (!BOARD_STATUSES.includes(overId as any)) {
        // overId is a task - find its status
        for (const [status, tasks] of Object.entries(columns)) {
          if (tasks.some((t) => t.id === overId)) {
            targetStatus = status;
            break;
          }
        }
      }

      // Find the task's current status
      let currentStatus = "";
      for (const [status, tasks] of Object.entries(columns)) {
        if (tasks.some((t) => t.id === taskId)) {
          currentStatus = status;
          break;
        }
      }

      // Calculate new position
      const targetTasks = columns[targetStatus] ?? [];
      const overIndex = targetTasks.findIndex((t) => t.id === overId);
      const newPosition = overIndex >= 0 ? overIndex : targetTasks.length;

      if (currentStatus === targetStatus && overIndex === -1) return;

      // Optimistic update
      optimisticMove(taskId, targetStatus, newPosition);

      // Sync with API
      move(projectId, taskId, {
        status: targetStatus as any,
        position: newPosition,
      });
    },
    [columns, optimisticMove, move, projectId]
  );

  if (isLoading && Object.keys(columns).length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div>
      <BoardFilters projectId={projectId} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 220px)" }}>
          {BOARD_STATUSES.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              tasks={columns[status] ?? []}
              projectId={projectId}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} onClick={() => {}} />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
