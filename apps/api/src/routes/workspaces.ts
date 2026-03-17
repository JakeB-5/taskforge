import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema, inviteMemberSchema } from "@taskforge/shared";
import type { Env } from "../types";
import { WorkspaceService } from "../services/workspace";
import { UserService } from "../services/user";
import { success, notFound, error, forbidden } from "../utils/response";
import { validateBody } from "../middleware/validate";
import { authRequired } from "../middleware/auth";

const workspacesRouter = new Hono<Env>();
workspacesRouter.use("/*", authRequired());

// POST /workspaces
workspacesRouter.post("/", validateBody(createWorkspaceSchema), async (c) => {
  const body = c.get("validatedBody" as any) as any;
  const userId = c.get("userId");
  const svc = new WorkspaceService(c.get("db"));

  if (body.slug) {
    const existing = await svc.findBySlug(body.slug);
    if (existing) {
      return error(c, "SLUG_EXISTS", "A workspace with this slug already exists", 409);
    }
  }

  const workspace = await svc.create(body, userId);
  return success(c, { workspace }, 201);
});

// GET /workspaces
workspacesRouter.get("/", async (c) => {
  const userId = c.get("userId");
  const svc = new WorkspaceService(c.get("db"));
  const workspaces = await svc.listByUser(userId);
  return success(c, { workspaces });
});

// GET /workspaces/:id
workspacesRouter.get("/:id", async (c) => {
  const { id } = c.req.param();
  const svc = new WorkspaceService(c.get("db"));
  const workspace = await svc.findById(id);
  if (!workspace) return notFound(c, "Workspace");
  return success(c, { workspace });
});

// PATCH /workspaces/:id
workspacesRouter.patch("/:id", validateBody(updateWorkspaceSchema), async (c) => {
  const { id } = c.req.param();
  const userId = c.get("userId");
  const body = c.get("validatedBody" as any) as any;
  const svc = new WorkspaceService(c.get("db"));

  const workspace = await svc.findById(id);
  if (!workspace) return notFound(c, "Workspace");

  // Check permission - owner or admin
  const member = await svc.getMember(id, userId);
  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return forbidden(c, "Only workspace owners and admins can update the workspace");
  }

  const updated = await svc.update(id, body);
  return success(c, { workspace: updated });
});

// DELETE /workspaces/:id
workspacesRouter.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const userId = c.get("userId");
  const svc = new WorkspaceService(c.get("db"));

  const workspace = await svc.findById(id);
  if (!workspace) return notFound(c, "Workspace");

  if (workspace.ownerId !== userId) {
    return forbidden(c, "Only the workspace owner can delete it");
  }

  await svc.delete(id);
  return success(c, { message: "Workspace deleted" });
});

// GET /workspaces/:id/members
workspacesRouter.get("/:id/members", async (c) => {
  const { id } = c.req.param();
  const svc = new WorkspaceService(c.get("db"));

  const workspace = await svc.findById(id);
  if (!workspace) return notFound(c, "Workspace");

  const members = await svc.getMembers(id);
  return success(c, { members });
});

// POST /workspaces/:id/members
workspacesRouter.post("/:id/members", validateBody(inviteMemberSchema), async (c) => {
  const { id } = c.req.param();
  const userId = c.get("userId");
  const body = c.get("validatedBody" as any) as { email: string; role: string };
  const svc = new WorkspaceService(c.get("db"));
  const userSvc = new UserService(c.get("db"));

  const workspace = await svc.findById(id);
  if (!workspace) return notFound(c, "Workspace");

  // Check permission
  const currentMember = await svc.getMember(id, userId);
  if (!currentMember || (currentMember.role !== "owner" && currentMember.role !== "admin")) {
    return forbidden(c, "Only workspace owners and admins can invite members");
  }

  const targetUser = await userSvc.findByEmail(body.email);
  if (!targetUser) {
    return error(c, "USER_NOT_FOUND", "No user found with this email", 404);
  }

  const existingMember = await svc.getMember(id, targetUser.id);
  if (existingMember) {
    return error(c, "ALREADY_MEMBER", "User is already a member of this workspace", 409);
  }

  await svc.addMember(id, targetUser.id, body.role);
  const members = await svc.getMembers(id);
  return success(c, { members }, 201);
});

// DELETE /workspaces/:id/members/:userId
workspacesRouter.delete("/:id/members/:userId", async (c) => {
  const { id, userId: targetUserId } = c.req.param();
  const currentUserId = c.get("userId");
  const svc = new WorkspaceService(c.get("db"));

  const workspace = await svc.findById(id);
  if (!workspace) return notFound(c, "Workspace");

  // Can't remove the owner
  if (targetUserId === workspace.ownerId) {
    return error(c, "CANNOT_REMOVE_OWNER", "Cannot remove the workspace owner", 400);
  }

  // Users can remove themselves, admins/owners can remove others
  if (targetUserId !== currentUserId) {
    const currentMember = await svc.getMember(id, currentUserId);
    if (!currentMember || (currentMember.role !== "owner" && currentMember.role !== "admin")) {
      return forbidden(c, "Insufficient permissions");
    }
  }

  await svc.removeMember(id, targetUserId);
  return success(c, { message: "Member removed" });
});

export { workspacesRouter as workspaceRoutes };
