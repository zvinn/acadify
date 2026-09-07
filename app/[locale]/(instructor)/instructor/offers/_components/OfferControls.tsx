"use client";

import { useActionState } from "react";
import { Clock3, XCircle } from "lucide-react";

import {
  cancelInstructorOffer,
  saveOfferEstimate,
  type InstructorActionState,
} from "@/app/instructor/actions";

const initialState: InstructorActionState = {};

export function OfferControls({ offerId, estimatedTime }: { offerId: string; estimatedTime: number }) {
  const [estimateState, estimateAction, estimatePending] = useActionState(saveOfferEstimate, initialState);
  const [cancelState, cancelAction, cancelPending] = useActionState(cancelInstructorOffer, initialState);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <form action={estimateAction} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
        <input type="hidden" name="offerId" value={offerId} />
        <Clock3 className="text-[#5CC0D6]" size={21} />
        <h3 className="mt-3 text-sm font-black">Update estimated time</h3>
        <input name="estimatedTime" type="number" min="1" defaultValue={estimatedTime || 1} className="mt-4 h-11 w-full rounded-xl bg-white px-4 text-sm font-black text-[#162535]" />
        <button disabled={estimatePending} className="mt-4 rounded-full bg-[#5CC0D6] px-5 py-2.5 text-xs font-black text-white disabled:opacity-50">{estimatePending ? "Saving..." : "Save estimate"}</button>
        {estimateState.message && <p className={`mt-3 text-xs font-bold ${estimateState.ok ? "text-emerald-200" : "text-red-200"}`}>{estimateState.message}</p>}
      </form>

      <form action={cancelAction} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
        <input type="hidden" name="offerId" value={offerId} />
        <XCircle className="text-red-300" size={21} />
        <h3 className="mt-3 text-sm font-black">Cancel offer</h3>
        <p className="mt-2 text-xs leading-5 text-white/55">This calls the production cancellation endpoint immediately.</p>
        <button disabled={cancelPending} className="mt-4 rounded-full bg-red-500 px-5 py-2.5 text-xs font-black text-white disabled:opacity-50">{cancelPending ? "Cancelling..." : "Cancel offer"}</button>
        {cancelState.message && <p className={`mt-3 text-xs font-bold ${cancelState.ok ? "text-emerald-200" : "text-red-200"}`}>{cancelState.message}</p>}
      </form>
    </div>
  );
}
