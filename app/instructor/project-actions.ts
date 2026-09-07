"use server";

import { revalidatePath } from "next/cache";

import {
  requestAssignmentApproval,
  requestAssignmentMeeting,
  scheduleAssignmentMeeting,
  uploadAssignmentSolution,
} from "@/lib/api/assignments";
import { ApiError } from "@/lib/api/client";
import { createLiveSession } from "@/lib/api/live";
import {
  cancelOrder,
  getOrderUploadUrl,
  submitOrder,
  uploadOrderDocuments,
  uploadOrderQuizzes,
} from "@/lib/api/orders";

export type ProjectActionState = {
  ok?: boolean;
  message?: string;
  uploadUrl?: string;
};

function text(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function files(data: FormData) {
  return data.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
}

function errorState(error: unknown): ProjectActionState {
  if (error instanceof ApiError || error instanceof Error) return { message: error.message };
  return { message: "The project operation failed." };
}

function findUploadUrl(value: unknown, depth = 0): string | undefined {
  if (typeof value === "string" && /^https?:\/\//i.test(value)) return value;
  if (!value || typeof value !== "object" || depth > 7) return undefined;
  const record = value as Record<string, unknown>;
  for (const key of ["uploadUrl", "url", "signedUrl", "upload_url"]) {
    const candidate = record[key];
    if (typeof candidate === "string" && /^https?:\/\//i.test(candidate)) return candidate;
  }
  for (const candidate of Object.values(record)) {
    const found = findUploadUrl(candidate, depth + 1);
    if (found) return found;
  }
  return undefined;
}

export async function manageInstructorProject(
  _state: ProjectActionState,
  data: FormData,
): Promise<ProjectActionState> {
  const operation = text(data, "operation");
  const orderId = text(data, "orderId");
  const offerId = text(data, "offerId");
  const requestId = text(data, "requestId");

  try {
    if (operation === "upload-documents" || operation === "upload-quizzes" || operation === "upload-solution") {
      const uploadedFiles = files(data);
      if (!uploadedFiles.length) return { message: "Choose at least one file." };
      if (operation === "upload-documents") await uploadOrderDocuments(offerId, uploadedFiles);
      else if (operation === "upload-quizzes") await uploadOrderQuizzes(offerId, uploadedFiles);
      else await uploadAssignmentSolution(requestId || orderId, uploadedFiles);
    } else if (operation === "prepare-video") {
      if (!offerId) return { message: "The order does not include an offer ID." };
      const payload = await getOrderUploadUrl(offerId);
      const uploadUrl = findUploadUrl(payload);
      if (!uploadUrl) return { message: "The backend response did not include an upload URL." };
      return { ok: true, message: "Upload URL created.", uploadUrl };
    } else if (operation === "submit") await submitOrder(offerId);
    else if (operation === "cancel") await cancelOrder(offerId);
    else if (operation === "request-approval") await requestAssignmentApproval(requestId || orderId, offerId || undefined);
    else if (operation === "request-meeting") await requestAssignmentMeeting(requestId || orderId);
    else if (operation === "schedule-meeting") {
      const time = text(data, "time");
      if (!time) return { message: "Meeting time is required." };
      await scheduleAssignmentMeeting(requestId || orderId, new Date(time).toISOString());
    } else if (operation === "create-live") {
      const time = text(data, "time");
      await createLiveSession({
        order: orderId || undefined,
        offer: offerId || undefined,
        timeOfNextSession: time ? new Date(time).toISOString() : undefined,
        numberOfSessions: Number(text(data, "numberOfSessions")) || 1,
      });
    } else return { message: "Unsupported project operation." };

    revalidatePath("/instructor/projects", "layout");
    return { ok: true, message: "Project updated successfully." };
  } catch (error) {
    return errorState(error);
  }
}
