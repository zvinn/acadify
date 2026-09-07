import "server-only";

import { apiRequest } from "@/lib/api/client";

export type ApiRequestItem = {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  type?: string;
  deadline?: string;
  createdAt?: string;
  major?: string | { name?: string; title?: string };
  budget?: number;
  allFiles?: string[];
  demoFiles?: string[];
};

export type RequestInput = Record<string, unknown> | FormData;

export function createDirectRequest(body: FormData) {
  return apiRequest<unknown>("/api/v1/requests/createDirectRequest", {
    method: "POST",
    body,
  });
}

export function createRequest(body: RequestInput) {
  return apiRequest<unknown>("/api/v1/requests", {
    method: "POST",
    body,
  });
}

function dataOf(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") {
    return payload;
  }
  return (payload as Record<string, unknown>).data ?? payload;
}

function requestArray(payload: unknown): ApiRequestItem[] {
  const data = dataOf(payload);
  if (Array.isArray(data)) {
    return data as ApiRequestItem[];
  }
  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;
  for (const key of ["requests", "docs", "items", "results"]) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value as ApiRequestItem[];
    }
  }

  return [];
}

export async function getMyRequests() {
  const payload = await apiRequest<unknown>("/api/v1/requests/me");
  return requestArray(payload);
}

export async function getAllRequests() {
  const payload = await apiRequest<unknown>("/api/v1/requests/");
  return requestArray(payload);
}

export async function getRequest(requestId: string) {
  const payload = await apiRequest<unknown>(`/api/v1/requests/${requestId}`);
  const data = dataOf(payload);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {} as ApiRequestItem;
  }

  const record = data as Record<string, unknown>;
  for (const key of ["request", "doc", "item"]) {
    const value = record[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as ApiRequestItem;
    }
  }

  return data as ApiRequestItem;
}

export function updateRequest(requestId: string, body: RequestInput) {
  return apiRequest<unknown>(`/api/v1/requests/${requestId}`, {
    method: "PUT",
    body,
  });
}

export function cancelRequest(requestId: string) {
  return apiRequest<unknown>(`/api/v1/requests/${requestId}/cancel`, {
    method: "PATCH",
  });
}

export function deleteRequest(requestId: string) {
  return apiRequest<unknown>(`/api/v1/requests/${requestId}`, {
    method: "DELETE",
  });
}

export function changeRequestStatus(requestId: string, status: string) {
  return apiRequest<unknown>(`/api/v1/requests/${requestId}/status`, {
    method: "PATCH",
    body: { status },
  });
}
