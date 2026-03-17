import { Hono } from "hono";
import { createProjectSchema, updateProjectSchema } from "@taskforge/shared";
import type { Env } from "../types";
import { ProjectService } from "../services/project";
import { WorkspaceService } from "../services/workspace";
import { success, notFound, forbidden } from "../utils/response";
import { validateBody } from "../middleware/validate";
import { authRequired } from "../middleware/auth";

const projectsRouter = new Hono<Env>();
projectsRouter.use("/*", authRequired());

// POST /workspaces/:workspaceId/projects
projectsRouter.post("/workspaces/:workspaceId/projects", validateBody(createProjectSchema), async (c) => {
  const { workspaceId } = c.req.param();
  const userId = c.get("userId");
  const body = c.get("validatedBody" as any) as any;
  const wsSvc = new WorkspaceService(c.get("db"));
  const projSvc = new ProjectService(c.get("db"));

  // Verify workspace membership
  const member = await wsSvc.getMember(workspaceId, userId);
  if (!member) return forbidden(c, "You are not a member of this workspace");

  const project = await projSvc.create(body, workspaceId, userId);
  return success(c, { project }, 201);
});

// GET /workspaces/:workspaceId/projects
projectsRouter.get("/workspaces/:workspaceId/projects", async (c) => {
  const { workspaceId } = c.req.param();
  const projSvc = new ProjectService(c.get("db"));
  const projects = await projSvc.listByWorkspace(workspaceId);
  return success(c, { projects });
});

// GET /projects/:id
projectsRouter.get("/projects/:id", async (c) => {
  const { id } = c.req.param();
  const projSvc = new ProjectService(c.get("db"));
  const project = await projSvc.findByIdWithStats(id);
  if (!project) return notFound(c, "Project");
  return success(c, { project });
});

// PATCH /projects/:id
projectsRouter.patch("/projects/:id", validateBody(updateProjectSchema), async (c) => {
  const { id } = c.req.param();
  const body = c.get("validatedBody" as any) as any;
  const projSvc = new ProjectService(c.get("db"));

  const project = await projSvc.findById(id);
  if (!project) return notFound(c, "Project");

  const updated = await projSvc.update(id, body);
  return success(c, { project: updated });
});

// DELETE /projects/:id
projectsRouter.delete("/projects/:id", async (c) => {
  const { id } = c.req.param();
  const userId = c.get("userId");
  const projSvc = new ProjectService(c.get("db"));

  const project = await projSvc.findById(id);
  if (!project) return notFound(c, "Project");

  if (project.ownerId !== userId) {
    return forbidden(c, "Only the project owner can delete it");
  }

  await projSvc.delete(id);
  return success(c, { message: "Project deleted" });
});

// GET /projects/:id/members
projectsRouter.get("/projects/:id/members", async (c) => {
  const { id } = c.req.param();
  const projSvc = new ProjectService(c.get("db"));

  const project = await projSvc.findById(id);
  if (!project) return notFound(c, "Project");

  const members = await projSvc.getMembers(id);
  return success(c, { members });
});

// POST /projects/:id/members
projectsRouter.post("/projects/:id/members", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const projSvc = new ProjectService(c.get("db"));

  const project = await projSvc.findById(id);
  if (!project) return notFound(c, "Project");

  await projSvc.addMember(id, body.userId, body.role ?? "member");
  const members = await projSvc.getMembers(id);
  return success(c, { members }, 201);
});

export { projectsRouter as projectRoutes };
