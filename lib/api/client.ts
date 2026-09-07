import "server-only";

import { getSession } from "@/lib/auth/session";
import { normalizeApiErrorMessage, sanitizeApiPayload } from "@/lib/api/safety";

export type ApiResult<T> = {
  statusCode?: number;
  message?: string;
  data?: T;
  [key: string]: unknown;
};

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
  auth?: boolean;
};

const API_BASE_URL = process.env.API_BASE_URL?.trim();

function resolveApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    throw new ApiError("Absolute API URLs are not allowed.", 500, null);
  }

  if (!API_BASE_URL) {
    throw new ApiError(
      "Missing API base URL. Set API_BASE_URL in the server environment.",
      500,
      null,
    );
  }

  const base = API_BASE_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export async function apiRequest<T>(
  path: string,
  { body, headers, auth = true, ...init }: ApiRequestOptions = {},
): Promise<ApiResult<T>> {
  const isDemo = process.env.DEMO_MODE === "true";

  // In demo mode without backend API, return safe mock data so pages render gracefully
  if (isDemo && (!API_BASE_URL || API_BASE_URL === "")) {
    return { statusCode: 200, message: "Demo Mode", data: [] as unknown as T };
  }

  const requestHeaders = new Headers(headers);
  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body != null) {
    requestHeaders.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  if (auth) {
    const session = await getSession();
    if (session?.token) {
      requestHeaders.set("Authorization", `Bearer ${session.token}`);
    }
  }

  let response: Response;
  try {
    response = await fetch(resolveApiUrl(path), {
      ...init,
      headers: requestHeaders,
      body: requestBody,
      cache: "no-store",
      signal: init.signal ?? AbortSignal.timeout(15_000),
    });
  } catch (err) {
    if (isDemo) {
      return { statusCode: 200, message: "Demo Mode Fallback", data: [] as unknown as T };
    }
    throw err;
  }

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (isDemo) {
      return { statusCode: 200, message: "Demo Mode Fallback", data: [] as unknown as T };
    }
    throw new ApiError(
      normalizeApiErrorMessage(payload, "The request failed. Please try again."),
      response.status,
      payload,
    );
  }

  return sanitizeApiPayload(payload, API_BASE_URL) as ApiResult<T>;
}