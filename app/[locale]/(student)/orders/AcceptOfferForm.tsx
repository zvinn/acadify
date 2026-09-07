"use client";

import { useActionState } from "react";

import {
  acceptOfferAsOrder,
  type StudentOrderActionState,
} from "./actions";

const initialState: StudentOrderActionState = {};

export function AcceptOfferForm({
  offerId,
  type,
}: {
  offerId: string;
  type?: string;
}) {
  const [state, formAction, pending] = useActionState(
    acceptOfferAsOrder,
    initialState,
  );

  return (
    <form action={formAction} className="mt-4">
      <input type="hidden" name="offer" value={offerId} />
      <input type="hidden" name="type" value={type ?? ""} />
      <input type="hidden" name="numberOfSessions" value="1" />
      {state.message && (
        <p
          className="mb-3 rounded-xl px-3 py-2 text-xs font-semibold"
          style={{
            background: state.ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: state.ok ? "#15803d" : "#dc2626",
          }}
        >
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-full text-sm font-extrabold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: "#162535" }}
      >
        {pending ? "Accepting..." : "Accept offer"}
      </button>
    </form>
  );
}
