import { Hono } from "hono";
import { createLabelSchema, updateLabelSchema } from "@taskforge/shared";
import type { Env } from "../types";
import { LabelService } from "../services/label";
import { success, notFound } from "../utils/response";
import { validateBody } from "../middleware/validate";
import { authRequired } from "../middleware/auth";

const labelsRouter = new Hono<Env>();
labelsRouter.use("/*", authRequired());

// POST /projects/:projectId/labels
labelsRouter.post("/projects/:projectId/labels", validateBody(createLabelSchema), async (c) => {
  const { projectId } = c.req.param();
  const body = c.get("validatedBody" as any) as any;
  const svc = new LabelService(c.get("db"));

  const label = await svc.create(body, projectId);
  return success(c, { label }, 201);
});

// GET /projects/:projectId/labels
labelsRouter.get("/projects/:projectId/labels", async (c) => {
  const { projectId } = c.req.param();
  const svc = new LabelService(c.get("db"));
  const labels = await svc.listByProject(projectId);
  return success(c, { labels });
});

// PATCH /labels/:id
labelsRouter.patch("/labels/:id", validateBody(updateLabelSchema), async (c) => {
  const { id } = c.req.param();
  const body = c.get("validatedBody" as any) as any;
  const svc = new LabelService(c.get("db"));

  const existing = await svc.findById(id);
  if (!existing) return notFound(c, "Label");

  const label = await svc.update(id, body);
  return success(c, { label });
});

// DELETE /labels/:id
labelsRouter.delete("/labels/:id", async (c) => {
  const { id } = c.req.param();
  const svc = new LabelService(c.get("db"));

  const existing = await svc.findById(id);
  if (!existing) return notFound(c, "Label");

  await svc.delete(id);
  return success(c, { message: "Label deleted" });
});

// POST /tasks/:taskId/labels/:labelId
labelsRouter.post("/tasks/:taskId/labels/:labelId", async (c) => {
  const { taskId, labelId } = c.req.param();
  const svc = new LabelService(c.get("db"));

  try {
    await svc.addToTask(taskId, labelId);
    return success(c, { message: "Label added to task" }, 201);
  } catch (err: any) {
    if (err.message?.includes("UNIQUE constraint")) {
      return success(c, { message: "Label already attached" });
    }
    throw err;
  }
});

// DELETE /tasks/:taskId/labels/:labelId
labelsRouter.delete("/tasks/:taskId/labels/:labelId", async (c) => {
  const { taskId, labelId } = c.req.param();
  const svc = new LabelService(c.get("db"));
  await svc.removeFromTask(taskId, labelId);
  return success(c, { message: "Label removed from task" });
});

export { labelsRouter as labelRoutes };
