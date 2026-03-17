"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
} from "@taskforge/ui";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function WorkspaceForm() {
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);
  const updateWorkspace = useWorkspaceStore((s) => s.update);
  const [name, setName] = React.useState(activeWorkspace?.name ?? "");
  const [description, setDescription] = React.useState(activeWorkspace?.description ?? "");
  const [slug, setSlug] = React.useState(activeWorkspace?.slug ?? "");
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (activeWorkspace) {
      setName(activeWorkspace.name);
      setDescription(activeWorkspace.description ?? "");
      setSlug(activeWorkspace.slug);
    }
  }, [activeWorkspace]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace) return;

    setIsSaving(true);
    setMessage("");
    try {
      await updateWorkspace(activeWorkspace.id, { name, description, slug });
      setMessage("Workspace updated successfully.");
    } catch {
      setMessage("Failed to update workspace.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace Settings</CardTitle>
        <CardDescription>Update your workspace information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ws-name">Workspace Name</Label>
            <Input
              id="ws-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Workspace"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ws-slug">Slug</Label>
            <Input
              id="ws-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-workspace"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ws-desc">Description</Label>
            <Textarea
              id="ws-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your workspace..."
              rows={3}
            />
          </div>
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
