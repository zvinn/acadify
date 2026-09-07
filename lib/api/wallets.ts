import "server-only";

import { apiRequest } from "@/lib/api/client";
import { arrayOf, objectOf } from "@/lib/api/response";

export type ApiWalletRecord = {
  _id?: string;
  id?: string;
  user?: unknown;
  balance?: number;
  balanceUSD?: number;
  freezedBalance?: number;
  freezedBalanceUSD?: number;
  isLocked?: boolean;
  createdAt?: string;
};

export type ApiWalletTransaction = {
  _id?: string;
  id?: string;
  user?: unknown;
  wallet?: unknown;
  type?: string;
  status?: string;
  amount?: number;
  amountUSD?: number;
  platform?: string;
  receipt?: string;
  createdAt?: string;
};

export async function getMyWalletRecord() {
  const payload = await apiRequest<unknown>("/api/v1/wallets/me");
  return objectOf<ApiWalletRecord>(payload, ["wallet"]);
}

export async function getMyBalance() {
  return apiRequest<unknown>("/api/v1/wallets/me/balance");
}

export async function getMyFreezedBalance() {
  return apiRequest<unknown>("/api/v1/wallets/me/freezedBalance");
}

export async function getWithdrawalRequests() {
  const payload = await apiRequest<unknown>("/api/v1/wallets/withdrawalRequests");
  return arrayOf<ApiWalletTransaction>(payload, ["withdrawalRequests", "transactions"]);
}

export function lockWallet(email: string) {
  return apiRequest<unknown>("/api/v1/wallets/lock", {
    method: "PUT",
    body: { email },
  });
}

export function unlockWallet(email: string) {
  return apiRequest<unknown>("/api/v1/wallets/unlock", {
    method: "PUT",
    body: { email },
  });
}

export function manualChargeWallet(email: string, balanceUSD: number) {
  return apiRequest<unknown>("/api/v1/wallets/manualCharge", {
    method: "PUT",
    body: { email, balanceUSD },
  });
}

export function withdrawFromWallet(amountUSD: number, platform: string) {
  return apiRequest<unknown>("/api/v1/wallets/withdraw", {
    method: "POST",
    body: { amountUSD, platform },
  });
}

export function approveWithdrawal(transactionId: string) {
  return apiRequest<unknown>(
    `/api/v1/wallets/withdraw/${transactionId}/approve`,
    { method: "PATCH" },
  );
}

export function uploadWithdrawalReceipt(transactionId: string, receipt: File) {
  const body = new FormData();
  body.set("receipt", receipt);
  return apiRequest<unknown>(
    `/api/v1/wallets/withdraw/${transactionId}/receipt`,
    { method: "PATCH", body },
  );
}

export function rejectWithdrawal(transactionId: string) {
  return apiRequest<unknown>(
    `/api/v1/wallets/withdraw/${transactionId}/reject`,
    { method: "PATCH" },
  );
}

export function createTransaction(body: Record<string, unknown>) {
  return apiRequest<unknown>("/api/v1/transactions", { method: "POST", body });
}

export async function getTransactions() {
  const payload = await apiRequest<unknown>("/api/v1/transactions");
  return arrayOf<ApiWalletTransaction>(payload, ["transactions"]);
}

export async function getTransaction(id: string) {
  const payload = await apiRequest<unknown>(`/api/v1/transactions/${id}`);
  return objectOf<ApiWalletTransaction>(payload, ["transaction"]);
}

export async function getTransactionsForUser(email: string) {
  const payload = await apiRequest<unknown>(
    `/api/v1/transactions/user?email=${encodeURIComponent(email)}`,
  );
  return arrayOf<ApiWalletTransaction>(payload, ["transactions"]);
}

export async function getMyWalletTransactions() {
  const payload = await apiRequest<unknown>("/api/v1/wallets/me/transactions");
  return arrayOf<ApiWalletTransaction>(payload, ["transactions"]);
}
