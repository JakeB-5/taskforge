import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { authRequired, optionalAuth } from "../../../src/middleware/auth";
import { AuthService } from "../../../src/services/auth";
import type { Env } from "../../../src/types";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-key-for-testing-only";
  process.env.BCRYPT_ROUNDS = "4";
});

function createTestApp() {
  const app = new Hono<Env>();

  app.get("/protected", authRequired(), (c) => {
    return c.json({
      userId: c.get("userId"),
      userEmail: c.get("userEmail"),
      userRole: c.get("userRole"),
    });
  });

  app.get("/optional", optionalAuth(), (c) => {
    return c.json({
      userId: c.get("userId") || null,
    });
  });

  return app;
}

describe("authRequired middleware", () => {
  const app = createTestApp();

  it("allows request with valid token", async () => {
    const token = AuthService.generateToken({
      userId: "usr_123",
      email: "test@example.com",
      role: "member",
    });

    const res = await app.request("/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userId).toBe("usr_123");
    expect(body.userEmail).toBe("test@example.com");
    expect(body.userRole).toBe("member");
  });

  it("rejects request without token", async () => {
    const res = await app.request("/protected");
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects request with invalid token", async () => {
    const res = await app.request("/protected", {
      headers: { Authorization: "Bearer invalid-token" },
    });
    expect(res.status).toBe(401);
  });

  it("rejects request with wrong scheme", async () => {
    const token = AuthService.generateToken({
      userId: "usr_123",
      email: "test@example.com",
      role: "member",
    });

    const res = await app.request("/protected", {
      headers: { Authorization: `Basic ${token}` },
    });
    expect(res.status).toBe(401);
  });

  it("rejects request with empty Authorization header", async () => {
    const res = await app.request("/protected", {
      headers: { Authorization: "" },
    });
    expect(res.status).toBe(401);
  });
});

describe("optionalAuth middleware", () => {
  const app = createTestApp();

  it("sets user data with valid token", async () => {
    const token = AuthService.generateToken({
      userId: "usr_123",
      email: "test@example.com",
      role: "member",
    });

    const res = await app.request("/optional", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userId).toBe("usr_123");
  });

  it("allows request without token", async () => {
    const res = await app.request("/optional");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userId).toBe(null);
  });

  it("allows request with invalid token (ignores it)", async () => {
    const res = await app.request("/optional", {
      headers: { Authorization: "Bearer invalid-token" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userId).toBe(null);
  });
});
