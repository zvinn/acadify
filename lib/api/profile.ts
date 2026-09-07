import "server-only";

import { apiRequest } from "@/lib/api/client";

export type ApiUser = {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  university?: string;
  faculty?: string;
  specialization?: string;
  year?: string;
  country?: string | { name?: string; title?: string };
  major?: string | { name?: string; title?: string };
  status?: string;
  currentJob?: string;
  certifications?: string[];
  role?: string;
};

export type ApiWallet = {
  balance?: number;
  balanceUSD?: number;
  freezedBalance?: number;
  freezedBalanceUSD?: number;
  currency?: string;
};

export type ApiTransaction = {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  amount?: number;
  amountUSD?: number;
  type?: string;
  status?: string;
  createdAt?: string;
};

function dataOf(payload: unknown): unknown {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const record = payload as Record<string, unknown>;
  return record.data ?? payload;
}

function nestedObject<T>(payload: unknown, keys: string[]): T {
  const data = dataOf(payload);
  if (!data || typeof data !== "object") {
    return {} as T;
  }

  const record = data as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as T;
    }
  }

  return data as T;
}

function nestedArray<T>(payload: unknown, keys: string[]): T[] {
  const data = dataOf(payload);
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  return [];
}

async function optional<T>(request: Promise<T>, fallback: T): Promise<T> {
  try {
    return await request;
  } catch {
    return fallback;
  }
}

export async function getStudentMe() {
  const payload = await apiRequest<unknown>("/api/v1/students/getMe");
  return nestedObject<ApiUser>(payload, ["student", "user"]);
}

export async function getInstructorMe() {
  const payload = await apiRequest<unknown>("/api/v1/instructors/getMe");
  return nestedObject<ApiUser>(payload, ["instructor", "user"]);
}

export async function updateStudentMe(body: Record<string, unknown>) {
  return apiRequest<unknown>("/api/v1/students/updateMe", {
    method: "PUT",
    body,
  });
}

export async function updateInstructorMe(body: Record<string, unknown>) {
  return apiRequest<unknown>("/api/v1/instructors/updateMe", {
    method: "PUT",
    body,
  });
}

export async function getMyWallet() {
  const payload = await apiRequest<unknown>("/api/v1/wallets/me");
  return nestedObject<ApiWallet>(payload, ["wallet"]);
}

export async function getMyTransactions() {
  const payload = await apiRequest<unknown>("/api/v1/wallets/me/transactions");
  return nestedArray<ApiTransaction>(payload, [
    "transactions",
    "walletTransactions",
    "docs",
    "items",
  ]);
}

export async function requestWithdrawal(body: {
  amountUSD: number;
  platform: string;
}) {
  return apiRequest<unknown>("/api/v1/wallets/withdraw", {
    method: "POST",
    body,
  });
}

export async function getAccountSnapshot(userRole: "student" | "instructor") {
  const user =
    userRole === "student" ? await getStudentMe() : await getInstructorMe();

  const [wallet, transactions] = await Promise.all([
    optional(getMyWallet(), {}),
    optional(getMyTransactions(), []),
  ]);

  return { user, wallet, transactions };
}
