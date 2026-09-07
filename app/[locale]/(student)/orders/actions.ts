"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api/client";
import { createLiveOrder, createOrder } from "@/lib/api/orders";
import { markAllNotificationsRead } from "@/lib/api/notifications";

export type StudentOrderActionState = {
  message?: string;
  ok?: boolean;
};

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function toError(error: unknown): StudentOrderActionState {
  if (error instanceof ApiError) return { message: error.message };
  if (error instanceof Error) return { message: error.message };
  return { message: "Something went wrong. Please try again." };
}

export async function acceptOfferAsOrder(
  _state: StudentOrderActionState,
  formData: FormData,
): Promise<StudentOrderActionState> {
  const offer = text(formData, "offer");
  const isLive = text(formData, "type") === "live";
  if (!offer) return { message: "Missing offer id." };

  try {
    if (isLive) {
      await createLiveOrder({
        offer,
        timeOfNextSession:
          text(formData, "timeOfNextSession") || new Date().toISOString(),
        numberOfSessions: Number(text(formData, "numberOfSessions")) || 1,
      });
    } else {
      await createOrder(offer);
    }
  } catch (error) {
    return toError(error);
  }

  revalidatePath("/orders");
  return { ok: true, message: "Order created successfully." };
}

export async function markStudentNotificationsRead() {
  await markAllNotificationsRead();
  revalidatePath("/notifications");
}
