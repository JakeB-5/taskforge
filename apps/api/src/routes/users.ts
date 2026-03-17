import { Hono } from "hono";
import { updateUserSchema, updateProfileSchema } from "@taskforge/shared";
import type { Env } from "../types";
import { UserService } from "../services/user";
import { success, notFound, forbidden } from "../utils/response";
import { validateBody } from "../middleware/validate";
import { authRequired } from "../middleware/auth";

const usersRouter = new Hono<Env>();

// All user routes require auth
usersRouter.use("/*", authRequired());

// GET /users?workspaceId=xxx
usersRouter.get("/", async (c) => {
  const workspaceId = c.req.query("workspaceId");
  const userService = new UserService(c.get("db"));

  if (workspaceId) {
    const users = await userService.listByWorkspace(workspaceId);
    return success(c, { users });
  }

  // Without workspaceId, return current user only
  const user = await userService.findById(c.get("userId"));
  return success(c, { users: user ? [user] : [] });
});

// GET /users/:id
usersRouter.get("/:id", async (c) => {
  const { id } = c.req.param();
  const userService = new UserService(c.get("db"));

  const user = await userService.findByIdWithProfile(id);
  if (!user) {
    return notFound(c, "User");
  }

  return success(c, { user });
});

// PATCH /users/:id
usersRouter.patch("/:id", validateBody(updateUserSchema), async (c) => {
  const { id } = c.req.param();
  const currentUserId = c.get("userId");
  const currentRole = c.get("userRole");

  // Users can only update themselves unless admin
  if (id !== currentUserId && currentRole !== "admin" && currentRole !== "owner") {
    return forbidden(c, "You can only update your own profile");
  }

  const body = c.get("validatedBody" as any) as Record<string, any>;
  const userService = new UserService(c.get("db"));

  const existing = await userService.findById(id);
  if (!existing) {
    return notFound(c, "User");
  }

  const user = await userService.update(id, body);
  return success(c, { user });
});

// PATCH /users/:id/profile
usersRouter.patch("/:id/profile", validateBody(updateProfileSchema), async (c) => {
  const { id } = c.req.param();
  const currentUserId = c.get("userId");

  if (id !== currentUserId) {
    return forbidden(c, "You can only update your own profile");
  }

  const body = c.get("validatedBody" as any) as Record<string, any>;
  const userService = new UserService(c.get("db"));

  const user = await userService.updateProfile(id, body);
  if (!user) {
    return notFound(c, "User");
  }

  return success(c, { user });
});

// DELETE /users/:id
usersRouter.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const currentUserId = c.get("userId");
  const currentRole = c.get("userRole");

  if (id !== currentUserId && currentRole !== "admin" && currentRole !== "owner") {
    return forbidden(c, "Insufficient permissions");
  }

  const userService = new UserService(c.get("db"));

  const existing = await userService.findById(id);
  if (!existing) {
    return notFound(c, "User");
  }

  await userService.softDelete(id);
  return success(c, { message: "User deactivated" });
});

export { usersRouter as userRoutes };
