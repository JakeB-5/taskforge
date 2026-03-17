import { Hono } from "hono";
import type { Env } from "../types";
import { AttachmentService } from "../services/attachment";
import { ActivityService } from "../services/activity";
import { success, notFound, error } from "../utils/response";
import { authRequired } from "../middleware/auth";

const attachmentsRouter = new Hono<Env>();

attachmentsRouter.use("/*", authRequired());

// POST /tasks/:taskId/attachments
attachmentsRouter.post("/tasks/:taskId/attachments", async (c) => {
  const { taskId } = c.req.param();
  const userId = c.get("userId");
  const body = await c.req.json();

  if (!body.fileName || !body.fileUrl || !body.fileSize || !body.mimeType) {
    return error(
      c,
      "VALIDATION_ERROR",
      "fileName, fileUrl, fileSize, and mimeType are required",
      400
    );
  }

  const attachmentService = new AttachmentService(c.get("db"));
  const attachment = await attachmentService.create({
    taskId,
    uploaderId: userId,
    fileName: body.fileName,
    fileUrl: body.fileUrl,
    fileSize: body.fileSize,
    mimeType: body.mimeType,
  });

  // Log activity
  const activityService = new ActivityService(c.get("db"));
  await activityService.logActivity({
    workspaceId: body.workspaceId ?? "",
    taskId,
    userId,
    action: "attachment_added",
    entityType: "task",
    entityId: taskId,
    metadata: { fileName: body.fileName },
  });

  return success(c, { attachment }, 201);
});

// GET /tasks/:taskId/attachments
attachmentsRouter.get("/tasks/:taskId/attachments", async (c) => {
  const { taskId } = c.req.param();

  const attachmentService = new AttachmentService(c.get("db"));
  const items = await attachmentService.listByTask(taskId);

  return success(c, { attachments: items });
});

// DELETE /attachments/:id
attachmentsRouter.delete("/attachments/:id", async (c) => {
  const { id } = c.req.param();
  const userId = c.get("userId");

  const attachmentService = new AttachmentService(c.get("db"));
  const attachment = await attachmentService.getById(id);
  if (!attachment) {
    return notFound(c, "Attachment");
  }

  await attachmentService.delete(id);

  // Log activity
  const activityService = new ActivityService(c.get("db"));
  await activityService.logActivity({
    workspaceId: "",
    taskId: attachment.taskId,
    userId,
    action: "attachment_removed",
    entityType: "task",
    entityId: attachment.taskId,
    metadata: { fileName: attachment.fileName },
  });

  return success(c, { message: "Attachment deleted" });
});

export { attachmentsRouter as attachmentRoutes };
