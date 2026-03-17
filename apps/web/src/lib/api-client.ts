const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function handleResponse<T>(response: Response): Promise<T> {
  const body = await response.json();

  if (!response.ok || body.success === false) {
    const error = body.error || { code: "UNKNOWN", message: "An unknown error occurred" };
    throw new ApiClientError(error.message, response.status, error.code, error.details);
  }

  return body.data as T;
}

function buildHeaders(customHeaders?: HeadersInit): Headers {
  const headers = new Headers(customHeaders);
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, String(v)));
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    }
  }

  return url.toString();
}

export const apiClient = {
  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const response = await fetch(buildUrl(path, params), {
      method: "GET",
      headers: buildHeaders(),
    });
    return handleResponse<T>(response);
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(buildUrl(path), {
      method: "POST",
      headers: buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(buildUrl(path), {
      method: "PATCH",
      headers: buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete<T = void>(path: string): Promise<T> {
    const response = await fetch(buildUrl(path), {
      method: "DELETE",
      headers: buildHeaders(),
    });
    return handleResponse<T>(response);
  },
};

export { ApiClientError };
