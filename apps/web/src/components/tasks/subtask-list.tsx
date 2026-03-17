"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@taskforge/ui";
import { Input } from "@taskforge/ui";
import { Button } from "@taskforge/ui";
import { Progress } from "@taskforge/ui";

interface Subtask {
  id: string;
  title: string;
  status: string;
}

interface SubtaskListProps {
  subtasks: Subtask[];
  projectId: string;
  parentId: string;
  onAdd: (title: string) => Promise<void>;
  onToggle: (subtaskId: string, done: boolean) => Promise<void>;
  onDelete: (subtaskId: string) => Promise<void>;
}

export function SubtaskList({ subtasks, onAdd, onToggle, onDelete }: SubtaskListProps) {
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const completed = subtasks.filter((s) => s.status === "done").length;
  const progress = subtasks.length > 0 ? (completed / subtasks.length) * 100 : 0;

  const handleAdd = async () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    await onAdd(trimmed);
    setNewTitle("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Subtasks</h4>
        <span className="text-xs text-muted-foreground">{completed}/{subtasks.length}</span>
      </div>

      {subtasks.length > 0 && <Progress value={progress} className="h-1.5 mb-3" />}

      <div className="space-y-1">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-2 group">
            <Checkbox
              checked={subtask.status === "done"}
              onCheckedChange={(checked) => onToggle(subtask.id, !!checked)}
            />
            <span className={`flex-1 text-sm ${subtask.status === "done" ? "line-through text-muted-foreground" : ""}`}>
              {subtask.title}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={() => onDelete(subtask.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="mt-2 flex gap-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Subtask title..."
            className="text-sm h-8"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") { setIsAdding(false); setNewTitle(""); }
            }}
            autoFocus
          />
          <Button size="sm" className="h-8" onClick={handleAdd}>Add</Button>
        </div>
      ) : (
        <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground" onClick={() => setIsAdding(true)}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add subtask
        </Button>
      )}
    </div>
  );
}
