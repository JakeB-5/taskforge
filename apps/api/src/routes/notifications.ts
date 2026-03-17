import { Hono } from "hono";
import type { Env } from "../types";
import { NotificationService } from "../services/notification";
import { success, notFound } from "../utils/response";
import { authRequired } from "../middleware/auth";

const notificationsRouter = new Hono<Env>();

notificationsRouter.use("/*", authRequired());

// GET /notifications
notificationsRouter.get("/", async (c) => {
  const userId = c.get("userId");
  const limit = parseInt(c.req.query("limit") ?? "50", 10);
  const offset = parseInt(c.req.query("offset") ?? "0", 10);

  const notificationService = new NotificationService(c.get("db"));
  const result = await notificationService.listByUser(userId, { limit, offset });

  return success(c, {
    notifications: result.items,
    total: result.total,
    unreadCount: result.unreadCount,
  });
});

// PATCH /notifications/:id/read
notificationsRouter.patch("/:id/read", async (c) => {
  const { id } = c.req.param();
  const userId = c.get("userId");

  const notificationService = new NotificationService(c.get("db"));

  const notification = await notificationService.getById(id);
  if (!notification) {
    return notFound(c, "Notification");
  }

  await notificationService.markAsRead(id, userId);
  return success(c, { message: "Notification marked as read" });
});

// PATCH /notifications/read-all
notificationsRouter.patch("/read-all", async (c) => {
  const userId = c.get("userId");

  const notificationService = new NotificationService(c.get("db"));
  await notificationService.markAllAsRead(userId);

  return success(c, { message: "All notifications marked as read" });
});

// DELETE /notifications/:id
notificationsRouter.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const userId = c.get("userId");

  const notificationService = new NotificationService(c.get("db"));

  const notification = await notificationService.getById(id);
  if (!notification) {
    return notFound(c, "Notification");
  }

  await notificationService.delete(id, userId);
  return success(c, { message: "Notification deleted" });
});

export { notificationsRouter as notificationRoutes };
