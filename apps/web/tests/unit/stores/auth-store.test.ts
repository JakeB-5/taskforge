import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../../../src/stores/auth-store";
import type { User } from "@taskforge/shared";

const mockUser: User = {
  id: "usr_123",
  email: "test@example.com",
  name: "Test User",
  avatarUrl: null,
  role: "member",
  isActive: true,
  lastLoginAt: null,
  emailVerifiedAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset the store
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it("has correct initial state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBe(null);
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
  });

  it("login sets user, token, and isAuthenticated", () => {
    useAuthStore.getState().login(mockUser, "test-token");
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe("test-token");
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it("login stores token in localStorage", () => {
    useAuthStore.getState().login(mockUser, "test-token");
    expect(localStorage.getItem("token")).toBe("test-token");
  });

  it("logout clears user and token", () => {
    useAuthStore.getState().login(mockUser, "test-token");
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.user).toBe(null);
    expect(state.token).toBe(null);
    expect(state.isAuthenticated).toBe(false);
  });

  it("logout removes token from localStorage", () => {
    useAuthStore.getState().login(mockUser, "test-token");
    useAuthStore.getState().logout();
    expect(localStorage.getItem("token")).toBe(null);
  });

  it("setUser sets user and marks authenticated", () => {
    useAuthStore.getState().setUser(mockUser);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it("setLoading updates loading state", () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });

  it("login then logout cycle works correctly", () => {
    const store = useAuthStore.getState();
    store.login(mockUser, "token1");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBe(null);
  });

  it("multiple logins update user correctly", () => {
    const user2: User = { ...mockUser, id: "usr_456", name: "Other User" };

    useAuthStore.getState().login(mockUser, "token1");
    expect(useAuthStore.getState().user?.id).toBe("usr_123");

    useAuthStore.getState().login(user2, "token2");
    expect(useAuthStore.getState().user?.id).toBe("usr_456");
    expect(localStorage.getItem("token")).toBe("token2");
  });
});
