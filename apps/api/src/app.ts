import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { getDatabase } from "@taskforge/database";
import type { Env } from "./types";
import { errorHandler } from "./middleware/error-handler";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/users";
import { workspaceRoutes } from "./routes/workspaces";
import { projectRoutes } from "./routes/projects";
import { taskRoutes } from "./routes/tasks";
import { commentRoutes } from "./routes/comments";
import { labelRoutes } from "./routes/labels";
import { activityRoutes } from "./routes/activities";
import { notificationRoutes } from "./routes/notifications";
import { searchRoutes } from "./routes/search";
import { attachmentRoutes } from "./routes/attachments";
import { dashboardRoutes } from "./routes/dashboard";
import { config } from "./utils/config";

export function createApp() {
  const app = new Hono<Env>().basePath("/api");

  // Global middleware
  app.use("*", logger());
  app.use(
    "*",
    cors({
      origin: config().corsOrigin,
      allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: [
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset",
      ],
      credentials: true,
    })
  );

  // Inject database into context
  app.use("*", async (c, next) => {
    c.set("db", getDatabase());
    return next();
  });

  // Health check
  app.get("/health", (c) =>
    c.json({ status: "ok", timestamp: new Date().toISOString() })
  );

  // Routes
  app.route("/auth", authRoutes);
  app.route("/users", userRoutes);
  app.route("/", workspaceRoutes);
  app.route("/", projectRoutes);
  app.route("/", taskRoutes);
  app.route("/", commentRoutes);
  app.route("/", labelRoutes);
  app.route("/", activityRoutes);
  app.route("/notifications", notificationRoutes);
  app.route("/search", searchRoutes);
  app.route("/", attachmentRoutes);
  app.route("/", dashboardRoutes);

  // Error handler
  app.onError(errorHandler);

  // 404 handler
  app.notFound((c) =>
    c.json(
      {
        success: false,
        error: { code: "NOT_FOUND", message: "Route not found" },
      },
      404
    )
  );

  return app;
}
