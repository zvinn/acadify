"use client";

import { useActionState, useState } from "react";
import { ClipboardList, PackageCheck, Trash2 } from "lucide-react";

import type { ApiOrder } from "@/lib/api/orders";
import type { ApiRequestItem } from "@/lib/api/requests";
import { recordOf, textOf } from "@/lib/api/response";
import { manageRequest, type AdminActionState } from "../actions";

const initialState: AdminActionState = {};

export function AdminOrdersManager({ requests, orders }: { requests: ApiRequestItem[]; orders: ApiOrder[] }) {
  const [tab, setTab] = useState<"requests" | "orders">("requests");
  return <div className="p-6 lg:p-9"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#5CC0D6]">Operations</p><h1 className="mt-2 text-3xl font-black text-[#162535]">Requests & Orders</h1><p className="mt-2 text-sm text-slate-500">Live backend workflow records.</p></div><div className="mt-7 flex gap-2">{(["requests", "orders"] as const).map((key) => <button key={key} type="button" onClick={() => setTab(key)} className={`rounded-full px-5 py-2.5 text-sm font-black capitalize ${tab === key ? "bg-[#162535] text-white" : "bg-white text-slate-500 ring-1 ring-slate-100"}`}>{key} ({key === "requests" ? requests.length : orders.length})</button>)}</div>{tab === "requests" ? <RequestList requests={requests} /> : <OrderList orders={orders} />}</div>;
}

function RequestList({ requests }: { requests: ApiRequestItem[] }) {
  return <div className="mt-6 space-y-4">{requests.map((request, index) => <RequestRow key={request._id ?? request.id ?? index} request={request} />)}{requests.length === 0 && <Empty label="No requests returned." />}</div>;
}

function RequestRow({ request }: { request: ApiRequestItem }) {
  const [state, action, pending] = useActionState(manageRequest, initialState);
  const id = request._id ?? request.id ?? "";
  return <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center"><div className="flex min-w-0 items-center gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-[#5CC0D6]"><ClipboardList size={20} /></span><div className="min-w-0"><h2 className="truncate text-sm font-black text-[#162535]">{request.title ?? request.description ?? "Request"}</h2><p className="mt-1 text-xs text-slate-400">{request.type ?? "request"} · {request.status ?? "pending"} · {id}</p></div></div>{id && <form action={action} className="flex flex-wrap items-center gap-2"><input type="hidden" name="id" value={id} /><select name="status" defaultValue={request.status ?? "pending"} className="h-10 rounded-xl bg-slate-50 px-3 text-xs font-bold text-[#162535] outline-none ring-1 ring-slate-100">{["pending", "approved", "in_progress", "completed", "cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}</select><button name="operation" value="status" disabled={pending} className="h-10 rounded-xl bg-[#5CC0D6] px-4 text-xs font-black text-white">Update</button><button name="operation" value="delete" disabled={pending} className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500"><Trash2 size={16} /></button></form>}</div>{state.message && <p className={`mt-4 rounded-xl px-4 py-3 text-xs font-bold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{state.message}</p>}</article>;
}

function OrderList({ orders }: { orders: ApiOrder[] }) {
  return <div className="mt-6 space-y-4">{orders.map((order, index) => { const offer = recordOf(order.offer); const request = recordOf(order.request || offer.request); return <article key={order._id ?? order.id ?? index} className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-500"><PackageCheck size={20} /></span><div className="min-w-0"><h2 className="truncate text-sm font-black text-[#162535]">{textOf(request.title, textOf(request.description, "Order"))}</h2><p className="mt-1 text-xs text-slate-400">{order.type ?? textOf(request.type, "order")} · {order.status ?? "active"} · {order._id ?? order.id}</p></div></article>; })}{orders.length === 0 && <Empty label="No orders returned." />}</div>;
}

function Empty({ label }: { label: string }) { return <p className="rounded-3xl bg-white px-6 py-14 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-100">{label}</p>; }
