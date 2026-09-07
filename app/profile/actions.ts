"use server";

import { redirect } from "next/navigation";

import { ApiError } from "@/lib/api/client";
import {
  requestWithdrawal,
  updateInstructorMe,
  updateStudentMe,
} from "@/lib/api/profile";

export type AccountFormState = {
  message?: string;
  ok?: boolean;
};

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function toError(error: unknown): AccountFormState {
  if (error instanceof ApiError) {
    return { message: error.message };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "Something went wrong. Please try again." };
}

function userPayload(formData: FormData) {
  const payload: Record<string, unknown> = {};
  for (const field of [
    "fullName",
    "university",
    "faculty",
    "specialization",
    "status",
    "currentJob",
    "phoneNumber",
    "year",
  ]) {
    const value = text(formData, field);
    if (value) {
      payload[field] = value;
    }
  }
  return payload;
}

export async function updateStudentProfile(
  _state: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  try {
    await updateStudentMe(userPayload(formData));
  } catch (error) {
    return toError(error);
  }

  redirect("/profile");
}

export async function updateInstructorProfile(
  _state: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  try {
    await updateInstructorMe(userPayload(formData));
  } catch (error) {
    return toError(error);
  }

  redirect("/instructor/profile");
}

export async function createWithdrawalRequest(
  _state: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const amount = Number(text(formData, "amountUSD"));
  const platform = text(formData, "platform") || "instapay";

  if (!Number.isFinite(amount) || amount <= 0) {
    return { message: "Enter a valid withdrawal amount." };
  }

  try {
    await requestWithdrawal({ amountUSD: amount, platform });
  } catch (error) {
    return toError(error);
  }

  return { ok: true, message: "Withdrawal request sent successfully." };
}
