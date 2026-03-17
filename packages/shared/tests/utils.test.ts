import { describe, it, expect } from "vitest";
import { generateId, generatePrefixedId, createUserId, createTaskId } from "../src/utils/id";
import { formatISODate, formatDisplayDate, isOverdue, isDueSoon, nowISO } from "../src/utils/date";
import { slugify, truncate, getInitials, capitalize, toTitleCase } from "../src/utils/string";

describe("generateId", () => {
  it("generates an ID of default length", () => {
    const id = generateId();
    expect(id).toHaveLength(21);
  });

  it("generates an ID of custom length", () => {
    const id = generateId(10);
    expect(id).toHaveLength(10);
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it("only contains valid characters", () => {
    const id = generateId();
    expect(id).toMatch(/^[0-9a-z]+$/);
  });
});

describe("generatePrefixedId", () => {
  it("generates a prefixed ID", () => {
    const id = generatePrefixedId("usr");
    expect(id).toMatch(/^usr_[0-9a-z]{16}$/);
  });

  it("uses custom length", () => {
    const id = generatePrefixedId("tsk", 8);
    expect(id).toMatch(/^tsk_[0-9a-z]{8}$/);
  });
});

describe("entity ID generators", () => {
  it("createUserId starts with usr_", () => {
    expect(createUserId()).toMatch(/^usr_/);
  });

  it("createTaskId starts with tsk_", () => {
    expect(createTaskId()).toMatch(/^tsk_/);
  });
});

describe("formatISODate", () => {
  it("formats a date string as YYYY-MM-DD", () => {
    expect(formatISODate("2024-03-15T10:30:00Z")).toBe("2024-03-15");
  });

  it("handles different date formats", () => {
    expect(formatISODate("2024-01-01T00:00:00.000Z")).toBe("2024-01-01");
  });
});

describe("formatDisplayDate", () => {
  it("formats a date for display", () => {
    const result = formatDisplayDate("2024-03-15T10:30:00Z");
    expect(result).toContain("Mar");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });
});

describe("isOverdue", () => {
  it("returns true for past dates", () => {
    expect(isOverdue("2020-01-01T00:00:00Z")).toBe(true);
  });

  it("returns false for future dates", () => {
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    expect(isOverdue(future)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isOverdue(null)).toBe(false);
  });
});

describe("isDueSoon", () => {
  it("returns true for dates within threshold", () => {
    const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString();
    expect(isDueSoon(tomorrow, 3)).toBe(true);
  });

  it("returns false for dates beyond threshold", () => {
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    expect(isDueSoon(nextMonth, 3)).toBe(false);
  });

  it("returns false for past dates", () => {
    expect(isDueSoon("2020-01-01T00:00:00Z")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isDueSoon(null)).toBe(false);
  });
});

describe("nowISO", () => {
  it("returns a valid ISO string", () => {
    const result = nowISO();
    expect(() => new Date(result)).not.toThrow();
    expect(new Date(result).toISOString()).toBe(result);
  });
});

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("handles multiple spaces", () => {
    expect(slugify("Hello   World")).toBe("hello-world");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("  Hello World  ")).toBe("hello-world");
  });

  it("handles underscores", () => {
    expect(slugify("hello_world")).toBe("hello-world");
  });
});

describe("truncate", () => {
  it("returns short text unchanged", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates long text with ellipsis", () => {
    const result = truncate("Hello World This Is Long", 10);
    expect(result.length).toBeLessThanOrEqual(10);
    expect(result).toContain("\u2026");
  });

  it("handles exact length", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });
});

describe("getInitials", () => {
  it("gets two initials from full name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("gets one initial from single name", () => {
    expect(getInitials("John")).toBe("J");
  });

  it("limits to two initials", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });

  it("handles extra spaces", () => {
    expect(getInitials("  John   Doe  ")).toBe("JD");
  });
});

describe("capitalize", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("handles already capitalized", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });
});

describe("toTitleCase", () => {
  it("converts snake_case to Title Case", () => {
    expect(toTitleCase("hello_world")).toBe("Hello World");
  });

  it("converts kebab-case to Title Case", () => {
    expect(toTitleCase("hello-world")).toBe("Hello World");
  });

  it("handles single word", () => {
    expect(toTitleCase("hello")).toBe("Hello");
  });
});
