import { Hono } from "hono";
import { loginSchema, registerSchema, forgotPasswordSchema } from "@taskforge/shared";
import type { Env } from "../types";
import { AuthService } from "../services/auth";
import { UserService } from "../services/user";
import { success, error, unauthorized } from "../utils/response";
import { validateBody } from "../middleware/validate";
import { authRequired } from "../middleware/auth";
import { rateLimit } from "../middleware/rate-limit";
import { RATE_LIMIT_AUTH_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from "@taskforge/shared";

const auth = new Hono<Env>();

// Rate limit auth endpoints more strictly
auth.use("/*", rateLimit(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_AUTH_MAX_REQUESTS));

// POST /auth/register
auth.post("/register", validateBody(registerSchema), async (c) => {
  const body = c.get("validatedBody" as any) as { name: string; email: string; password: string };
  const userService = new UserService(c.get("db"));

  const existing = await userService.findByEmail(body.email);
  if (existing) {
    return error(c, "EMAIL_EXISTS", "A user with this email already exists", 409);
  }

  const user = await userService.create({
    name: body.name,
    email: body.email,
    password: body.password,
  });

  const token = AuthService.generateToken({
    userId: user!.id,
    email: user!.email,
    role: user!.role,
  });

  return success(c, { user, token }, 201);
});

// POST /auth/login
auth.post("/login", validateBody(loginSchema), async (c) => {
  const body = c.get("validatedBody" as any) as { email: string; password: string };
  const userService = new UserService(c.get("db"));

  const user = await userService.findByEmail(body.email);
  if (!user) {
    return unauthorized(c, "Invalid email or password");
  }

  if (!user.isActive) {
    return error(c, "ACCOUNT_DISABLED", "This account has been disabled", 403);
  }

  const valid = await AuthService.verifyPassword(body.password, user.passwordHash);
  if (!valid) {
    return unauthorized(c, "Invalid email or password");
  }

  await userService.updateLastLogin(user.id);

  const token = AuthService.generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const { passwordHash: _, ...safeUser } = user;

  return success(c, { user: safeUser, token });
});

// POST /auth/forgot-password (placeholder)
auth.post("/forgot-password", validateBody(forgotPasswordSchema), async (c) => {
  // Placeholder - in production, send a reset email
  return success(c, { message: "If the email exists, a reset link has been sent" });
});

// GET /auth/me
auth.get("/me", authRequired(), async (c) => {
  const userId = c.get("userId");
  const userService = new UserService(c.get("db"));

  const user = await userService.findByIdWithProfile(userId);
  if (!user) {
    return unauthorized(c, "User not found");
  }

  return success(c, { user });
});

export { auth as authRoutes };
