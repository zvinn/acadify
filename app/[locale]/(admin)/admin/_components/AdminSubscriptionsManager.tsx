"use client";

import { useActionState } from "react";
import { CalendarClock, CircleDollarSign, XCircle } from "lucide-react";

import type { ApiSubscription } from "@/lib/api/subscriptions";
import { idOf, recordOf, textOf } from "@/lib/api/response";
import { Link } from "@/src/i18n/navigation";
import { manageAdminSubscription, type AdminActionState } from "../actions";

const initialState: AdminActionState = {};

function relatedName(value: unknown, fallback: string) {
  const record = recordOf(value);
  return textOf(record.fullName, textOf(record.name, textOf(record.email, idOf(value) || fallback)));
}

export function AdminSubscriptionsManager({ subscriptions }: { subscriptions: ApiSubscription[] }) {
  return (
    <div className="p-6 lg:p-9">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5CC0D6]">Billing</p>
        <h1 className="mt-2 text-3xl font-black text-[#162535]">Subscriptions</h1>
        <p className="mt-2 text-sm text-slate-500">Live subscription records returned by the backend.</p>
      </div>

      <section className="mt-7 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
        {subscriptions.map((subscription, index) => (
          <SubscriptionRow key={idOf(subscription) || index} subscription={subscription} />
        ))}
        {subscriptions.length === 0 && (
          <p className="px-6 py-16 text-center text-sm text-slate-500">No subscriptions returned by the backend.</p>
        )}
      </section>
    </div>
  );
}

function SubscriptionRow({ subscription }: { subscription: ApiSubscription }) {
  const [state, action, pending] = useActionState(manageAdminSubscription, initialState);
  const id = idOf(subscription);
  const plan = relatedName(subscription.planId, "Subscription plan");
  const student = relatedName(subscription.studentId, "Student");
  const status = textOf(subscription.status, "unknown");
  const canCancel = id && !["cancelled", "canceled", "expired"].includes(status.toLowerCase());

  return (
    <article className="border-b border-slate-100 px-6 py-5 last:border-0">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <Link href={`/admin/subscriptions/${id}`} className="text-sm font-black text-[#162535] hover:text-[#5CC0D6]">
            {plan}
          </Link>
          <p className="mt-1 truncate text-xs text-slate-500">{student}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1.5"><CircleDollarSign size={12} /> {subscription.numberOfHours ?? 0} hours</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1.5"><CalendarClock size={12} /> {status}</span>
          </div>
        </div>
        {canCancel && (
          <form action={action}>
            <input type="hidden" name="id" value={id} />
            <button disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-600 disabled:opacity-50">
              <XCircle size={15} /> {pending ? "Cancelling..." : "Cancel"}
            </button>
          </form>
        )}
      </div>
      {state.message && <p className={`mt-3 text-xs font-bold ${state.ok ? "text-emerald-600" : "text-red-600"}`}>{state.message}</p>}
    </article>
  );
}
