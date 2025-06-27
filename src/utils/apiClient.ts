import { API_BASE_URL } from "../config/api";
import { toast } from "react-toastify";

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiClientConfig extends RequestInit {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: BodyInit | null;
  params?: Record<string, string | number | boolean | undefined>;
}

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
  accept: "*/*",
};

/**
 * Makes an API request with consistent error handling and response parsing
 * @param endpoint - The API endpoint (without base URL)
 * @param config - Configuration for the request
 * @returns Promise with the parsed JSON response
 * @throws {Error} If the request fails or returns an error status
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  {
    method = "GET",
    headers = {},
    body,
    params,
    ...customConfig
  }: ApiClientConfig = {},
): Promise<T> {
  const config: RequestInit = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...customConfig,
  };

  // Only include body if it's not a GET or HEAD request
  if (method !== "GET" && method !== "HEAD" && body) {
    config.body = typeof body === "object" ? JSON.stringify(body) : body;
  }

  // Build URL with query parameters if provided
  const queryString = params
    ? Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join("&")
    : "";

  const url = `${API_BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText || "An error occurred",
      }));

      const error = new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      ) as ApiError;
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as unknown as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("API request failed:", error);

    // Only show toast for client-side errors (not 4xx errors which are handled by the UI)
    const status = (error as { status?: number }).status;
    if (!status || status >= 500) {
      toast.error("An unexpected error occurred. Please try again later.");
    }

    throw error;
  }
}

/**
 * Helper functions for common HTTP methods
 */
export const api = {
  get: <
    T = unknown,
    TParams extends Record<
      string,
      string | number | boolean | undefined
    > = Record<string, string | number | boolean | undefined>,
  >(
    endpoint: string,
    params?: TParams,
    config?: Omit<ApiClientConfig, "params">,
  ) => apiClient<T>(endpoint, { ...config, method: "GET", params }),

  post: <
    T = unknown,
    TData extends BodyInit | Record<string, unknown> | unknown[] = Record<
      string,
      unknown
    >,
  >(
    endpoint: string,
    data?: TData,
    config?: Omit<ApiClientConfig, "body">,
  ) =>
    apiClient<T>(endpoint, {
      ...config,
      method: "POST",
      body:
        data instanceof FormData ||
        typeof data === "string" ||
        data instanceof Blob ||
        data instanceof ArrayBuffer ||
        ArrayBuffer.isView(data)
          ? (data as BodyInit)
          : JSON.stringify(data),
    }),

  put: <
    T = unknown,
    TData extends BodyInit | Record<string, unknown> | unknown[] = Record<
      string,
      unknown
    >,
  >(
    endpoint: string,
    data?: TData,
    config?: Omit<ApiClientConfig, "body">,
  ) =>
    apiClient<T>(endpoint, {
      ...config,
      method: "PUT",
      body:
        data instanceof FormData ||
        typeof data === "string" ||
        data instanceof Blob ||
        data instanceof ArrayBuffer ||
        ArrayBuffer.isView(data)
          ? (data as BodyInit)
          : JSON.stringify(data),
    }),

  patch: <
    T = unknown,
    TData extends BodyInit | Record<string, unknown> | unknown[] = Record<
      string,
      unknown
    >,
  >(
    endpoint: string,
    data?: TData,
    config?: Omit<ApiClientConfig, "body">,
  ) =>
    apiClient<T>(endpoint, {
      ...config,
      method: "PATCH",
      body:
        data instanceof FormData ||
        typeof data === "string" ||
        data instanceof Blob ||
        data instanceof ArrayBuffer ||
        ArrayBuffer.isView(data)
          ? (data as BodyInit)
          : JSON.stringify(data),
    }),

  delete: <T = unknown>(
    endpoint: string,
    config?: Omit<ApiClientConfig, "method">,
  ) => apiClient<T>(endpoint, { ...config, method: "DELETE" }),
};

export default apiClient;
