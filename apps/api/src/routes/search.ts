import { Hono } from "hono";
import type { Env } from "../types";
import { SearchService } from "../services/search";
import { success, error } from "../utils/response";
import { authRequired } from "../middleware/auth";

const searchRouter = new Hono<Env>();

searchRouter.use("/*", authRequired());

// GET /search?q=query&type=tasks|projects|comments&workspaceId=xxx
searchRouter.get("/", async (c) => {
  const q = c.req.query("q");
  const type = c.req.query("type") as "tasks" | "projects" | "comments" | undefined;
  const workspaceId = c.req.query("workspaceId");
  const limit = parseInt(c.req.query("limit") ?? "20", 10);
  const offset = parseInt(c.req.query("offset") ?? "0", 10);

  if (!q || q.trim().length === 0) {
    return error(c, "VALIDATION_ERROR", "Search query is required", 400);
  }

  if (q.trim().length < 2) {
    return error(c, "VALIDATION_ERROR", "Search query must be at least 2 characters", 400);
  }

  const searchService = new SearchService(c.get("db"));
  const result = await searchService.search(q.trim(), {
    workspaceId: workspaceId || undefined,
    type: type || undefined,
    limit,
    offset,
  });

  return success(c, {
    results: result.items,
    total: result.total,
    query: q.trim(),
  });
});

export { searchRouter as searchRoutes };
