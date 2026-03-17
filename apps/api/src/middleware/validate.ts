import type { Context, Next } from "hono";
import type { ZodSchema } from "zod";

export function validateBody(schema: ZodSchema) {
  return async (c: Context, next: Next) => {
    const body = await c.req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const details: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".") || "_root";
        if (!details[path]) details[path] = [];
        details[path].push(issue.message);
      }
      return c.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details,
          },
        },
        400
      );
    }
    c.set("validatedBody" as any, result.data);
    return next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (c: Context, next: Next) => {
    const query = c.req.query();
    const result = schema.safeParse(query);
    if (!result.success) {
      const details: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".") || "_root";
        if (!details[path]) details[path] = [];
        details[path].push(issue.message);
      }
      return c.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details,
          },
        },
        400
      );
    }
    c.set("validatedQuery" as any, result.data);
    return next();
  };
}
