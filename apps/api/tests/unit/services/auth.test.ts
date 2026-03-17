import { describe, it, expect, beforeAll } from "vitest";
import { AuthService } from "../../../src/services/auth";

// Set required env vars for tests
beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-key-for-testing-only";
  process.env.BCRYPT_ROUNDS = "4"; // Fast rounds for testing
});

describe("AuthService.hashPassword", () => {
  it("hashes a password", async () => {
    const hash = await AuthService.hashPassword("Password1");
    expect(hash).toBeDefined();
    expect(hash).not.toBe("Password1");
    expect(hash.startsWith("$2")).toBe(true);
  });

  it("produces different hashes for same password", async () => {
    const hash1 = await AuthService.hashPassword("Password1");
    const hash2 = await AuthService.hashPassword("Password1");
    expect(hash1).not.toBe(hash2);
  });
});

describe("AuthService.verifyPassword", () => {
  it("verifies correct password", async () => {
    const hash = await AuthService.hashPassword("Password1");
    const result = await AuthService.verifyPassword("Password1", hash);
    expect(result).toBe(true);
  });

  it("rejects incorrect password", async () => {
    const hash = await AuthService.hashPassword("Password1");
    const result = await AuthService.verifyPassword("WrongPassword1", hash);
    expect(result).toBe(false);
  });

  it("rejects empty password against hash", async () => {
    const hash = await AuthService.hashPassword("Password1");
    const result = await AuthService.verifyPassword("", hash);
    expect(result).toBe(false);
  });
});

describe("AuthService.generateToken", () => {
  it("generates a JWT token", () => {
    const token = AuthService.generateToken({
      userId: "usr_123",
      email: "test@example.com",
      role: "member",
    });
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("generates different tokens for different payloads", () => {
    const token1 = AuthService.generateToken({
      userId: "usr_123",
      email: "test@example.com",
      role: "member",
    });
    const token2 = AuthService.generateToken({
      userId: "usr_456",
      email: "other@example.com",
      role: "admin",
    });
    expect(token1).not.toBe(token2);
  });
});

describe("AuthService.verifyToken", () => {
  it("verifies a valid token", () => {
    const payload = {
      userId: "usr_123",
      email: "test@example.com",
      role: "member",
    };
    const token = AuthService.generateToken(payload);
    const decoded = AuthService.verifyToken(token);
    expect(decoded.userId).toBe("usr_123");
    expect(decoded.email).toBe("test@example.com");
    expect(decoded.role).toBe("member");
  });

  it("throws on invalid token", () => {
    expect(() => AuthService.verifyToken("invalid.token.here")).toThrow();
  });

  it("throws on tampered token", () => {
    const token = AuthService.generateToken({
      userId: "usr_123",
      email: "test@example.com",
      role: "member",
    });
    const tampered = token.slice(0, -5) + "xxxxx";
    expect(() => AuthService.verifyToken(tampered)).toThrow();
  });
});
