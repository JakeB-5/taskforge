import type { Context, Next } from "hono";
import { AuthService } from "../services/auth";
import { unauthorized } from "../utils/response";
import type { Env } from "../types";

function extractToken(c: Context): string | null {
  const header = c.req.header("Authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

export function authRequired() {
  return async (c: Context<Env>, next: Next) => {
    const token = extractToken(c);
    if (!token) {
      return unauthorized(c, "Authentication required");
    }

    try {
      const payload = AuthService.verifyToken(token);
      c.set("userId", payload.userId);
      c.set("userEmail", payload.email);
      c.set("userRole", payload.role);
      return next();
    } catch {
      return unauthorized(c, "Invalid or expired token");
    }
  };
}

export function optionalAuth() {
  return async (c: Context<Env>, next: Next) => {
    const token = extractToken(c);
    if (token) {
      try {
        const payload = AuthService.verifyToken(token);
        c.set("userId", payload.userId);
        c.set("userEmail", payload.email);
        c.set("userRole", payload.role);
      } catch {
        // Ignore invalid tokens in optional auth
      }
    }
    return next();
  };
}
