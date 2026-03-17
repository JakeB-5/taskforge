"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@taskforge/ui";
import { Trash2 } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { useAuthStore } from "@/stores/auth-store";

export function DangerZone() {
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);
  const removeWorkspace = useWorkspaceStore((s) => s.remove);
  const logout = useAuthStore((s) => s.logout);

  const handleDeleteWorkspace = async () => {
    if (!activeWorkspace) return;
    await removeWorkspace(activeWorkspace.id);
  };

  const handleDeleteAccount = async () => {
    logout();
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Irreversible actions. Please be careful.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
          <div>
            <p className="text-sm font-medium">Delete Workspace</p>
            <p className="text-xs text-muted-foreground">
              Permanently delete this workspace and all its data.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Workspace
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All projects, tasks, and data in
                  &quot;{activeWorkspace?.name}&quot; will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteWorkspace}>
                  Delete Workspace
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
          <div>
            <p className="text-sm font-medium">Delete Account</p>
            <p className="text-xs text-muted-foreground">
              Permanently delete your account and sign out.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Your account and all associated
                  data will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
