import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  createWorkspaceSchema,
  updateWorkspaceSchema,
  createProjectSchema,
  createTaskSchema,
  updateTaskSchema,
  filterTasksSchema,
  createCommentSchema,
  createLabelSchema,
} from "../src/schemas/index";

describe("loginSchema", () => {
  it("accepts valid login input", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "password123" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-email", password: "password123" });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "short" });
    expect(result.success).toBe(false);
  });

  it("rejects empty email", () => {
    const result = loginSchema.safeParse({ email: "", password: "password123" });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts valid registration input", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Password1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({
      name: "J",
      email: "john@example.com",
      password: "Password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase letter", () => {
    const result = registerSchema.safeParse({
      name: "John",
      email: "john@example.com",
      password: "password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = registerSchema.safeParse({
      name: "John",
      email: "john@example.com",
      password: "Password",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without lowercase letter", () => {
    const result = registerSchema.safeParse({
      name: "John",
      email: "john@example.com",
      password: "PASSWORD1",
    });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts valid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "test@example.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "not-email" });
    expect(result.success).toBe(false);
  });
});

describe("createWorkspaceSchema", () => {
  it("accepts valid workspace input", () => {
    const result = createWorkspaceSchema.safeParse({ name: "My Workspace" });
    expect(result.success).toBe(true);
  });

  it("accepts workspace with slug", () => {
    const result = createWorkspaceSchema.safeParse({ name: "My Workspace", slug: "my-workspace" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid slug characters", () => {
    const result = createWorkspaceSchema.safeParse({ name: "My Workspace", slug: "My Workspace!" });
    expect(result.success).toBe(false);
  });

  it("rejects short name", () => {
    const result = createWorkspaceSchema.safeParse({ name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects long name", () => {
    const result = createWorkspaceSchema.safeParse({ name: "A".repeat(51) });
    expect(result.success).toBe(false);
  });
});

describe("updateWorkspaceSchema", () => {
  it("accepts partial update", () => {
    const result = updateWorkspaceSchema.safeParse({ name: "Updated" });
    expect(result.success).toBe(true);
  });

  it("accepts empty update", () => {
    const result = updateWorkspaceSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("createProjectSchema", () => {
  it("accepts valid project input", () => {
    const result = createProjectSchema.safeParse({ name: "My Project" });
    expect(result.success).toBe(true);
  });

  it("accepts project with all optional fields", () => {
    const result = createProjectSchema.safeParse({
      name: "My Project",
      description: "A test project",
      color: "#ff0000",
      status: "active",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid hex color", () => {
    const result = createProjectSchema.safeParse({ name: "My Project", color: "red" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = createProjectSchema.safeParse({ name: "My Project", status: "invalid" });
    expect(result.success).toBe(false);
  });

  it("rejects short name", () => {
    const result = createProjectSchema.safeParse({ name: "A" });
    expect(result.success).toBe(false);
  });
});

describe("createTaskSchema", () => {
  it("accepts minimal task input", () => {
    const result = createTaskSchema.safeParse({ title: "Fix bug" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("backlog");
      expect(result.data.priority).toBe("none");
      expect(result.data.type).toBe("task");
    }
  });

  it("accepts full task input", () => {
    const result = createTaskSchema.safeParse({
      title: "Fix authentication bug",
      description: "Users can't log in",
      status: "in_progress",
      priority: "high",
      type: "bug",
      assigneeId: "usr_abc123",
      labelIds: ["lbl_1", "lbl_2"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = createTaskSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = createTaskSchema.safeParse({ title: "Task", status: "pending" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid priority", () => {
    const result = createTaskSchema.safeParse({ title: "Task", priority: "critical" });
    expect(result.success).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("accepts partial update", () => {
    const result = updateTaskSchema.safeParse({ status: "done" });
    expect(result.success).toBe(true);
  });

  it("accepts empty update", () => {
    const result = updateTaskSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects invalid status in update", () => {
    const result = updateTaskSchema.safeParse({ status: "invalid" });
    expect(result.success).toBe(false);
  });
});

describe("filterTasksSchema", () => {
  it("accepts empty filter (uses defaults)", () => {
    const result = filterTasksSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.perPage).toBe(25);
      expect(result.data.sortBy).toBe("position");
      expect(result.data.sortDirection).toBe("asc");
    }
  });

  it("accepts filter with multiple statuses", () => {
    const result = filterTasksSchema.safeParse({
      status: ["todo", "in_progress"],
      priority: ["high", "urgent"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects page less than 1", () => {
    const result = filterTasksSchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects perPage over 100", () => {
    const result = filterTasksSchema.safeParse({ perPage: 101 });
    expect(result.success).toBe(false);
  });

  it("accepts search query", () => {
    const result = filterTasksSchema.safeParse({ search: "authentication bug" });
    expect(result.success).toBe(true);
  });
});

describe("createCommentSchema", () => {
  it("accepts valid comment", () => {
    const result = createCommentSchema.safeParse({ content: "This is a comment" });
    expect(result.success).toBe(true);
  });

  it("rejects empty content", () => {
    const result = createCommentSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
  });
});

describe("createLabelSchema", () => {
  it("accepts valid label", () => {
    const result = createLabelSchema.safeParse({ name: "Bug", color: "#ff0000" });
    expect(result.success).toBe(true);
  });

  it("rejects label without color", () => {
    const result = createLabelSchema.safeParse({ name: "Bug" });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = createLabelSchema.safeParse({ name: "", color: "#ff0000" });
    expect(result.success).toBe(false);
  });
});
