"use client";

import { useActionState } from "react";
import { Check, Clock3, XCircle } from "lucide-react";

import type { ApiSubscription, ApiSubscriptionPlan } from "@/lib/api/subscriptions";
import { idOf, recordOf, textOf } from "@/lib/api/response";
import { manageStudentSubscription, type SubscriptionActionState } from "./actions";

const initialState: SubscriptionActionState = {};

function planName(value: unknown) {
  const record = recordOf(value);
  return textOf(record.name, idOf(value) || "Subscription plan");
}

function priceOf(plan: ApiSubscriptionPlan) {
  if (typeof plan.price === "number") return `${plan.price.toLocaleString()} USD`;
  const price = recordOf(plan.price);
  const value = typeof price.amount === "number" ? price.amount.toLocaleString() : "--";
  return `${value} ${textOf(price.currency, "USD")}`;
}

export function SubscriptionsClient({
  plans,
  subscriptions,
  majorId,
  availabilityMessage,
}: {
  plans: ApiSubscriptionPlan[];
  subscriptions: ApiSubscription[];
  majorId: string;
  availabilityMessage?: string;
}) {
  return (
    <div className="p-6 lg:p-9">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5CC0D6]">Study plans</p>
        <h1 className="mt-2 text-3xl font-black text-[#162535]">Subscriptions</h1>
        <p className="mt-2 text-sm text-slate-500">Choose a backend plan and track your active subscription.</p>
      </div>

      {availabilityMessage && <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">{availabilityMessage}</p>}

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan, index) => <PlanCard key={idOf(plan) || index} plan={plan} majorId={majorId} />)}
        {plans.length === 0 && <p className="rounded-3xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm md:col-span-2 xl:col-span-3">No subscription plans are available from the backend.</p>}
      </div>

      <section className="mt-9 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="border-b border-slate-100 px-6 py-5"><h2 className="text-lg font-black text-[#162535]">My subscriptions</h2></div>
        {subscriptions.map((subscription, index) => <SubscriptionRow key={idOf(subscription) || index} subscription={subscription} />)}
        {subscriptions.length === 0 && <p className="px-6 py-12 text-center text-sm text-slate-500">No subscription records returned for your account.</p>}
      </section>
    </div>
  );
}

function PlanCard({ plan, majorId }: { plan: ApiSubscriptionPlan; majorId: string }) {
  const [state, action, pending] = useActionState(manageStudentSubscription, initialState);
  const id = idOf(plan);
  return <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-[#5CC0D6]"><Clock3 size={21} /></div><h2 className="mt-5 text-xl font-black text-[#162535]">{plan.name ?? "Study plan"}</h2><p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">{plan.description ?? `${plan.numberOfHours ?? 0} learning hours`}</p><p className="mt-5 text-2xl font-black text-[#162535]">{priceOf(plan)}</p><form action={action} className="mt-5"><input type="hidden" name="planId" value={id} />{majorId && <input type="hidden" name="majorId" value={majorId} />}<button disabled={pending || !id} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5CC0D6] px-5 py-3 text-sm font-black text-white disabled:opacity-50"><Check size={16} /> {pending ? "Subscribing..." : "Choose plan"}</button></form>{state.message && <p className={`mt-3 text-xs font-bold ${state.ok ? "text-emerald-600" : "text-red-600"}`}>{state.message}</p>}</article>;
}

function SubscriptionRow({ subscription }: { subscription: ApiSubscription }) {
  const [state, action, pending] = useActionState(manageStudentSubscription, initialState);
  const id = idOf(subscription);
  const status = textOf(subscription.status, "unknown");
  const canCancel = id && !["cancelled", "canceled", "expired"].includes(status.toLowerCase());
  return <article className="border-b border-slate-100 px-6 py-5 last:border-0"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-sm font-black text-[#162535]">{planName(subscription.planId)}</p><p className="mt-1 text-xs text-slate-500">{subscription.numberOfHours ?? 0} hours · {status}</p></div>{canCancel && <form action={action}><input type="hidden" name="operation" value="cancel" /><input type="hidden" name="id" value={id} /><button disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-600 disabled:opacity-50"><XCircle size={15} /> {pending ? "Cancelling..." : "Cancel"}</button></form>}</div>{state.message && <p className={`mt-3 text-xs font-bold ${state.ok ? "text-emerald-600" : "text-red-600"}`}>{state.message}</p>}</article>;
}
