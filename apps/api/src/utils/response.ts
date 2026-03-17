import type { Context } from "hono";
import type { Pagination } from "@taskforge/shared";

export function success<T>(c: Context, data: T, status: number = 200) {
  return c.json({ success: true, data }, status as any);
}

export function paginated<T>(c: Context, data: T, pagination: Pagination) {
  return c.json({ success: true, data, pagination }, 200);
}

export function error(
  c: Context,
  code: string,
  message: string,
  status: number = 400,
  details?: Record<string, string[]>
) {
  return c.json(
    {
      success: false,
      error: { code, message, ...(details ? { details } : {}) },
    },
    status as any
  );
}

export function notFound(c: Context, resource: string = "Resource") {
  return error(c, "NOT_FOUND", `${resource} not found`, 404);
}

export function unauthorized(c: Context, message: string = "Unauthorized") {
  return error(c, "UNAUTHORIZED", message, 401);
}

export function forbidden(c: Context, message: string = "Forbidden") {
  return error(c, "FORBIDDEN", message, 403);
}

export function validationError(c: Context, details: Record<string, string[]>) {
  return error(c, "VALIDATION_ERROR", "Validation failed", 400, details);
}
