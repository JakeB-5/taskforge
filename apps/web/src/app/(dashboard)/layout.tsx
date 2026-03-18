"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { Loader2, Building2 } from "lucide-react";
import { Button } from "@taskforge/ui";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { workspaces, fetchWorkspaces, isLoading: wsLoading, create: createWorkspace } = useWorkspaceStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wsName, setWsName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkspaces();
    }
  }, [isAuthenticated, fetchWorkspaces]);

  if (isLoading || (isAuthenticated && wsLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Authenticated but no workspaces - prompt to create one
  if (!wsLoading && workspaces.length === 0) {
    const handleCreate = async () => {
      if (!wsName.trim()) return;
      setCreating(true);
      try {
        await createWorkspace({ name: wsName.trim() });
      } finally {
        setCreating(false);
      }
    };

    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-8 shadow-sm text-center">
          <Building2 className="mx-auto h-10 w-10 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Create your first workspace</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A workspace is where your projects and tasks live.
            </p>
          </div>
          <div className="space-y-3">
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Workspace name"
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              autoFocus
            />
            <Button className="w-full" onClick={handleCreate} disabled={!wsName.trim() || creating}>
              {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Workspace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      <div className="hidden lg:flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Sidebar - mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
