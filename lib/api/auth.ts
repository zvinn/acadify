import "server-only";

import { apiRequest } from "@/lib/api/client";

type AuthKind = "students" | "instructors";

function passwordResetPath(kind: AuthKind, operation: string) {
  const prefix =
    kind === "students" ? "/api/v1/auth/students" : "/instructors";
  return `${prefix}/${operation}`;
}

export function requestPasswordReset(kind: AuthKind, email: string) {
  return apiRequest<unknown>(passwordResetPath(kind, "forgetPassword"), {
    method: "POST",
    auth: false,
    body: { email },
  });
}

export function verifyResetCode(kind: AuthKind, resetCode: string) {
  return apiRequest<unknown>(passwordResetPath(kind, "verifyResetCode"), {
    method: "POST",
    auth: false,
    body: { resetCode },
  });
}

export function resetPassword(
  kind: AuthKind,
  body: { email: string; newPassword: string },
) {
  return apiRequest<unknown>(passwordResetPath(kind, "resetPassword"), {
    method: "PUT",
    auth: false,
    body,
  });
}
