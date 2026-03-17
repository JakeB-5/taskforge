import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { z } from "zod";
import { validateBody, validateQuery } from "../../../src/middleware/validate";

const testSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
});

const querySchema = z.object({
  page: z.string().optional(),
  search: z.string().optional(),
});

function createTestApp() {
  const app = new Hono();

  app.post("/validate-body", validateBody(testSchema), (c) => {
    return c.json({ success: true, data: c.get("validatedBody" as any) });
  });

  app.get("/validate-query", validateQuery(querySchema), (c) => {
    return c.json({ success: true, data: c.get("validatedQuery" as any) });
  });

  return app;
}

describe("validateBody middleware", () => {
  const app = createTestApp();

  it("passes valid body data", async () => {
    const res = await app.request("/validate-body", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "John", email: "john@example.com" }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.name).toBe("John");
    expect(body.data.email).toBe("john@example.com");
  });

  it("rejects invalid body with validation errors", async () => {
    const res = await app.request("/validate-body", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "J", email: "not-email" }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details).toBeDefined();
  });

  it("returns field-specific error messages", async () => {
    const res = await app.request("/validate-body", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "J", email: "not-email" }),
    });

    const body = await res.json();
    expect(body.error.details.name).toBeDefined();
    expect(body.error.details.email).toBeDefined();
  });

  it("rejects missing required fields", async () => {
    const res = await app.request("/validate-body", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("rejects empty body", async () => {
    const res = await app.request("/validate-body", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(null),
    });

    expect(res.status).toBe(400);
  });
});

describe("validateQuery middleware", () => {
  const app = createTestApp();

  it("passes valid query params", async () => {
    const res = await app.request("/validate-query?page=1&search=test");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.page).toBe("1");
    expect(body.data.search).toBe("test");
  });

  it("passes with empty query", async () => {
    const res = await app.request("/validate-query");
    expect(res.status).toBe(200);
  });

  it("passes with partial query", async () => {
    const res = await app.request("/validate-query?page=2");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.page).toBe("2");
  });
});
