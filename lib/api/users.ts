import "server-only";

import { apiRequest } from "@/lib/api/client";
import { arrayOf, objectOf } from "@/lib/api/response";

export type ApiRole = "student" | "instructor" | "admin";

export type ApiUserRecord = {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: ApiRole | string;
  age?: number;
  status?: string;
  university?: string;
  faculty?: string;
  specialization?: string;
  currentJob?: string;
  certifications?: string[];
  country?: unknown;
  major?: unknown;
  year?: string;
  wallet?: unknown;
  createdAt?: string;
  updatedAt?: string;
};

export type UserInput = Record<string, unknown>;

export async function createInstructor(body: UserInput) {
  return apiRequest<unknown>("/api/v1/instructors", { method: "POST", body });
}

export async function getInstructors() {
  const payload = await apiRequest<unknown>("/api/v1/instructors");
  return arrayOf<ApiUserRecord>(payload, ["instructors", "users"]);
}

export async function getInstructor(id: string) {
  const payload = await apiRequest<unknown>(`/api/v1/instructors/${id}`);
  return objectOf<ApiUserRecord>(payload, ["instructor", "user"]);
}

export async function updateInstructor(id: string, body: UserInput) {
  return apiRequest<unknown>(`/api/v1/instructors/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function deleteInstructor(id: string) {
  return apiRequest<unknown>(`/api/v1/instructors/${id}`, { method: "DELETE" });
}

export async function changeInstructorPassword(id: string, newPassword: string) {
  return apiRequest<unknown>(`/api/v1/instructors/changePassword/${id}`, {
    method: "PUT",
    body: { newPassword },
  });
}

export async function createStudent(body: UserInput | FormData) {
  return apiRequest<unknown>("/api/v1/students", { method: "POST", body });
}

export async function getStudents() {
  const payload = await apiRequest<unknown>("/api/v1/students");
  return arrayOf<ApiUserRecord>(payload, ["students", "users"]);
}

export async function getStudent(id: string) {
  const payload = await apiRequest<unknown>(`/api/v1/students/${id}`);
  return objectOf<ApiUserRecord>(payload, ["student", "user"]);
}

export async function updateStudent(id: string, body: UserInput) {
  return apiRequest<unknown>(`/api/v1/students/${id}`, {
    method: "PATCH",
    body,
  });
}

export async function deleteStudent(id: string) {
  return apiRequest<unknown>(`/api/v1/students/${id}`, { method: "DELETE" });
}

export async function changeStudentPassword(id: string, newPassword: string) {
  return apiRequest<unknown>(`/api/v1/students/changePassword/${id}`, {
    method: "PUT",
    body: { newPassword },
  });
}

export async function updateMyPassword(
  role: "student" | "instructor",
  body: {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  },
) {
  return apiRequest<unknown>(`/api/v1/${role}s/updateMyPassword`, {
    method: "PUT",
    body,
  });
}

export async function deleteMyAccount(role: "student" | "instructor") {
  return apiRequest<unknown>(`/api/v1/${role}s/deleteMe`, { method: "DELETE" });
}
