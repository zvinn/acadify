"use server";

import { redirect } from "next/navigation";

import { apiRequest, ApiError } from "@/lib/api/client";
import {
  requestPasswordReset as requestPasswordResetApi,
  resetPassword as resetPasswordApi,
  verifyResetCode as verifyResetCodeApi,
} from "@/lib/api/auth";
import { setSession, clearSession, type AuthRole } from "@/lib/auth/session";

export type AuthFormState = {
  message?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
  nextHref?: string;
};

type PasswordResetRole = "student" | "instructor";

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function withPhoneCode(formData: FormData) {
  const code = text(formData, "phoneCode");
  const phone = text(formData, "phoneNumber");
  if (!code) {
    return phone;
  }
  return `${code}${phone.replace(/\D/g, "")}`;
}

function findStringValue(payload: unknown, keys: string[]): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  for (const value of Object.values(record)) {
    const nested = findStringValue(value, keys);
    if (nested) {
      return nested;
    }
  }

  return null;
}

function getAuthToken(payload: unknown) {
  return findStringValue(payload, [
    "token",
    "accessToken",
    "access_token",
    "jwt",
  ]);
}

function getAuthRole(payload: unknown, fallback: AuthRole): AuthRole {
  const role = findStringValue(payload, ["role", "userType"])?.toLowerCase();
  if (role === "admin" || role === "student" || role === "instructor") {
    return role;
  }
  return fallback;
}

