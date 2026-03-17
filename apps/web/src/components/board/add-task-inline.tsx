"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@taskforge/ui";
import { Input } from "@taskforge/ui";
import { useTaskStore } from "@/stores/task-store";

interface AddTaskInlineProps {
  projectId: string;
  status: string;
}

export function AddTaskInline({ projectId, status }: AddTaskInlineProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const create = useTaskStore((s) => s.create);

  const handleSubmit = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setIsAdding(false);
      return;
    }

    try {
      await create(projectId, { title: trimmed, status: status as any, type: "task", priority: "none", labelIds: [] });
      setTitle("");
      inputRef.current?.focus();
    } catch {
      // Error handled by store
    }
  };

  if (!isAdding) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground"
        onClick={() => {
          setIsAdding(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add task
      </Button>
    );
  }

  return (
    <div className="p-1">
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className="text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") {
            setIsAdding(false);
            setTitle("");
          }
        }}
        onBlur={handleSubmit}
      />
    </div>
  );
}
