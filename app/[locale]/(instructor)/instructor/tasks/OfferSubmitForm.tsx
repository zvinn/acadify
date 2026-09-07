"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";

import { submitOffer, type InstructorActionState } from "@/app/instructor/actions";

const initialState: InstructorActionState = {};

export function OfferSubmitForm({
  requestId,
  label = "Confirm Offer",
  compact = false,
  successPath = "/instructor/tasks/explain/success",
}: {
  requestId: string;
  label?: string;
  compact?: boolean;
  successPath?: string;
}) {
  const [state, formAction, pending] = useActionState(submitOffer, initialState);

  return (
    <form action={formAction} className={compact ? "w-full sm:w-auto" : "w-full"}>
      <input type="hidden" name="request" value={requestId} />
      <input type="hidden" name="successPath" value={successPath} />
      {!compact && (
        <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-500">
          Estimated time
          <input
            name="estimateTime"
            type="number"
            min="1"
            defaultValue="2"
            className="mt-2 h-12 w-full rounded-md bg-white px-4 text-sm font-bold text-slate-950 outline-none ring-1 ring-slate-200 focus:ring-[#52bce3]"
          />
        </label>
      )}
      {compact && <input type="hidden" name="estimateTime" value="2" />}
      {state.message && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className={
          compact
            ? "flex w-full justify-center items-center bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-60"
            : "mt-2 inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#142235] text-sm font-black text-white shadow-[0_14px_22px_rgba(15,23,42,0.22)] transition-colors hover:bg-[#0f1a2a] disabled:opacity-60"
        }
      >
        {pending ? "Submitting..." : label}
        {!compact && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
