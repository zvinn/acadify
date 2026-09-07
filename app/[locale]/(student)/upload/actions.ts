"use server";

import { redirect } from "next/navigation";

import { ApiError, apiRequest } from "@/lib/api/client";

export type UploadRequestState = {
  message?: string;
};

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function toError(error: unknown): UploadRequestState {
  if (error instanceof ApiError) {
    return { message: error.message };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "Could not submit your request. Please try again." };
}

export async function createStudentRequest(
  _state: UploadRequestState,
  formData: FormData,
): Promise<UploadRequestState> {
  const title = text(formData, "title");
  const major = text(formData, "major");
  const requestType = text(formData, "type");
  const successType = text(formData, "successType") || "lecture";
  const files = formData
    .getAll("demoFiles")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (!title || !major || files.length === 0) {
    return { message: "Title, major ID, and at least one file are required." };
  }

  const payload = new FormData();
  payload.set("major", major);
  payload.set("title", title);
  payload.set("description", text(formData, "description") || title);

  const budget = text(formData, "budget");
  if (budget) {
    payload.set("budget", budget);
  }

  const deadline = text(formData, "deadline");
  if (deadline) {
    payload.set("deadline", new Date(deadline).toISOString());
  }

  if (requestType) {
    payload.set("type", requestType);
  }

  for (const file of files) {
    payload.append("demoFiles", file);
  }

  try {
    await apiRequest("/api/v1/requests", {
      method: "POST",
      body: payload,
    });
  } catch (error) {
    return toError(error);
  }

  redirect(`/upload/success?type=${encodeURIComponent(successType)}`);
}
