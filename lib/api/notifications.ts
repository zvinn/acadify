import "server-only";

import { apiRequest } from "@/lib/api/client";

export type ApiNotification = {
  _id?: string;
  id?: string;
  title?: string;
  body?: string;
  description?: string;
  type?: string;
  isRead?: boolean;
  readAt?: string;
  createdAt?: string;
  userId?: unknown;
  userType?: string;
  data?: unknown;
  isDeleted?: boolean;
};

function dataOf(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") return payload;
  return (payload as Record<string, unknown>).data ?? payload;
}

function arrayOf<T>(payload: unknown, keys: string[]): T[] {
  const data = dataOf(payload);
  if (Array.isArray(data)) return data as T[];
  if (!data || typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value as T[];
  }
  return [];
}

export async function getMyNotifications() {
  const payload = await apiRequest<unknown>("/api/v1/notifications/me");
  return arrayOf<ApiNotification>(payload, [
    "notifications",
    "docs",
    "items",
    "results",
  ]);
}

export function createNotification(body: Record<string, unknown>) {
  return apiRequest<unknown>("/api/v1/notifications", {
    method: "POST",
    body,
  });
}

export async function getAllNotifications() {
  const payload = await apiRequest<unknown>("/api/v1/notifications");
  return arrayOf<ApiNotification>(payload, ["notifications", "docs", "items", "results"]);
}

export async function getNotification(id: string) {
  const payload = await apiRequest<unknown>(`/api/v1/notifications/${id}`);
  const data = dataOf(payload);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {} as ApiNotification;
  }
  const record = data as Record<string, unknown>;
  return (record.notification ?? record.doc ?? data) as ApiNotification;
}

export function sendNotificationToAllInstructors(body: {
  title: string;
  body: string;
  type?: string;
}) {
  return apiRequest<unknown>("/api/v1/notifications/sendToAllInstructors", {
    method: "POST",
    body,
  });
}

export function sendNotificationToAllStudents(body: {
  title: string;
  body: string;
  type?: string;
}) {
  return apiRequest<unknown>("/api/v1/notifications/sendToAllStudents", {
    method: "POST",
    body,
  });
}

export async function markAllNotificationsRead() {
  return apiRequest<unknown>("/api/v1/notifications/me/mark-all-read", {
    method: "PATCH",
  });
}

export async function markNotificationRead(id: string) {
  return apiRequest<unknown>(`/api/v1/notifications/${id}`, {
    method: "PATCH",
  });
}

export function deleteNotification(id: string) {
  return apiRequest<unknown>(`/api/v1/notifications/${id}`, {
    method: "DELETE",
  });
}
