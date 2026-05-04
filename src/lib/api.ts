const API_URL =
  (import.meta as ImportMeta & { env: { VITE_API_URL?: string } }).env.VITE_API_URL ||
  "http://localhost:8000";

export const TOKEN_STORAGE_KEY = "mi_punto_token";

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(fn: () => void) {
  unauthorizedHandler = fn;
}

/**
 * Lee el token desde localStorage usando la misma convención que `atomWithStorage`
 * de Jotai (JSON-encoded).
 */
export function getToken(): string | null {
  const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "string" ? parsed : null;
  } catch {
    // Compatibilidad si en algún momento se guardó sin JSON-encoding.
    return raw;
  }
}

export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, detail: unknown, message: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Si es true, no se envía el JWT aunque exista. */
  anonymous?: boolean;
};

export async function api<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, signal, anonymous = false } = options;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (!anonymous) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
        ? body
        : JSON.stringify(body),
    signal,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }
    const message =
      typeof payload === "object" && payload && "detail" in payload
        ? String((payload as { detail: unknown }).detail)
        : `HTTP ${response.status}`;
    throw new ApiError(response.status, payload, message);
  }

  return payload as T;
}
