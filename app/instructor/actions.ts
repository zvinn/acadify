"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ApiError } from "@/lib/api/client";
import { createOffer, updateOfferEstimate, cancelOffer } from "@/lib/api/offers";
import { markAllNotificationsRead } from "@/lib/api/notifications";

export type InstructorActionState = {
  message?: string;
  ok?: boolean;
};

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function toError(error: unknown): InstructorActionState {
  if (error instanceof ApiError) return { message: error.message };
  if (error instanceof Error) return { message: error.message };
  return { message: "Something went wrong. Please try again." };
}

function safeInstructorPath(path: string) {
  return path.startsWith("/instructor/") ? path : "/instructor/tasks/explain/success";
}

export async function submitOffer(
  _state: InstructorActionState,
  formData: FormData,
): Promise<InstructorActionState> {
  const request = text(formData, "request");
  const estimate = Number(text(formData, "estimateTime"));
  const successPath = safeInstructorPath(text(formData, "successPath"));

  if (!request) {
    return { message: "Missing request id." };
  }

  try {
    await createOffer({
      request,
      ...(Number.isFinite(estimate) && estimate > 0
        ? { estimateTime: estimate, estimatedTime: estimate }
        : {}),
    });
  } catch (error) {
    return toError(error);
  }

  revalidatePath("/instructor/tasks");
  revalidatePath("/instructor/offers");
  redirect(successPath);
}

export async function saveOfferEstimate(
  _state: InstructorActionState,
  formData: FormData,
): Promise<InstructorActionState> {
  const offerId = text(formData, "offerId");
  const estimatedTime = Number(text(formData, "estimatedTime"));

  if (!offerId || !Number.isFinite(estimatedTime) || estimatedTime <= 0) {
    return { message: "Offer id and estimated time are required." };
  }

  try {
    await updateOfferEstimate(offerId, { estimatedTime });
  } catch (error) {
    return toError(error);
  }

  revalidatePath("/instructor/offers");
  return { ok: true, message: "Offer estimate updated." };
}

export async function cancelInstructorOffer(
  _state: InstructorActionState,
  formData: FormData,
): Promise<InstructorActionState> {
  const offerId = text(formData, "offerId");
  if (!offerId) {
    return { message: "Missing offer id." };
  }

  try {
    await cancelOffer(offerId);
  } catch (error) {
    return toError(error);
  }

  revalidatePath("/instructor/offers");
  return { ok: true, message: "Offer cancelled." };
}

export async function markInstructorNotificationsRead() {
  await markAllNotificationsRead();
  revalidatePath("/instructor/notifications");
}