function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function toAuthError(error: unknown): AuthFormState {
  if (isApiError(error)) {
    return { message: error.message };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Something went wrong. Please try again." };
}

function authKind(role: PasswordResetRole) {
  return role === "student" ? "students" : "instructors";
}

function resetFlowHref(
  role: PasswordResetRole,
  stage: "verify" | "reset",
  email: string,
) {
  return `/auth/${role}/password-reset/${stage}?email=${encodeURIComponent(email)}`;
}

function validateLogin(formData: FormData): AuthFormState | null {
  const fieldErrors: Record<string, string> = {};

  if (!text(formData, "email")) {
    fieldErrors.email = "Email is required.";
  }
  if (!text(formData, "password")) {
    fieldErrors.password = "Password is required.";
  }

  return Object.keys(fieldErrors).length > 0 ? { fieldErrors } : null;
}

function getSafeNextPath(formData: FormData, fallback: string) {
  const next = text(formData, "next");
  if (!next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }
  return next;
}

function validateRegister(formData: FormData): AuthFormState | null {
  const fieldErrors: Record<string, string> = {};
  const password = text(formData, "password");
  const confirmPassword = text(formData, "confirmPassword");

  for (const field of ["fullName", "email", "password", "phoneNumber"]) {
    if (!text(formData, field)) {
      fieldErrors[field] = "This field is required.";
    }
  }

  if (password && password.length < 6) {
    fieldErrors.password = "Password must be at least 6 characters.";
  }

  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  return Object.keys(fieldErrors).length > 0 ? { fieldErrors } : null;
}

async function login(
  formData: FormData,
  role: AuthRole,
  endpoint: string,
  fallbackRedirectTo: string,
) {
  const validationError = validateLogin(formData);
  if (validationError) {
    return validationError;
  }

  // Demo mode: allow instant login with test credentials or direct bypass
  if (process.env.DEMO_MODE === "true") {
    const email = (text(formData, "email") || "").toLowerCase();
    let resolvedRole = role;
    if (email.includes("admin")) {
      resolvedRole = "admin";
    } else if (email.includes("instructor") || role === "instructor") {
      resolvedRole = "instructor";
    } else {
      resolvedRole = "student";
    }

    await setSession({ token: "demo-jwt-token", role: resolvedRole });
    const roleFallback =
      resolvedRole === "admin"
        ? "/admin/dashboard"
        : resolvedRole === "instructor"
          ? "/instructor/tasks"
          : fallbackRedirectTo;
    redirect(getSafeNextPath(formData, roleFallback));
  }

  let token: string | null = null;
  let resolvedRole = role;

  try {
    const payload = await apiRequest(endpoint, {
      method: "POST",
      auth: false,
      body: {
        email: text(formData, "email"),
        password: text(formData, "password"),
      },
    });
    token = getAuthToken(payload);
    resolvedRole = getAuthRole(payload, role);
  } catch (error) {
    return toAuthError(error);
  }

  if (!token) {
    return {
      message:
        "Login succeeded but the API response did not include an auth token.",
    };
  }

  await setSession({ token, role: resolvedRole });
  const roleFallback =
    resolvedRole === "admin"
      ? "/admin/dashboard"
      : resolvedRole === "instructor"
        ? "/instructor/tasks"
        : fallbackRedirectTo;
  redirect(getSafeNextPath(formData, roleFallback));
}

export async function loginStudent(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  return login(
    formData,
    "student",
    "/api/v1/auth/students/login",
    "/dashboard",
  );
}

export async function loginInstructor(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  return login(
    formData,
    "instructor",
    "/api/v1/auth/instructors/login",
    "/instructor/tasks",
  );
}

export async function registerStudent(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validationError = validateRegister(formData);
  if (validationError) {
    return validationError;
  }

  const payload = new FormData();
  for (const field of [
    "fullName",
    "university",
    "faculty",
    "major",
    "year",
    "email",
    "password",
    "country",
    "wallet",
  ]) {
    const value = text(formData, field);
    if (value) {
      payload.set(field, value);
    }
  }

  payload.set("phoneNumber", withPhoneCode(formData));
  payload.set("role", "student");

  const studentIdImage = formData.get("StudentIdImage");
  if (studentIdImage instanceof File && studentIdImage.size > 0) {
    payload.set("StudentIdImage", studentIdImage);
  }

  try {
    await apiRequest("/api/v1/auth/students/signup", {
      method: "POST",
      auth: false,
      body: payload,
    });
  } catch (error) {
    return toAuthError(error);
  }

  redirect("/auth/student/login?registered=1");
}

export async function registerInstructor(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validationError = validateRegister(formData);
  if (validationError) {
    return validationError;
  }

  try {
    await apiRequest("/api/v1/auth/instructors/signup", {
      method: "POST",
      auth: false,
      body: {
        fullName: text(formData, "fullName"),
        age: Number(text(formData, "age")) || undefined,
        status: text(formData, "status"),
        currentJob: text(formData, "currentJob"),
        certifications: text(formData, "certifications")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        university: text(formData, "university"),
        faculty: text(formData, "faculty"),
        specialization: text(formData, "specialization"),
        email: text(formData, "email"),
        password: text(formData, "password"),
        role: "instructor",
        phoneNumber: withPhoneCode(formData),
        major: text(formData, "major"),
        country: text(formData, "country"),
      },
    });
  } catch (error) {
    return toAuthError(error);
  }

  redirect("/auth/instructor/login?registered=1");
}

export async function requestPasswordReset(
  role: PasswordResetRole,
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = text(formData, "email");
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { fieldErrors: { email: "Enter a valid email address." } };
  }

  try {
    await requestPasswordResetApi(authKind(role), email);
    return {
      success: true,
      message: "A verification code was sent to your email address.",
      nextHref: resetFlowHref(role, "verify", email),
    };
  } catch (error) {
    return toAuthError(error);
  }
}

export async function verifyPasswordResetCode(
  role: PasswordResetRole,
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = text(formData, "email");
  const resetCode = text(formData, "resetCode");
  if (!email) {
    return { message: "Start the password reset process again." };
  }
  if (!resetCode) {
    return { fieldErrors: { resetCode: "Verification code is required." } };
  }

  try {
    await verifyResetCodeApi(authKind(role), resetCode);
    return {
      success: true,
      message: "Verification code accepted.",
      nextHref: resetFlowHref(role, "reset", email),
    };
  } catch (error) {
    return toAuthError(error);
  }
}

export async function completePasswordReset(
  role: PasswordResetRole,
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = text(formData, "email");
  const newPassword = text(formData, "newPassword");
  const confirmPassword = text(formData, "confirmPassword");
  const fieldErrors: Record<string, string> = {};

  if (!email) {
    return { message: "Start the password reset process again." };
  }
  if (newPassword.length < 6) {
    fieldErrors.newPassword = "Password must be at least 6 characters.";
  }
  if (newPassword !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    await resetPasswordApi(authKind(role), { email, newPassword });
    return {
      success: true,
      message: "Your password has been reset. You can now log in.",
      nextHref: `/auth/${role}/login`,
    };
  } catch (error) {
    return toAuthError(error);
  }
}

export async function logout() {
  await clearSession();
  redirect("/");
}
