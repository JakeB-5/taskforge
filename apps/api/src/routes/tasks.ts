import { Hono } from "hono";
import { createTaskSchema, updateTaskSchema, moveTaskSchema, filterTasksSchema } from "@taskforge/shared";
import type { Env } from "../types";
import { TaskService } from "../services/task";
import { success, notFound, paginated, error } from "../utils/response";
import { validateBody } from "../middleware/validate";
import { authRequired } from "../middleware/auth";

const tasksRouter = new Hono<Env>();
tasksRouter.use("/*", authRequired());

// POST /projects/:projectId/tasks
tasksRouter.post("/projects/:projectId/tasks", validateBody(createTaskSchema), async (c) => {
  const { projectId } = c.req.param();
  const userId = c.get("userId");
  const body = c.get("validatedBody" as any) as any;
  const svc = new TaskService(c.get("db"));

  const task = await svc.create(body, projectId, userId);
  return success(c, { task }, 201);
});

// GET /projects/:projectId/tasks
tasksRouter.get("/projects/:projectId/tasks", async (c) => {
  const { projectId } = c.req.param();
  const query = c.req.query();
  const svc = new TaskService(c.get("db"));

  // Parse filter params
  const filters: any = {
    page: query.page ? parseInt(query.page, 10) : undefined,
    perPage: query.perPage ? parseInt(query.perPage, 10) : undefined,
    sortBy: query.sortBy,
    sortDirection: query.sortDirection,
    search: query.search,
    assigneeId: query.assigneeId,
    dueBefore: query.dueBefore,
    dueAfter: query.dueAfter,
  };

  // Parse array params
  if (query.status) filters.status = query.status.split(",");
  if (query.priority) filters.priority = query.priority.split(",");
  if (query.type) filters.type = query.type.split(",");
  if (query.labelIds) filters.labelIds = query.labelIds.split(",");

  const parsed = filterTasksSchema.safeParse(filters);
  const validFilters = parsed.success ? parsed.data : filters;

  const result = await svc.list(projectId, validFilters);
  return paginated(c, { tasks: result.data }, result.pagination);
});

// GET /tasks/:id
tasksRouter.get("/tasks/:id", async (c) => {
  const { id } = c.req.param();
  const svc = new TaskService(c.get("db"));

  const task = await svc.findById(id);
  if (!task) return notFound(c, "Task");
  return success(c, { task });
});

// PATCH /tasks/:id
tasksRouter.patch("/tasks/:id", validateBody(updateTaskSchema), async (c) => {
  const { id } = c.req.param();
  const body = c.get("validatedBody" as any) as any;
  const svc = new TaskService(c.get("db"));

  const existing = await svc.findById(id);
  if (!existing) return notFound(c, "Task");

  const task = await svc.update(id, body);
  return success(c, { task });
});

// DELETE /tasks/:id
tasksRouter.delete("/tasks/:id", async (c) => {
  const { id } = c.req.param();
  const svc = new TaskService(c.get("db"));

  const existing = await svc.findById(id);
  if (!existing) return notFound(c, "Task");

  await svc.delete(id);
  return success(c, { message: "Task deleted" });
});

// POST /tasks/:id/subtasks
tasksRouter.post("/tasks/:id/subtasks", validateBody(createTaskSchema), async (c) => {
  const { id } = c.req.param();
  const userId = c.get("userId");
  const body = c.get("validatedBody" as any) as any;
  const svc = new TaskService(c.get("db"));

  const task = await svc.createSubtask(id, body, userId);
  if (!task) return notFound(c, "Parent task");
  return success(c, { task }, 201);
});

// PATCH /tasks/:id/position
tasksRouter.patch("/tasks/:id/position", validateBody(moveTaskSchema), async (c) => {
  const { id } = c.req.param();
  const body = c.get("validatedBody" as any) as any;
  const svc = new TaskService(c.get("db"));

  const existing = await svc.findById(id);
  if (!existing) return notFound(c, "Task");

  const task = await svc.updatePosition(id, body);
  return success(c, { task });
});

// PATCH /tasks/bulk
tasksRouter.patch("/tasks/bulk", async (c) => {
  const body = await c.req.json();
  const svc = new TaskService(c.get("db"));

  if (!body.taskIds?.length) {
    return error(c, "VALIDATION_ERROR", "taskIds is required and must not be empty", 400);
  }

  const { taskIds, ...updateData } = body;
  await svc.bulkUpdate(taskIds, updateData);
  return success(c, { message: `${taskIds.length} tasks updated` });
});

export { tasksRouter as taskRoutes };
