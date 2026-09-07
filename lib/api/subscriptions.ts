import "server-only";

import { apiRequest } from "@/lib/api/client";
import { arrayOf, objectOf } from "@/lib/api/response";

export type ApiSubscriptionPlan = {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  price?: number | { amount?: number; currency?: string };
  numberOfHours?: number;
  duration?: number;
  isActive?: boolean;
};

export type ApiSubscription = {
  _id?: string;
  id?: string;
  studentId?: unknown;
  planId?: ApiSubscriptionPlan | string;
  majorId?: unknown;
  numberOfHours?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
};

export type ApiHourlyPrice = {
  _id?: string;
  id?: string;
  countryId?: unknown;
  studentHourlyRateUSD?: number;
  instructorHourlyRateUSD?: number;
};

type Input = Record<string, unknown>;

export function createSubscriptionPlan(body: Input) {
  return apiRequest<unknown>("/api/v1/subscriptionPlan", { method: "POST", body });
}

export function updateSubscriptionPlan(id: string, body: Input) {
  return apiRequest<unknown>(`/api/v1/subscriptionPlan/${id}`, {
    method: "PUT",
    body,
  });
}

export async function getSubscriptionPlans() {
  const payload = await apiRequest<unknown>("/api/v1/subscriptionPlan");
  return arrayOf<ApiSubscriptionPlan>(payload, ["plans", "subscriptionPlans"]);
}

export async function getSubscriptionPlan(id: string) {
  const payload = await apiRequest<unknown>(`/api/v1/subscriptionPlan/${id}`);
  return objectOf<ApiSubscriptionPlan>(payload, ["plan", "subscriptionPlan"]);
}

export function deleteSubscriptionPlan(id: string) {
  return apiRequest<unknown>(`/api/v1/subscriptionPlan/${id}`, {
    method: "DELETE",
  });
}

export function createSubscription(planId: string, majorId?: string) {
  return apiRequest<unknown>("/api/v1/subscriptions", {
    method: "POST",
    body: { planId, ...(majorId ? { majorId } : {}) },
  });
}

export async function getSubscriptions() {
  const payload = await apiRequest<unknown>("/api/v1/subscriptions/");
  return arrayOf<ApiSubscription>(payload, ["subscriptions"]);
}

export async function getSubscription(id: string) {
  const payload = await apiRequest<unknown>(`/api/v1/subscriptions/${id}`);
  return objectOf<ApiSubscription>(payload, ["subscription"]);
}

export function cancelSubscription(id: string) {
  return apiRequest<unknown>(`/api/v1/subscriptions/${id}/cancel`, {
    method: "PATCH",
  });
}

export function createHourlyPrice(body: Input) {
  return apiRequest<unknown>("/api/v1/hourlyPrices", { method: "POST", body });
}

export async function getHourlyPrices() {
  const payload = await apiRequest<unknown>("/api/v1/hourlyPrices");
  return arrayOf<ApiHourlyPrice>(payload, ["hourlyPrices", "prices"]);
}

export async function getHourlyPrice(id: string) {
  const payload = await apiRequest<unknown>(`/api/v1/hourlyPrices/${id}`);
  return objectOf<ApiHourlyPrice>(payload, ["hourlyPrice", "price"]);
}

export async function getHourlyPriceByCountry(countryId: string) {
  const payload = await apiRequest<unknown>(
    `/api/v1/hourlyPrices/country/${countryId}`,
  );
  return objectOf<ApiHourlyPrice>(payload, ["hourlyPrice", "price"]);
}

export function updateHourlyPrice(id: string, body: Input) {
  return apiRequest<unknown>(`/api/v1/hourlyPrices/${id}`, {
    method: "PATCH",
    body,
  });
}

export function deleteHourlyPrice(id: string) {
  return apiRequest<unknown>(`/api/v1/hourlyPrices/${id}`, {
    method: "DELETE",
  });
}
