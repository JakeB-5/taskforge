"use client";

import type { WorkspaceMember } from "@taskforge/shared";
import { Avatar, AvatarFallback, Badge, Button } from "@taskforge/ui";
import { MoreHorizontal, Shield, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@taskforge/ui";

interface MemberCardProps {
  member: WorkspaceMember & { user?: { name: string; email: string; avatarUrl?: string | null } };
  currentUserId: string;
  isOwner: boolean;
  onChangeRole: (memberId: string, role: string) => void;
  onRemove: (memberId: string) => void;
}

const ROLE_COLORS: Record<string, "default" | "secondary" | "outline"> = {
  owner: "default",
  admin: "secondary",
  member: "outline",
  guest: "outline",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function MemberCard({
  member,
  currentUserId,
  isOwner,
  onChangeRole,
  onRemove,
}: MemberCardProps) {
  const user = member.user;
  const name = user?.name ?? "Unknown";
  const email = user?.email ?? "";
  const isSelf = member.userId === currentUserId;
  const canManage = isOwner && !isSelf && member.role !== "owner";

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{name}</p>
            {isSelf && (
              <span className="text-xs text-muted-foreground">(you)</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={ROLE_COLORS[member.role] ?? "outline"}>
          {member.role}
        </Badge>
        {member.joinedAt && (
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Joined {new Date(member.joinedAt).toLocaleDateString()}
          </span>
        )}
        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onChangeRole(member.userId, "admin")}>
                <Shield className="mr-2 h-4 w-4" />
                Make Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeRole(member.userId, "member")}>
                <Shield className="mr-2 h-4 w-4" />
                Make Member
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onRemove(member.userId)}
              >
                <UserMinus className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
