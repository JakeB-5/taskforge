import type { Context } from "hono";
import { ZodError } from "zod";

export function errorHandler(err: Error, c: Context) {
  console.error(`[Error] ${err.message}`, err.stack);

  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {};
    for (const issue of err.issues) {
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

  const status = (err as any).status ?? 500;
  const message =
    status === 500 ? "Internal server error" : err.message || "Unknown error";

  return c.json(
    {
      success: false,
      error: { code: "INTERNAL_ERROR", message },
    },
    status
  );
}
