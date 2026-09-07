import { ArrowRight, ClipboardList, FileCheck2 } from "lucide-react";

import { Link } from "@/src/i18n/navigation";
import { getMyOrders, type ApiOrder } from "@/lib/api/orders";
import { idOf, recordOf, textOf } from "@/lib/api/response";

function requestOf(order: ApiOrder) {
  const offer = recordOf(order.offer);
  return recordOf(order.request || offer.request);
}

export default async function AssignmentsPage() {
  const orders = await getMyOrders();
  const assignments = orders.filter((order) =>
    textOf(order.type, textOf(requestOf(order).type)).toLowerCase().includes("assignment"),
  );

  return (
    <div className="min-h-screen bg-[#F6F7F8] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#5CC0D6]">Academic support</p>
            <h1 className="mt-2 text-3xl font-black text-[#162535]">My Assignments</h1>
            <p className="mt-2 text-sm text-slate-500">Assignment orders accepted by instructors.</p>
          </div>
          <Link href="/upload/assignment" className="rounded-full bg-[#162535] px-6 py-3 text-sm font-black text-white">New assignment</Link>
        </div>

        <div className="space-y-4">
          {assignments.map((order, index) => {
            const request = requestOf(order);
            const id = order._id ?? order.id ?? idOf(order.offer);
            return (
              <article key={id || index} className="flex flex-col justify-between gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-[#5CC0D6]"><ClipboardList size={23} /></span>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-black text-[#162535]">{textOf(request.title, textOf(request.description, "Assignment order"))}</h2>
                    <p className="mt-1 text-xs text-slate-400">Status: {order.status ?? "active"}</p>
                  </div>
                </div>
                {id && <Link href={`/assignments/${id}`} className="inline-flex items-center gap-2 text-sm font-black text-[#5CC0D6]">View solution <ArrowRight size={15} /></Link>}
              </article>
            );
          })}
          {assignments.length === 0 && (
            <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-100">
              <FileCheck2 className="mx-auto text-slate-300" size={44} />
              <h2 className="mt-4 text-lg font-black text-[#162535]">No assignment orders</h2>
              <p className="mt-2 text-sm text-slate-500">Accepted assignment offers will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
