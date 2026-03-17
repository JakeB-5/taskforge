import { Hono } from "hono";
import type { Env } from "../types";
import { ActivityService } from "../services/activity";
import { success, paginated } from "../utils/response";
import { authRequired } from "../middleware/auth";

const activitiesRouter = new Hono<Env>();

activitiesRouter.use("/*", authRequired());

// GET /workspaces/:workspaceId/activities
activitiesRouter.get("/workspaces/:workspaceId/activities", async (c) => {
  const { workspaceId } = c.req.param();
  const projectId = c.req.query("projectId");
  const userId = c.req.query("userId");
  const action = c.req.query("action");
  const limit = parseInt(c.req.query("limit") ?? "50", 10);
  const offset = parseInt(c.req.query("offset") ?? "0", 10);

  const activityService = new ActivityService(c.get("db"));
  const result = await activityService.getByWorkspace(workspaceId, {
    projectId: projectId || undefined,
    userId: userId || undefined,
    action: action || undefined,
    limit,
    offset,
  });

  const page = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(result.total / limit);
  return paginated(c, { activities: result.items }, {
    page,
    perPage: limit,
    total: result.total,
    totalPages,
    hasMore: page < totalPages,
  });
});

// GET /projects/:projectId/activities
activitiesRouter.get("/projects/:projectId/activities", async (c) => {
  const { projectId } = c.req.param();
  const limit = parseInt(c.req.query("limit") ?? "50", 10);
  const offset = parseInt(c.req.query("offset") ?? "0", 10);

  const activityService = new ActivityService(c.get("db"));
  const result = await activityService.getByProject(projectId, { limit, offset });

  const page = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(result.total / limit);
  return paginated(c, { activities: result.items }, {
    page,
    perPage: limit,
    total: result.total,
    totalPages,
    hasMore: page < totalPages,
  });
});

// GET /tasks/:taskId/activities
activitiesRouter.get("/tasks/:taskId/activities", async (c) => {
  const { taskId } = c.req.param();
  const limit = parseInt(c.req.query("limit") ?? "50", 10);
  const offset = parseInt(c.req.query("offset") ?? "0", 10);

  const activityService = new ActivityService(c.get("db"));
  const result = await activityService.getByTask(taskId, { limit, offset });

  const page = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(result.total / limit);
  return paginated(c, { activities: result.items }, {
    page,
    perPage: limit,
    total: result.total,
    totalPages,
    hasMore: page < totalPages,
  });
});

export { activitiesRouter as activityRoutes };
