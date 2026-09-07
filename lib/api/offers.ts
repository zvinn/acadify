import "server-only";

import { apiRequest } from "@/lib/api/client";
import { isNoOffersAvailableError } from "@/lib/api/offer-availability";

export type ApiOffer = {
  _id?: string;
  id?: string;
  request?: string | Record<string, unknown>;
  instructor?: string | Record<string, unknown>;
  status?: string;
  estimatedTime?: number;
  estimateTime?: number;
  price?: number;
  createdAt?: string;
  allFiles?: string[];
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

export async function getMyOffers() {
  const payload = await apiRequest<unknown>("/api/v1/offers/me");
  return arrayOf<ApiOffer>(payload, ["offers", "docs", "items", "results"]);
}

export async function getOffersForRequest(requestId: string) {
  try {
    const payload = await apiRequest<unknown>(`/api/v1/offers/request/${requestId}`);
    return arrayOf<ApiOffer>(payload, ["offers", "docs", "items", "results"]);
  } catch (error) {
    if (isNoOffersAvailableError(error)) return [];
    throw error;
  }
}

export function createDirectOffer(body: {
  request: string;
  estimateTime?: number;
}) {
  return apiRequest<unknown>("/api/v1/offers/direct", {
    method: "POST",
    body,
  });
}

export function acceptDirectOffer(offerId: string) {
  return apiRequest<unknown>(`/api/v1/offers/${offerId}/acceptDirect`, {
    method: "PATCH",
  });
}

export async function createOffer(body: {
  request: string;
  estimateTime?: number;
  estimatedTime?: number;
}) {
  return apiRequest<unknown>("/api/v1/offers/", {
    method: "POST",
    body,
  });
}

export async function getOfferUploadUrl(offerId: string) {
  return apiRequest<unknown>(`/api/v1/offers/createUploadUrl/${offerId}`);
}

export function acceptOffer(offerId: string, files: File[] = []) {
  const body = new FormData();
  files.forEach((file) => body.append("allFiles", file));
  return apiRequest<unknown>(`/api/v1/offers/${offerId}/accept`, {
    method: "PATCH",
    body,
  });
}

export async function updateOfferEstimate(
  offerId: string,
  body: { estimatedTime: number },
) {
  return apiRequest<unknown>(`/api/v1/offers/${offerId}/estimatedTimeAndPrice`, {
    method: "PATCH",
    body,
  });
}

export async function cancelOffer(offerId: string) {
  return apiRequest<unknown>(`/api/v1/offers/cancel/${offerId}`, {
    method: "PATCH",
  });
}

export async function getOffer(offerId: string) {
  const payload = await apiRequest<unknown>(`/api/v1/offers/${offerId}`);
  const data = dataOf(payload);
  if (!data || typeof data !== "object" || Array.isArray(data)) return {} as ApiOffer;
  const record = data as Record<string, unknown>;
  return (record.offer ?? record.doc ?? data) as ApiOffer;
}

export async function getAllOffers() {
  const payload = await apiRequest<unknown>("/api/v1/offers/");
  return arrayOf<ApiOffer>(payload, ["offers", "docs", "items", "results"]);
}

export function deleteOffer(offerId: string) {
  return apiRequest<unknown>(`/api/v1/offers/${offerId}`, { method: "DELETE" });
}
