import { ArrowLeft, CalendarClock, Clock3, UserRound } from "lucide-react";

import { getSubscription } from "@/lib/api/subscriptions";
import { idOf, recordOf, textOf } from "@/lib/api/response";
import { Link } from "@/src/i18n/navigation";

function label(value: unknown, fallback: string) {
  const record = recordOf(value);
  return textOf(record.fullName, textOf(record.name, textOf(record.email, idOf(value) || fallback)));
}

export default async function AdminSubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subscription = await getSubscription(id);
  const items = [
    { title: "Student", value: label(subscription.studentId, "Not returned"), icon: UserRound },
    { title: "Plan", value: label(subscription.planId, "Not returned"), icon: Clock3 },
    { title: "Hours", value: String(subscription.numberOfHours ?? 0), icon: Clock3 },
    { title: "Status", value: subscription.status ?? "Unknown", icon: CalendarClock },
    { title: "Starts", value: subscription.startDate ? new Date(subscription.startDate).toLocaleString() : "Not returned", icon: CalendarClock },
    { title: "Ends", value: subscription.endDate ? new Date(subscription.endDate).toLocaleString() : "Not returned", icon: CalendarClock },
  ];

  return <div className="p-6 lg:p-9"><Link href="/admin/subscriptions" className="inline-flex items-center gap-2 text-sm font-bold text-[#5CC0D6]"><ArrowLeft size={16} /> Back to subscriptions</Link><h1 className="mt-6 text-3xl font-black text-[#162535]">Subscription details</h1><p className="mt-2 text-xs text-slate-400">{id}</p><div className="mt-7 grid gap-4 md:grid-cols-2">{items.map(({ title, value, icon: Icon }) => <article key={title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><Icon className="text-[#5CC0D6]" size={21} /><p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-400">{title}</p><p className="mt-2 break-words text-sm font-black text-[#162535]">{value}</p></article>)}</div></div>;
}
