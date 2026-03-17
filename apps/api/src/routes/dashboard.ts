import { Hono } from "hono";
import type { Env } from "../types";
import { DashboardService } from "../services/dashboard";
import { success } from "../utils/response";
import { authRequired } from "../middleware/auth";

const dashboardRouter = new Hono<Env>();

dashboardRouter.use("/*", authRequired());

// GET /workspaces/:workspaceId/dashboard
dashboardRouter.get("/workspaces/:workspaceId/dashboard", async (c) => {
  const { workspaceId } = c.req.param();

  const dashboardService = new DashboardService(c.get("db"));
  const stats = await dashboardService.getWorkspaceDashboard(workspaceId);

  return success(c, { dashboard: stats });
});

export { dashboardRouter as dashboardRoutes };
