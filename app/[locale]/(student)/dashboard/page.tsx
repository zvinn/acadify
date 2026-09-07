import { ArrowRight, BookOpen, ClipboardList, Clock3, ShoppingCart, UploadCloud, Wallet } from "lucide-react";

import { Link } from "@/src/i18n/navigation";
import { getMyOrders } from "@/lib/api/orders";
import { getAccountSnapshot } from "@/lib/api/profile";
import { getMyRequests } from "@/lib/api/requests";

async function fallback<T>(promise: Promise<T>, value: T) {
  try {
    return await promise;
  } catch {
    return value;
  }
}

export default async function StudentDashboardPage() {
  const [requests, orders, account] = await Promise.all([
    fallback(getMyRequests(), []),
    fallback(getMyOrders(), []),
    fallback(getAccountSnapshot("student"), { user: {}, wallet: {}, transactions: [] }),
  ]);
  const name = account.user.fullName ?? account.user.name ?? "Student";
  const balance = account.wallet.balanceUSD ?? account.wallet.balance ?? 0;
  const currency = account.wallet.balanceUSD != null ? "USD" : account.wallet.currency ?? "EGP";

  const cards = [
    { label: "Requests", value: requests.length, icon: ClipboardList, color: "#5CC0D6", href: "/orders" },
    { label: "Orders", value: orders.length, icon: ShoppingCart, color: "#8B5CF6", href: "/orders" },
    { label: "Wallet", value: `${balance} ${currency}`, icon: Wallet, color: "#F59E0B", href: "/wallet" },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F8] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[32px] bg-[#162535] p-8 text-white shadow-lg md:p-10">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#5CC0D6]/15 blur-3xl" />
          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#5CC0D6]">Student dashboard</p>
              <h1 className="mt-3 text-3xl font-black md:text-4xl">Welcome back, {name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                Your requests, accepted orders, and wallet are loaded directly from the backend.
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#5CC0D6] px-7 text-sm font-black text-white shadow-lg transition-transform hover:scale-105"
            >
              <UploadCloud size={18} />
              New request
            </Link>
          </div>
        </section>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {cards.map(({ label, value, icon: Icon, color, href }) => (
            <Link key={label} href={href} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-transform hover:-translate-y-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${color}18`, color }}>
                <Icon size={21} />
              </span>
              <p className="mt-5 text-sm font-semibold text-slate-400">{label}</p>
              <p className="mt-1 text-3xl font-black text-[#162535]">{value}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#162535]">Recent requests</h2>
                <p className="mt-1 text-xs text-slate-400">Latest submissions from your account</p>
              </div>
              <Link href="/orders" className="inline-flex items-center gap-1 text-sm font-bold text-[#5CC0D6]">
                View all <ArrowRight size={15} />
              </Link>
            </div>
            <div className="space-y-3">
              {requests.slice(0, 5).map((request, index) => {
                const id = request._id ?? request.id ?? "";
                return (
                  <Link
                    key={id || index}
                    href={id ? `/orders/${id}` : "/orders"}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4 hover:bg-slate-100"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#162535]">{request.title ?? request.description ?? "Student request"}</p>
                      <p className="mt-1 text-xs text-slate-400">{request.type ?? "request"}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-slate-500">{request.status ?? "pending"}</span>
                  </Link>
                );
              })}
              {requests.length === 0 && <p className="rounded-2xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">No requests yet.</p>}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-xl font-black text-[#162535]">Quick actions</h2>
            <div className="mt-5 space-y-3">
              {[
                { label: "Upload lecture", href: "/upload/lecture", icon: BookOpen },
                { label: "Upload assignment", href: "/upload/assignment", icon: ClipboardList },
                { label: "Book a trial", href: "/upload/trial", icon: Clock3 },
              ].map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href} className="flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-4 text-sm font-bold text-[#162535] hover:border-[#5CC0D6]/40 hover:bg-cyan-50/40">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-[#5CC0D6]"><Icon size={18} /></span>
                  {label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
