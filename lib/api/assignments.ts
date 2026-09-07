import "server-only";

import { apiRequest } from "@/lib/api/client";
import { objectOf } from "@/lib/api/response";

export type ApiAssignment = {
  _id?: string;
  id?: string;
  request?: unknown;
  order?: unknown;
  instructor?: unknown;
  student?: unknown;
  status?: string;
  documents?: string[];
  meetingTime?: string;
  createdAt?: string;
};

export function createAssignmentRequest(body: {
  major: string;
  description: string;
  budget?: number | string;
  deadline?: string;
}) {
  return apiRequest<unknown>("/api/v1/assignments/createRequests", {
    method: "POST",
    body,
  });
}

export function acceptAssignment(id: string) {
  return apiRequest<unknown>(`/api/v1/assignments/${id}/accept`, {
    method: "PUT",
  });
}

export function uploadAssignmentSolution(id: string, documents: File[]) {
  const body = new FormData();
  documents.forEach((document) => body.append("documents", document));
  return apiRequest<unknown>(`/api/v1/assignments/${id}/uploadPdf`, {
    method: "PUT",
    body,
  });
}

export async function getAssignmentSolution(id: string) {
  const payload = await apiRequest<unknown>(`/api/v1/assignments/${id}/getSolution`);
  return objectOf<ApiAssignment>(payload, ["assignment", "solution"]);
}

export function requestAssignmentApproval(id: string, offer?: string) {
  return apiRequest<unknown>(`/api/v1/assignments/${id}/requestApproval`, {
    method: "PUT",
    body: offer ? { offer } : {},
  });
}

export function requestAssignmentMeeting(id: string) {
  return apiRequest<unknown>(`/api/v1/assignments/${id}/requestMeeting`, {
    method: "PUT",
  });
}

export function scheduleAssignmentMeeting(id: string, time: string) {
  return apiRequest<unknown>(`/api/v1/assignments/${id}/scheduleMeeting`, {
    method: "PUT",
    body: { time },
  });
}
