import "server-only";

import { apiRequest } from "@/lib/api/client";

export type ApiLive = {
  _id?: string;
  id?: string;
  order?: string | Record<string, unknown>;
  offer?: string | Record<string, unknown>;
  link?: string;
  meetingUrl?: string;
  status?: string;
  timeOfNextSession?: string;
  numberOfSessions?: number;
  createdAt?: string;
  updatedAt?: string;
  liveId?: string;
  startTime?: string;
  endTime?: string;
  numberOfTotalSessions?: number;
};

function dataOf(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload;
  return (payload as Record<string, unknown>).data ?? payload;
}

function nestedObject<T>(payload: unknown, keys: string[]): T {
  const data = dataOf(payload);
  if (!data || typeof data !== "object" || Array.isArray(data)) return {} as T;
  const record = data as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as T;
    }
  }
  return data as T;
}

export async function createLiveSession(body: {
  order?: string;
  offer?: string;
  timeOfNextSession?: string;
  numberOfSessions?: number;
}) {
  return apiRequest<unknown>("/api/v1/lives", {
    method: "POST",
    body,
  });
}

export function createSession(body: {
  liveId: string;
  startTime: string;
  endTime: string;
}) {
  return apiRequest<unknown>("/api/v1/lives", { method: "POST", body });
}

export async function getLiveSession(liveId: string) {
  const payload = await apiRequest<unknown>(`/api/v1/lives/live/${liveId}`);
  return nestedObject<ApiLive>(payload, ["live", "session", "doc", "item"]);
}

export async function getSession(sessionId: string) {
  const payload = await apiRequest<unknown>(`/api/v1/lives/${sessionId}`);
  return nestedObject<ApiLive>(payload, ["session", "live", "doc", "item"]);
}

export function updateSession(
  sessionId: string,
  body: { startTime?: string; endTime?: string },
) {
  return apiRequest<unknown>(`/api/v1/lives/${sessionId}`, {
    method: "PATCH",
    body,
  });
}

export function deleteSession(sessionId: string) {
  return apiRequest<unknown>(`/api/v1/lives/${sessionId}`, {
    method: "DELETE",
  });
}

export function updateLive(
  liveId: string,
  body: { numberOfTotalSessions?: number; [key: string]: unknown },
) {
  return apiRequest<unknown>(`/api/v1/lives/live/${liveId}`, {
    method: "PATCH",
    body,
  });
}
