import "server-only";

import { apiRequest } from "@/lib/api/client";

export type ApiOrder = {
  _id?: string;
  id?: string;
  offer?: string | Record<string, unknown>;
  request?: string | Record<string, unknown>;
  student?: string | Record<string, unknown>;
  instructor?: string | Record<string, unknown>;
  status?: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  documents?: string[];
  quizzes?: string[];
  videos?: string[];
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

export async function getMyOrders() {
  const payload = await apiRequest<unknown>("/api/v1/orders/me");
  return arrayOf<ApiOrder>(payload, ["orders", "docs", "items", "results"]);
}

export async function getAllOrders() {
  const payload = await apiRequest<unknown>("/api/v1/orders");
  return arrayOf<ApiOrder>(payload, ["orders", "docs", "items", "results"]);
}

export async function getOrder(orderId: string) {
  const payload = await apiRequest<unknown>(`/api/v1/orders/${orderId}`);
  const data = dataOf(payload);
  if (!data || typeof data !== "object" || Array.isArray(data)) return {} as ApiOrder;
  const record = data as Record<string, unknown>;
  return (record.order ?? record.doc ?? data) as ApiOrder;
}

export async function createOrder(offerId: string) {
  return apiRequest<unknown>("/api/v1/orders", {
    method: "POST",
    body: { offer: offerId },
  });
}

export async function createLiveOrder(body: {
  offer: string;
  timeOfNextSession: string;
  numberOfSessions: number;
}) {
  return apiRequest<unknown>("/api/v1/orders/live", {
    method: "POST",
    body,
  });
}

export function getOrderUploadUrl(offerId: string) {
  return apiRequest<unknown>(`/api/v1/orders/createUploadUrl/${offerId}`);
}

function filesBody(name: string, files: File[]) {
  const body = new FormData();
  files.forEach((file) => body.append(name, file));
  return body;
}

export function uploadOrderDocuments(offerId: string, documents: File[]) {
  return apiRequest<unknown>(`/api/v1/orders/uploadDocs/${offerId}`, {
    method: "PUT",
    body: filesBody("documents", documents),
  });
}

export function uploadOrderQuizzes(offerId: string, quizzes: File[]) {
  return apiRequest<unknown>(`/api/v1/orders/uploadQuizzes/${offerId}`, {
    method: "PUT",
    body: filesBody("quizzes", quizzes),
  });
}

export function submitOrder(offerId: string) {
  return apiRequest<unknown>(`/api/v1/orders/submit/${offerId}`, { method: "PUT" });
}

export async function getMyVideos() {
  const payload = await apiRequest<unknown>("/api/v1/orders/getMyVideos");
  return arrayOf<unknown>(payload, ["videos", "assets"]);
}

export function cancelOrder(offerId: string) {
  return apiRequest<unknown>(`/api/v1/orders/cancel/${offerId}`, { method: "PUT" });
}
