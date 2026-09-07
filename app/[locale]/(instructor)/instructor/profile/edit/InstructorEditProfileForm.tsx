"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";

import { updateInstructorProfile, type AccountFormState } from "@/app/profile/actions";
import type { ApiUser } from "@/lib/api/profile";
import { Link } from "@/src/i18n/navigation";

const initialState: AccountFormState = {};

function valueOf(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function InstructorEditProfileForm({ user }: { user: ApiUser }) {
  const [state, formAction, pending] = useActionState(
    updateInstructorProfile,
    initialState,
  );

  return (
    <form action={formAction} className="mt-12 space-y-8">
      <FormSection title="Personal Info">
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
            label="Status"
            name="status"
            defaultValue={user.status}
            disabled={pending}
          />
          <TextField
            label="Current Job"
            name="currentJob"
            defaultValue={user.currentJob}
            disabled={pending}
          />
        </div>
      </FormSection>

      <FormSection title="Professional Info">
        <div className="grid gap-5 sm:grid-cols-2">
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
            label="Specialization"
            name="specialization"
            defaultValue={user.specialization}
            disabled={pending}
          />
        </div>
      </FormSection>

      {state.message && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {state.message}
        </p>
      )}

      <div className="flex items-center justify-end gap-8 pt-6">
        <Link
          href="/instructor/profile"
          className="text-sm font-black text-slate-700 transition-colors hover:text-slate-950"
        >
          Cancel
        </Link>
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

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl bg-[#e5f2ff] p-7 shadow-sm">
      <div className="mb-7 flex items-center gap-3 text-slate-950">
        <h2 className="text-lg font-black">{title}</h2>
      </div>
      {children}
    </section>
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
        className="h-11 w-full rounded-lg bg-white px-4 text-sm font-medium text-slate-700 outline-none ring-1 ring-transparent transition focus:ring-[#52bce3] disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  );
}
