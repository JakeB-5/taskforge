"use client";

import { create } from "zustand";
import type { Task, TaskStatus, Pagination } from "@taskforge/shared";
import type { CreateTaskInput, UpdateTaskInput, FilterTasksInput, MoveTaskInput } from "@taskforge/shared";
import { TASK_STATUSES } from "@taskforge/shared";
import { getTasks, getTask, createTask, updateTask, moveTask, deleteTask } from "@/lib/api/tasks";

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  pagination: Pagination | null;
  filters: Partial<FilterTasksInput>;
  isLoading: boolean;
  error: string | null;

  // Board columns - tasks grouped by status
  columns: Record<string, Task[]>;

  // Actions
  fetchTasks: (projectId: string, filters?: Partial<FilterTasksInput>) => Promise<void>;
  fetchTask: (projectId: string, taskId: string) => Promise<void>;
  create: (projectId: string, data: CreateTaskInput) => Promise<Task>;
  update: (projectId: string, taskId: string, data: UpdateTaskInput) => Promise<Task>;
  move: (projectId: string, taskId: string, data: MoveTaskInput) => Promise<void>;
  remove: (projectId: string, taskId: string) => Promise<void>;
  setCurrentTask: (task: Task | null) => void;
  setFilters: (filters: Partial<FilterTasksInput>) => void;

  // Optimistic DnD
  optimisticMove: (taskId: string, newStatus: string, newPosition: number) => void;
}

function groupByStatus(tasks: Task[]): Record<string, Task[]> {
  const columns: Record<string, Task[]> = {};
  for (const status of TASK_STATUSES) {
    columns[status] = [];
  }
  for (const task of tasks) {
    if (!columns[task.status]) columns[task.status] = [];
    columns[task.status].push(task);
  }
  // Sort each column by position
  for (const status of Object.keys(columns)) {
    columns[status].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }
  return columns;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  pagination: null,
  filters: {},
  isLoading: false,
  error: null,
  columns: {},

  fetchTasks: async (projectId, filters) => {
    set({ isLoading: true, error: null });
    try {
      const merged = { ...get().filters, ...filters, perPage: 200 };
      const result = await getTasks(projectId, merged);
      const tasks = result.tasks ?? [];
      set({
        tasks,
        columns: groupByStatus(tasks),
        pagination: result.pagination,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load tasks", isLoading: false });
    }
  },

  fetchTask: async (_projectId, taskId) => {
    try {
      const task = await getTask(taskId);
      set({ currentTask: task });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load task" });
    }
  },

  create: async (projectId, data) => {
    const task = await createTask(projectId, data);
    set((state) => {
      const tasks = [...state.tasks, task];
      return { tasks, columns: groupByStatus(tasks) };
    });
    return task;
  },

  update: async (_projectId, taskId, data) => {
    const task = await updateTask(taskId, data);
    set((state) => {
      const tasks = state.tasks.map((t) => (t.id === taskId ? task : t));
      return {
        tasks,
        columns: groupByStatus(tasks),
        currentTask: state.currentTask?.id === taskId ? task : state.currentTask,
      };
    });
    return task;
  },

  move: async (projectId, taskId, data) => {
    // Optimistic update already applied
    try {
      await moveTask(taskId, data);
    } catch {
      // Revert on failure by refetching
      get().fetchTasks(projectId);
    }
  },

  remove: async (_projectId, taskId) => {
    await deleteTask(taskId);
    set((state) => {
      const tasks = state.tasks.filter((t) => t.id !== taskId);
      return {
        tasks,
        columns: groupByStatus(tasks),
        currentTask: state.currentTask?.id === taskId ? null : state.currentTask,
      };
    });
  },

  setCurrentTask: (task) => set({ currentTask: task }),

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),

  optimisticMove: (taskId, newStatus, newPosition) => {
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus as TaskStatus, position: newPosition }
          : t
      );
      return { tasks, columns: groupByStatus(tasks) };
    });
  },
}));
