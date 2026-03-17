"use client";

import { useEffect, useState, useCallback } from "react";
import type { Task } from "@taskforge/shared";
import { Dialog, DialogContent } from "@taskforge/ui";
import { Input } from "@taskforge/ui";
import { Textarea } from "@taskforge/ui";
import { Separator } from "@taskforge/ui";
import { Spinner } from "@taskforge/ui";
import { useTaskStore } from "@/stores/task-store";
import { TaskProperties } from "./task-properties";
import { SubtaskList } from "./subtask-list";
import { CommentList } from "./comment-list";
import { CommentForm } from "./comment-form";
import { createTask, updateTask, deleteTask } from "@/lib/api/tasks";
import { getComments, createComment, updateComment, deleteComment } from "@/lib/api/comments";

interface TaskDetailModalProps {
  taskId: string | null;
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
}

export function TaskDetailModal({ taskId, projectId, open, onOpenChange, currentUserId }: TaskDetailModalProps) {
  const { currentTask, fetchTask, update, setCurrentTask } = useTaskStore();
  const [comments, setComments] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (taskId && open) {
      fetchTask(projectId, taskId);
      getComments(taskId).then(setComments).catch(() => {});
    }
    return () => setCurrentTask(null);
  }, [taskId, open, projectId, fetchTask, setCurrentTask]);

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description ?? "");
    }
  }, [currentTask]);

  const handleUpdateProperty = useCallback(
    (data: Record<string, any>) => {
      if (!taskId) return;
      update(projectId, taskId, data);
    },
    [taskId, projectId, update]
  );

  const handleTitleBlur = () => {
    if (taskId && title.trim() && title !== currentTask?.title) {
      update(projectId, taskId, { title: title.trim() });
    }
  };

  const handleDescriptionBlur = () => {
    if (taskId && description !== (currentTask?.description ?? "")) {
      update(projectId, taskId, { description: description || null });
    }
  };

  // Comment handlers
  const handleAddComment = async (body: string) => {
    if (!taskId) return;
    const comment = await createComment(taskId, { body });
    setComments((prev) => [...prev, comment]);
  };

  const handleUpdateComment = async (commentId: string, body: string) => {
    if (!taskId) return;
    await updateComment(taskId, commentId, { body });
    setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, content: body } : c)));
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!taskId) return;
    await deleteComment(taskId, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  // Subtask handlers
  const subtasks = (currentTask as any)?.subtasks ?? [];

  const handleAddSubtask = async (subtaskTitle: string) => {
    if (!taskId) return;
    await createTask(projectId, { title: subtaskTitle, parentId: taskId, status: "todo", type: "task", priority: "none", labelIds: [] });
    fetchTask(projectId, taskId);
  };

  const handleToggleSubtask = async (subtaskId: string, done: boolean) => {
    await updateTask(projectId, subtaskId, { status: done ? "done" : "todo" });
    if (taskId) fetchTask(projectId, taskId);
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    await deleteTask(projectId, subtaskId);
    if (taskId) fetchTask(projectId, taskId);
  };

  if (!currentTask && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <div className="flex h-40 items-center justify-center">
            <Spinner className="h-6 w-6" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentTask) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0">
        <div className="flex flex-col md:flex-row">
          {/* Main content */}
          <div className="flex-1 p-6 space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="text-lg font-semibold border-none px-0 focus-visible:ring-0"
              placeholder="Task title"
            />

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              className="min-h-[100px] border-none px-0 focus-visible:ring-0 resize-none"
              placeholder="Add a description..."
            />

            <Separator />

            {/* Subtasks */}
            <SubtaskList
              subtasks={subtasks}
              projectId={projectId}
              parentId={currentTask.id}
              onAdd={handleAddSubtask}
              onToggle={handleToggleSubtask}
              onDelete={handleDeleteSubtask}
            />

            <Separator />

            {/* Comments */}
            <div>
              <h4 className="text-sm font-medium mb-3">Comments</h4>
              <CommentList
                comments={comments}
                currentUserId={currentUserId}
                onUpdate={handleUpdateComment}
                onDelete={handleDeleteComment}
              />
              <div className="mt-4">
                <CommentForm onSubmit={handleAddComment} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-64 border-l bg-muted/30 p-4">
            <TaskProperties task={currentTask} onUpdate={handleUpdateProperty} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
