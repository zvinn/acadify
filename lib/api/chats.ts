import "server-only";

import { apiRequest } from "@/lib/api/client";

export type ApiChat = {
  _id?: string;
  id?: string;
  participants?: unknown[];
  order?: string | Record<string, unknown>;
  request?: string | Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  type?: string;
  referenceId?: string;
  referenceType?: string;
};

export type ApiMessage = {
  _id?: string;
  id?: string;
  chat?: string;
  sender?: string | Record<string, unknown>;
  content?: string;
  body?: string;
  text?: string;
  createdAt?: string;
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

export async function getUserChats() {
  const payload = await apiRequest<unknown>("/api/v1/chats/user");
  return arrayOf<ApiChat>(payload, ["chats", "docs", "items", "results"]);
}

export function createChat(body: {
  participants:
    | string[]
    | { instructor: string; student: string };
  referenceId: string;
  referenceType: string;
  type: string;
}) {
  return apiRequest<unknown>("/api/v1/chats", { method: "POST", body });
}

export async function getAllChats() {
  const payload = await apiRequest<unknown>("/api/v1/chats");
  return arrayOf<ApiChat>(payload, ["chats", "docs", "items", "results"]);
}

export async function getChat(chatId: string) {
  const payload = await apiRequest<unknown>(`/api/v1/chats/${chatId}`);
  const data = dataOf(payload);
  if (!data || typeof data !== "object" || Array.isArray(data)) return {} as ApiChat;
  const record = data as Record<string, unknown>;
  return (record.chat ?? record.doc ?? data) as ApiChat;
}

export function updateChat(chatId: string, body: Record<string, unknown>) {
  return apiRequest<unknown>(`/api/v1/chats/${chatId}`, {
    method: "PATCH",
    body,
  });
}

export function deleteChat(chatId: string) {
  return apiRequest<unknown>(`/api/v1/chats/${chatId}`, { method: "DELETE" });
}

export function setChatActive(chatId: string, active: boolean) {
  return apiRequest<unknown>(
    `/api/v1/chats/${chatId}/${active ? "active" : "unActive"}`,
    { method: "PATCH" },
  );
}

export async function getChatMessages(chatId: string) {
  const payload = await apiRequest<unknown>(`/api/v1/chats/${chatId}/getMessages`);
  return arrayOf<ApiMessage>(payload, [
    "messages",
    "chatMessages",
    "docs",
    "items",
    "results",
  ]);
}
