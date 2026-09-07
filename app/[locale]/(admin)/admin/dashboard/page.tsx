import { ClipboardList, GraduationCap, PackageCheck, Users2, WalletCards } from "lucide-react";

import { getAllOrders } from "@/lib/api/orders";
import { getAllRequests } from "@/lib/api/requests";
import { getSubscriptions } from "@/lib/api/subscriptions";
import { getInstructors, getStudents } from "@/lib/api/users";
import { getTransactions } from "@/lib/api/wallets";

async function fallback<T>(promise: Promise<T>, value: T) {
  try { return await promise; } catch { return value; }
}

export default async function AdminDashboardPage() {
  const [students, instructors, requests, orders, transactions, subscriptions] = await Promise.all([
    fallback(getStudents(), []), fallback(getInstructors(), []), fallback(getAllRequests(), []),
    fallback(getAllOrders(), []), fallback(getTransactions(), []), fallback(getSubscriptions(), []),
  ]);
  const volume = transactions.reduce((sum, transaction) => sum + Math.abs(transaction.amountUSD ?? transaction.amount ?? 0), 0);
  const cards = [
    { label: "Students", value: students.length, icon: GraduationCap, color: "#8B5CF6" },
    { label: "Instructors", value: instructors.length, icon: Users2, color: "#F97316" },
    { label: "Requests", value: requests.length, icon: ClipboardList, color: "#5CC0D6" },
    { label: "Orders", value: orders.length, icon: PackageCheck, color: "#EC4899" },
    { label: "Subscriptions", value: subscriptions.length, icon: WalletCards, color: "#22C55E" },
    { label: "Transaction volume", value: `$${volume.toLocaleString("en-US")}`, icon: WalletCards, color: "#F59E0B" },
  ];
  const completed = orders.filter((order) => /complete|approved/i.test(order.status ?? "")).length;

  return <div className="p-6 lg:p-9"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#5CC0D6]">Live overview</p><h1 className="mt-2 text-3xl font-black text-[#162535]">Admin Dashboard</h1><p className="mt-2 text-sm text-slate-500">Metrics derived from the current production APIs.</p></div><div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{cards.map(({ label, value, icon: Icon, color }) => <article key={label} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${color}18`, color }}><Icon size={21} /></span><p className="mt-5 text-sm font-semibold text-slate-400">{label}</p><p className="mt-1 text-3xl font-black text-[#162535]">{value}</p></article>)}</div><section className="mt-8 rounded-3xl bg-[#162535] p-8 text-white shadow-lg"><h2 className="text-xl font-black">Order completion</h2><p className="mt-2 text-sm text-white/50">{completed} of {orders.length} orders are completed or approved.</p><div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#5CC0D6]" style={{ width: `${orders.length ? Math.round((completed / orders.length) * 100) : 0}%` }} /></div></section></div>;
}
