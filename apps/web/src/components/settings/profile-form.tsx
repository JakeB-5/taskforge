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
} from "@taskforge/ui";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api-client";

export function ProfileForm() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = React.useState(user?.name ?? "");
  const [email, setEmail] = React.useState(user?.email ?? "");
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage("");
    try {
      const updated = await apiClient.patch<any>(`/users/${user.id}`, {
        name,
        email,
      });
      if (updated?.user) {
        setUser(updated.user);
      }
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
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
