import { describe, it, expect, beforeEach, vi } from "vitest";
import { apiClient, ApiClientError } from "../../../src/lib/api-client";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("apiClient", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    localStorage.clear();
  });

  describe("get", () => {
    it("makes GET request and returns data", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { id: "1", name: "Test" } }),
      });

      const result = await apiClient.get("/test");
      expect(result).toEqual({ id: "1", name: "Test" });
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toContain("/test");
      expect(options.method).toBe("GET");
    });

    it("includes query params in URL", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      });

      await apiClient.get("/test", { page: 1, search: "hello" });

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain("page=1");
      expect(url).toContain("search=hello");
    });

    it("skips undefined and null params", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      });

      await apiClient.get("/test", { page: 1, search: undefined, filter: null });

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain("page=1");
      expect(url).not.toContain("search");
      expect(url).not.toContain("filter");
    });

    it("attaches JWT token from localStorage", async () => {
      localStorage.setItem("token", "my-jwt-token");

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      await apiClient.get("/test");

      const [, options] = mockFetch.mock.calls[0];
      const headers = options.headers as Headers;
      expect(headers.get("Authorization")).toBe("Bearer my-jwt-token");
    });

    it("does not attach Authorization when no token", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: {} }),
      });

      await apiClient.get("/test");

      const [, options] = mockFetch.mock.calls[0];
      const headers = options.headers as Headers;
      expect(headers.get("Authorization")).toBe(null);
    });
  });

  describe("post", () => {
    it("makes POST request with JSON body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { id: "1" } }),
      });

      const result = await apiClient.post("/test", { name: "Test" });
      expect(result).toEqual({ id: "1" });

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe("POST");
      expect(JSON.parse(options.body)).toEqual({ name: "Test" });
    });

    it("makes POST request without body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: null }),
      });

      await apiClient.post("/test");

      const [, options] = mockFetch.mock.calls[0];
      expect(options.body).toBeUndefined();
    });
  });

  describe("patch", () => {
    it("makes PATCH request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { id: "1", name: "Updated" } }),
      });

      const result = await apiClient.patch("/test/1", { name: "Updated" });
      expect(result).toEqual({ id: "1", name: "Updated" });

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe("PATCH");
    });
  });

  describe("delete", () => {
    it("makes DELETE request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: null }),
      });

      await apiClient.delete("/test/1");

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe("DELETE");
    });
  });

  describe("error handling", () => {
    it("throws ApiClientError on API error response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Invalid input" },
        }),
      });

      await expect(apiClient.get("/test")).rejects.toThrow(ApiClientError);
    });

    it("ApiClientError contains status and code", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          success: false,
          error: { code: "NOT_FOUND", message: "Resource not found" },
        }),
      });

      try {
        await apiClient.get("/test");
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(ApiClientError);
        const apiErr = err as ApiClientError;
        expect(apiErr.status).toBe(404);
        expect(apiErr.code).toBe("NOT_FOUND");
        expect(apiErr.message).toBe("Resource not found");
      }
    });

    it("handles error response with details", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details: { email: ["Invalid email"] },
          },
        }),
      });

      try {
        await apiClient.post("/test", {});
        expect.fail("Should have thrown");
      } catch (err) {
        const apiErr = err as ApiClientError;
        expect(apiErr.details).toEqual({ email: ["Invalid email"] });
      }
    });

    it("handles unknown error format", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(apiClient.get("/test")).rejects.toThrow(ApiClientError);
    });
  });
});
