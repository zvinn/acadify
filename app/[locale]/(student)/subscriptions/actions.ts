"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api/client";
import { cancelSubscription, createSubscription } from "@/lib/api/subscriptions";

export type SubscriptionActionState = { ok?: boolean; message?: string };

function text(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function failure(error: unknown): SubscriptionActionState {
  if (error instanceof ApiError || error instanceof Error) return { message: error.message };
  return { message: "The subscription operation failed." };
}

export async function manageStudentSubscription(
  _state: SubscriptionActionState,
  data: FormData,
): Promise<SubscriptionActionState> {
  try {
    if (text(data, "operation") === "cancel") {
      const id = text(data, "id");
      if (!id) return { message: "Subscription ID is required." };
      await cancelSubscription(id);
    } else {
      const planId = text(data, "planId");
      if (!planId) return { message: "Choose a subscription plan." };
      await createSubscription(planId, text(data, "majorId") || undefined);
    }
    revalidatePath("/subscriptions");
    return { ok: true, message: "Subscription updated successfully." };
  } catch (error) {
    return failure(error);
  }
}
