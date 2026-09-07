"use client";

import { useActionState } from "react";

import {
  completePasswordReset,
  requestPasswordReset,
  verifyPasswordResetCode,
  type AuthFormState,
} from "@/app/auth/actions";
import { Link } from "@/src/i18n/navigation";

import { AuthButton, AuthInput } from "./AuthInput";
import { AuthFormMessage } from "./AuthFormMessage";

type PasswordResetRole = "student" | "instructor";
type PasswordResetStage = "request" | "verify" | "reset";

type PasswordResetFormProps = {
  role: PasswordResetRole;
  stage: PasswordResetStage;
  email?: string;
};

const initialState: AuthFormState = {};

export function PasswordResetForm({
  role,
  stage,
  email,
}: PasswordResetFormProps) {
  const action =
    stage === "request"
      ? requestPasswordReset.bind(null, role)
      : stage === "verify"
        ? verifyPasswordResetCode.bind(null, role)
        : completePasswordReset.bind(null, role);
  const [state, formAction, pending] = useActionState(action, initialState);

  if (state.success && state.nextHref) {
    return (
      <div className="space-y-6">
        <AuthFormMessage state={state} />
        <Link
          href={state.nextHref}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#55B5DE] text-sm font-bold text-white shadow-md transition-colors hover:bg-[#4eaade]"
        >
          {stage === "reset" ? "Back to login" : "Continue"}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {email && <input type="hidden" name="email" value={email} />}

      {stage === "request" && (
        <div className="space-y-2">
          <AuthInput
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your account email"
            required
            disabled={pending}
          />
          <AuthFormMessage state={state} field="email" />
        </div>
      )}

      {stage === "verify" && (
        <div className="space-y-2">
          <AuthInput
            label="Verification Code"
            name="resetCode"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter the code from your email"
            required
            disabled={pending}
          />
          <AuthFormMessage state={state} field="resetCode" />
        </div>
      )}

      {stage === "reset" && (
        <>
          <div className="space-y-2">
            <AuthInput
              label="New Password"
              name="newPassword"
              autoComplete="new-password"
              placeholder="Enter your new password"
              minLength={6}
              isPassword
              required
              disabled={pending}
            />
            <AuthFormMessage state={state} field="newPassword" />
          </div>
          <div className="space-y-2">
            <AuthInput
              label="Confirm Password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm your new password"
              minLength={6}
              isPassword
              required
              disabled={pending}
            />
            <AuthFormMessage state={state} field="confirmPassword" />
          </div>
        </>
      )}

      <AuthFormMessage state={state} />

      <AuthButton type="submit" disabled={pending}>
        {pending
          ? "Please wait..."
          : stage === "request"
            ? "Send verification code"
            : stage === "verify"
              ? "Verify code"
              : "Reset password"}
      </AuthButton>

      <Link
        href={`/auth/${role}/login`}
        className="text-center text-sm font-medium text-[#55B5DE] hover:underline"
      >
        Back to login
      </Link>
    </form>
  );
}
