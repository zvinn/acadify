"use client";

import { useActionState } from "react";

import { updateStudentProfile, type AccountFormState } from "@/app/profile/actions";
import type { ApiUser } from "@/lib/api/profile";

const initialState: AccountFormState = {};

function valueOf(value: unknown) {
  if (typeof value === "string") {
    return value;
  }
  return "";
}

export function StudentEditProfileForm({ user }: { user: ApiUser }) {
  const [state, formAction, pending] = useActionState(
    updateStudentProfile,
    initialState,
  );

  return (
    <form action={formAction} className="mt-10 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full Name"
          name="fullName"
          defaultValue={user.fullName ?? user.name}
          disabled={pending}
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          defaultValue={user.phoneNumber}
          disabled={pending}
        />
        <TextField
          label="University"
          name="university"
          defaultValue={user.university}
          disabled={pending}
        />
        <TextField
          label="Faculty"
          name="faculty"
          defaultValue={user.faculty}
          disabled={pending}
        />
        <TextField
          label="Academic Year"
          name="year"
          defaultValue={user.year}
          disabled={pending}
        />
      </div>

      {state.message && (
        <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {state.message}
        </p>
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 min-w-36 items-center justify-center rounded-lg bg-[#52bce3] px-8 text-sm font-black text-white transition-colors hover:bg-[#3ba8ce] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function TextField({
  label,
  name,
  defaultValue,
  disabled,
}: {
  label: string;
  name: string;
  defaultValue?: unknown;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black text-slate-700">{label}</span>
      <input
        name={name}
        type="text"
        defaultValue={valueOf(defaultValue)}
        disabled={disabled}
        className="h-11 w-full rounded-lg bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none ring-1 ring-slate-200 transition focus:ring-[#52bce3] disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  );
}
