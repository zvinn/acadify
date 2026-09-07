"use client";

import { useActionState, useState } from "react";
import { Plus, Search, Trash2, UserRound } from "lucide-react";

import { Link } from "@/src/i18n/navigation";
import type { ApiUserRecord } from "@/lib/api/users";
import {
  removeAdminUser,
  saveAdminUser,
  type AdminActionState,
} from "../actions";

const initialState: AdminActionState = {};

function idOf(user: ApiUserRecord) {
  return user._id ?? user.id ?? "";
}

export function AdminUserManager({
  kind,
  users,
}: {
  kind: "student" | "instructor";
  users: ApiUserRecord[];
}) {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [state, action, pending] = useActionState(saveAdminUser, initialState);
  const filtered = users.filter((user) =>
    `${user.fullName ?? user.name ?? ""} ${user.email ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div className="p-6 lg:p-9">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5CC0D6]">User management</p>
          <h1 className="mt-2 text-3xl font-black capitalize text-[#162535]">{kind}s</h1>
          <p className="mt-2 text-sm text-slate-500">{users.length} backend records</p>
        </div>
        <button type="button" onClick={() => setShowForm((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#162535] px-6 py-3 text-sm font-black text-white">
          <Plus size={17} /> Add {kind}
        </button>
      </div>

      {showForm && (
        <form action={action} className="mt-7 grid gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:grid-cols-2">
          <input type="hidden" name="kind" value={kind} />
          <Field name="fullName" label="Full name" required />
          <Field name="email" label="Email" type="email" required />
          <Field name="phoneNumber" label="Phone number" />
          <Field name="password" label="Temporary password" type="password" required />
          {kind === "student" ? (
            <>
              <Field name="major" label="Major ID" />
              <Field name="country" label="Country ID" />
              <Field name="university" label="University" />
              <Field name="year" label="Academic year" />
            </>
          ) : (
            <>
              <Field name="specialization" label="Specialization" />
              <Field name="currentJob" label="Current job" />
              <Field name="university" label="University" />
              <Field name="status" label="Status" />
            </>
          )}
          {state.message && <p className={`md:col-span-2 rounded-xl px-4 py-3 text-sm font-bold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{state.message}</p>}
          <div className="md:col-span-2 flex justify-end">
            <button disabled={pending} className="rounded-full bg-[#5CC0D6] px-7 py-3 text-sm font-black text-white disabled:opacity-50">{pending ? "Saving..." : `Create ${kind}`}</button>
          </div>
        </form>
      )}

      <div className="mt-7 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <Search size={18} className="text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${kind}s`} className="w-full bg-transparent text-sm font-medium text-[#162535] outline-none" />
        </label>
        <div className="mt-4 divide-y divide-slate-100">
          {filtered.map((user, index) => {
            const id = idOf(user);
            return (
              <article key={id || index} className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-[#5CC0D6]"><UserRound size={20} /></span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[#162535]">{user.fullName ?? user.name ?? `Unnamed ${kind}`}</p>
                    <p className="mt-1 truncate text-xs text-slate-400">{user.email ?? "No email"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {id && <Link href={`/admin/${kind}s/${id}`} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-[#162535]">View / edit</Link>}
                  {id && (
                    <form action={removeAdminUser} onSubmit={(event) => { if (!window.confirm(`Delete this ${kind}?`)) event.preventDefault(); }}>
                      <input type="hidden" name="kind" value={kind} />
                      <input type="hidden" name="id" value={id} />
                      <button aria-label={`Delete ${kind}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500"><Trash2 size={16} /></button>
                    </form>
                  )}
                </div>
              </article>
            );
          })}
          {filtered.length === 0 && <p className="py-12 text-center text-sm text-slate-500">No matching records.</p>}
        </div>
      </div>
    </div>
  );
}

function Field({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black text-slate-500">{label}</span>
      <input name={name} type={type} required={required} className="h-12 w-full rounded-xl bg-slate-50 px-4 text-sm font-semibold text-[#162535] outline-none ring-1 ring-slate-100 focus:ring-[#5CC0D6]" />
    </label>
  );
}
