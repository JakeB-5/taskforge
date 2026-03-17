"use client";

import { useState } from "react";
import { Button } from "@taskforge/ui";
import { Textarea } from "@taskforge/ui";
import { Send } from "lucide-react";

interface CommentFormProps {
  onSubmit: (body: string) => Promise<void>;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    setIsSubmitting(true);
    try {
      await onSubmit(trimmed);
      setBody("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment..."
        className="min-h-[80px] text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
        }}
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSubmit} disabled={!body.trim() || isSubmitting}>
          <Send className="mr-1 h-3.5 w-3.5" />
          Comment
        </Button>
      </div>
    </div>
  );
}
