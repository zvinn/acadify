"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";

import {
  createWithdrawalRequest,
  type AccountFormState,
} from "@/app/profile/actions";

const initialState: AccountFormState = {};

export function WithdrawRequestForm() {
  const [state, formAction, pending] = useActionState(
    createWithdrawalRequest,
    initialState,
  );

  return (
    <form action={formAction} className="rounded-xl bg-[#eaf3ff] p-8 shadow-sm">
      <h2 className="text-2xl font-black text-slate-950">Select Payout Method</h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {[
          { id: "vodafone", name: "Vodafone Cash", description: "Instant Mobile Wallet" },
          { id: "instapay", name: "InstaPay", description: "Direct Bank Transfer" },
        ].map((method) => (
          <label
            key={method.id}
            className="relative flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl bg-white p-6 text-center ring-1 ring-transparent transition hover:ring-slate-200 has-[:checked]:ring-2 has-[:checked]:ring-[#142235]"
          >
            <input
              type="radio"
              name="platform"
              value={method.id}
              defaultChecked={method.id === "instapay"}
              className="sr-only"
              disabled={pending}
            />
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f8ff] text-xs font-black text-[#142235]">
              {method.id}
            </span>
            <span className="mt-5 text-lg font-black text-slate-950">
              {method.name}
            </span>
            <span className="mt-1 text-sm font-medium text-slate-500">
              {method.description}
            </span>
          </label>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-3 block text-sm font-black text-slate-700">
            Amount USD
          </span>
          <input
            name="amountUSD"
            type="number"
            min="1"
            step="0.01"
            placeholder="50"
            disabled={pending}
            className="h-14 w-full rounded-xl bg-white px-5 text-base font-medium text-slate-700 outline-none ring-1 ring-transparent transition placeholder:text-slate-300 focus:ring-[#52bce3] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
        <label className="block">
          <span className="mb-3 block text-sm font-black text-slate-700">
            Phone / Account
          </span>
          <input
            name="account"
            type="text"
            placeholder="01X XXXX XXXX"
            disabled={pending}
            className="h-14 w-full rounded-xl bg-white px-5 text-base font-medium text-slate-700 outline-none ring-1 ring-transparent transition placeholder:text-slate-300 focus:ring-[#52bce3] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
      </div>

      {state.message && (
        <p
          className={`mt-5 rounded-lg px-4 py-3 text-sm font-semibold ${
            state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex h-16 w-full items-center justify-center gap-2 rounded-xl bg-[#142235] text-lg font-black text-white shadow-[0_16px_24px_rgba(15,23,42,0.18)] transition-colors hover:bg-[#203349] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending..." : "Request Withdrawal"}
        <ArrowRight className="h-5 w-5" />
      </button>
    </form>
  );
}
