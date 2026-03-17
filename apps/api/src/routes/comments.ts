import { Hono } from "hono";
import { createCommentSchema, updateCommentSchema } from "@taskforge/shared";
import type { Env } from "../types";
import { CommentService } from "../services/comment";
import { success, notFound, forbidden } from "../utils/response";
import { validateBody } from "../middleware/validate";
import { authRequired } from "../middleware/auth";

const commentsRouter = new Hono<Env>();
commentsRouter.use("/*", authRequired());

// POST /tasks/:taskId/comments
commentsRouter.post("/tasks/:taskId/comments", validateBody(createCommentSchema), async (c) => {
  const { taskId } = c.req.param();
  const userId = c.get("userId");
  const body = c.get("validatedBody" as any) as { body: string };
  const svc = new CommentService(c.get("db"));

  const comment = await svc.create(taskId, userId, body.body);
  return success(c, { comment }, 201);
});

// GET /tasks/:taskId/comments
commentsRouter.get("/tasks/:taskId/comments", async (c) => {
  const { taskId } = c.req.param();
  const svc = new CommentService(c.get("db"));
  const comments = await svc.listByTask(taskId);
  return success(c, { comments });
});

// PATCH /comments/:id
commentsRouter.patch("/comments/:id", validateBody(updateCommentSchema), async (c) => {
  const { id } = c.req.param();
  const userId = c.get("userId");
  const body = c.get("validatedBody" as any) as { body: string };
  const svc = new CommentService(c.get("db"));

  const existing = await svc.findById(id);
  if (!existing) return notFound(c, "Comment");

  if (existing.authorId !== userId) {
    return forbidden(c, "You can only edit your own comments");
  }

  const comment = await svc.update(id, body.body);
  return success(c, { comment });
});

// DELETE /comments/:id
commentsRouter.delete("/comments/:id", async (c) => {
  const { id } = c.req.param();
  const userId = c.get("userId");
  const svc = new CommentService(c.get("db"));

  const existing = await svc.findById(id);
  if (!existing) return notFound(c, "Comment");

  if (existing.authorId !== userId) {
    return forbidden(c, "You can only delete your own comments");
  }

  await svc.delete(id);
  return success(c, { message: "Comment deleted" });
});

export { commentsRouter as commentRoutes };
