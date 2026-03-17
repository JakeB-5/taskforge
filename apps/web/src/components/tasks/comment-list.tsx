"use client";

import { useState } from "react";
import type { Comment } from "@taskforge/shared";
import { Avatar, AvatarFallback } from "@taskforge/ui";
import { Button } from "@taskforge/ui";
import { Textarea } from "@taskforge/ui";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { format } from "date-fns";

interface CommentListProps {
  comments: Comment[];
  currentUserId: string;
  onUpdate: (commentId: string, body: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export function CommentList({ comments, currentUserId, onUpdate, onDelete }: CommentListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditBody((comment as any).content ?? "");
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editBody.trim()) return;
    await onUpdate(editingId, editBody.trim());
    setEditingId(null);
    setEditBody("");
  };

  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground">No comments yet.</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const author = (comment as any).author;
        const isOwn = (comment as any).authorId === currentUserId;
        const content = (comment as any).content ?? "";

        return (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-7 w-7 mt-0.5">
              <AvatarFallback className="text-[9px]">
                {(author?.name ?? "?").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{author?.name ?? "Unknown"}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                </span>
              </div>

              {editingId === comment.id ? (
                <div className="mt-1 space-y-2">
                  <Textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    className="text-sm min-h-[60px]"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button size="sm" className="h-7" onClick={handleSaveEdit}>
                      <Check className="mr-1 h-3 w-3" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7" onClick={() => setEditingId(null)}>
                      <X className="mr-1 h-3 w-3" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm mt-0.5 whitespace-pre-wrap">{content}</p>
              )}

              {isOwn && editingId !== comment.id && (
                <div className="flex gap-1 mt-1">
                  <Button variant="ghost" size="sm" className="h-6 px-1.5 text-muted-foreground" onClick={() => startEdit(comment)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 px-1.5 text-muted-foreground" onClick={() => onDelete(comment.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
