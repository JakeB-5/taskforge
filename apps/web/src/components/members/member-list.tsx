"use client";

import * as React from "react";
import type { WorkspaceMember } from "@taskforge/shared";
import { Spinner, EmptyState } from "@taskforge/ui";
import { Users } from "lucide-react";
import { MemberCard } from "./member-card";
import { InviteMemberDialog } from "./invite-member-dialog";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { useAuthStore } from "@/stores/auth-store";
import {
  getWorkspaceMembers,
  inviteMember,
  updateMemberRole,
  removeMember,
} from "@/lib/api/workspaces";

export function MemberList() {
  const [members, setMembers] = React.useState<WorkspaceMember[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);
  const user = useAuthStore((s) => s.user);

  const fetchMembers = React.useCallback(async () => {
    if (!activeWorkspace) return;
    setIsLoading(true);
    try {
      const data = await getWorkspaceMembers(activeWorkspace.id);
      setMembers(Array.isArray(data) ? data : []);
    } catch {
      // Silently handle error
    } finally {
      setIsLoading(false);
    }
  }, [activeWorkspace]);

  React.useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const isOwner = activeWorkspace?.ownerId === user?.id;

  const handleInvite = async (email: string, role: string) => {
    if (!activeWorkspace) return;
    await inviteMember(activeWorkspace.id, { email, role } as any);
    await fetchMembers();
  };

  const handleChangeRole = async (memberId: string, role: string) => {
    if (!activeWorkspace) return;
    await updateMemberRole(activeWorkspace.id, memberId, { role } as any);
    await fetchMembers();
  };

  const handleRemove = async (memberId: string) => {
    if (!activeWorkspace) return;
    await removeMember(activeWorkspace.id, memberId);
    await fetchMembers();
  };

  if (isLoading) {
    return <Spinner className="py-12" />;
  }

  if (members.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6 text-muted-foreground" />}
        title="No members"
        description="Invite team members to collaborate on projects."
        action={<InviteMemberDialog onInvite={handleInvite} />}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {members.length} member{members.length !== 1 ? "s" : ""}
        </p>
        {isOwner && <InviteMemberDialog onInvite={handleInvite} />}
      </div>
      <div className="space-y-2">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member as any}
            currentUserId={user?.id ?? ""}
            isOwner={isOwner}
            onChangeRole={handleChangeRole}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}
