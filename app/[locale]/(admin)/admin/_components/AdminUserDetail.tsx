"use client";

import { useActionState } from "react";

import type { ApiUserRecord } from "@/lib/api/users";
import { saveAdminUser, type AdminActionState } from "../actions";

const initialState: AdminActionState = {};

function value(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

export function AdminUserDetail({ kind, user }: { kind: "student" | "instructor"; user: ApiUserRecord }) {
  const [state, action, pending] = useActionState(saveAdminUser, initialState);
  const id = user._id ?? user.id ?? "";
  const fields = kind === "student"
    ? ["fullName", "email", "phoneNumber", "university", "faculty", "year", "status"]
    : ["fullName", "email", "phoneNumber", "university", "faculty", "specialization", "currentJob", "status"];
  return (
    <form action={action} className="grid gap-5 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100 md:grid-cols-2">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      {fields.map((field) => (
        <label key={field} className="block">
          <span className="mb-2 block text-xs font-black capitalize text-slate-500">{field.replace(/([A-Z])/g, " $1")}</span>
          <input name={field} defaultValue={value(user[field as keyof ApiUserRecord])} className="h-12 w-full rounded-xl bg-slate-50 px-4 text-sm font-semibold text-[#162535] outline-none ring-1 ring-slate-100 focus:ring-[#5CC0D6]" />
        </label>
      ))}
      {state.message && <p className={`md:col-span-2 rounded-xl px-4 py-3 text-sm font-bold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{state.message}</p>}
      <div className="md:col-span-2 flex justify-end">
        <button disabled={pending} className="rounded-full bg-[#162535] px-7 py-3 text-sm font-black text-white disabled:opacity-50">{pending ? "Saving..." : "Save changes"}</button>
      </div>
    </form>
  );
}
