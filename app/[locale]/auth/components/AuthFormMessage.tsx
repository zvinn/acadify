"use client";

import type { AuthFormState } from "@/app/auth/actions";

export function AuthFormMessage({
  state,
  field,
}: {
  state: AuthFormState;
  field?: string;
}) {
  const message = field ? state.fieldErrors?.[field] : state.message;

  if (!message) {
    return null;
  }

  return (
    <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200">
      {message}
    </p>
  );
}
